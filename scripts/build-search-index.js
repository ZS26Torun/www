#!/usr/bin/env node
/* scripts/build-search-index.js
   Skanuje wszystkie strony *.html w katalogu głównym i buduje data/search-index.json
   używany przez components/search.js (wyszukiwarka globalna). */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT  = path.join(ROOT, 'data', 'search-index.json');

const EXCLUDE = new Set(['404.html']);

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
  '&quot;': '"', '&#39;': "'", '&apos;': "'", '&ndash;': '–', '&mdash;': '—',
};

function decodeEntities(str) {
  return str.replace(/&[a-z#0-9]+;/gi, m => ENTITIES[m] ?? m);
}

function extractText(html) {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  return s.replace(/\s+/g, ' ').trim();
}

function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  const full = decodeEntities(m[1]).replace(/\s+/g, ' ').trim();
  return full.split(' – ')[0].trim();
}

function extractDescription(html) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  if (!m) return '';
  return decodeEntities(m[1]).replace(/\s+/g, ' ').trim();
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', file), 'utf8')); }
  catch { return null; }
}

// Strony renderowane w dużej mierze z JS (news.json/kalendarz.json) mają mało
// tekstu w samym HTML — dokładamy treść ze źródłowych danych JSON.
function extraContent(file) {
  if (file.startsWith('aktualnosci')) {
    const news = readJson('news.json');
    if (!news) return '';
    const key = file.includes('-etr') ? 'excerpt_etr' : 'excerpt';
    return news.posts.map(p => `${p.title}. ${p[key] || p.excerpt}`).join(' ');
  }
  if (file.startsWith('kalendarz')) {
    const cal = readJson('kalendarz.json');
    if (!cal) return '';
    const all = [...(cal.events || []), ...(cal.customEvents || [])].filter(e => !e._example);
    return all.map(e => `${e.label}${e.note ? '. ' + e.note : ''}`).join(' ');
  }
  return '';
}

function build() {
  const files = fs.readdirSync(ROOT)
    .filter(f => f.endsWith('.html') && !EXCLUDE.has(f) && !f.startsWith('google'));

  const index = files.map(file => {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const content = [extractText(html), extraContent(file)].filter(Boolean).join(' ');
    return {
      url: file,
      title: extractTitle(html) || file,
      description: extractDescription(html),
      isEtr: file.endsWith('-etr.html'),
      content,
    };
  });

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(index));
  console.log(`search-index.json: ${index.length} stron, ${fs.statSync(OUT).size} B`);
}

build();
