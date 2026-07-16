#!/usr/bin/env node
/* scripts/build-static-content.js
   Renderuje treść z data/news.json i data/kalendarz.json bezpośrednio do statycznego
   HTML w aktualnosci.html i kalendarz.html (między znacznikami <!-- ssg:*:start/end -->),
   żeby wyszukiwarki widziały realną treść w pierwszej odpowiedzi HTML, bez czekania na JS.
   JS na stronie i tak nadpisuje tę samą zawartość przy fetch() — workflow dodawania
   newsów/terminów się nie zmienia, edytuje się wyłącznie pliki JSON w data/. */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── Aktualności ──────────────────────────────────────────────────────

const CATEGORY_LABELS = { 'ogłoszenie': 'Ogłoszenie', 'wydarzenie': 'Wydarzenie', 'rekrutacja': 'Rekrutacja' };
const CATEGORY_COLORS = { 'ogłoszenie': 'badge-ogłoszenie', 'wydarzenie': 'badge-wydarzenie', 'rekrutacja': 'badge-rekrutacja' };

function formatDatePl(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
    'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  return `${d} ${months[m - 1]} ${y}`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderNewsHtml() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'news.json'), 'utf8'));
  const posts = (data.posts || [])
    .slice()
    .sort((a, b) => { if (a.pinned !== b.pinned) return a.pinned ? -1 : 1; return new Date(b.date) - new Date(a.date); });

  return posts.map(n => `
        <article class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow${n.pinned ? ' ring-2 ring-brand-200' : ''}">
          ${n.pinned ? `<div class="flex items-center gap-1.5 text-xs font-semibold text-brand-600 mb-3"><i data-lucide="pin" class="w-3.5 h-3.5"></i>Przypięte</div>` : ''}
          <div class="flex items-center gap-2 mb-3 flex-wrap">
            <span class="${CATEGORY_COLORS[n.category] || 'badge-inne'} text-xs font-semibold px-2.5 py-0.5 rounded-full">${CATEGORY_LABELS[n.category] || escapeHtml(n.category)}</span>
            <time datetime="${n.date}" class="text-xs text-gray-500 ml-auto">${formatDatePl(n.date)}</time>
          </div>
          <h2 class="text-base font-bold text-gray-900 mb-2">${escapeHtml(n.title)}</h2>
          <p class="text-gray-500 text-sm leading-relaxed">${escapeHtml(n.excerpt)}</p>
        </article>`).join('');
}

// ── Kalendarz (widok listy) ─────────────────────────────────────────

const TYPE = {
  'rok-szkolny': { icon: 'play-circle', card: 'bg-leaf-600/5 border-leaf-600/20', icon_bg: 'bg-leaf-600/15', icon_color: 'text-leaf-700', date_color: 'text-leaf-700' },
  'przerwa':     { icon: 'snowflake',   card: 'bg-blue-50 border-blue-100',       icon_bg: 'bg-blue-100',    icon_color: 'text-blue-500',  date_color: 'text-blue-700' },
  'ferie':       { icon: 'sun',         card: 'bg-amber-50 border-amber-100',     icon_bg: 'bg-amber-100',   icon_color: 'text-amber-500', date_color: 'text-amber-700' },
  'swieto':      { icon: 'flag',        card: 'bg-brand-50 border-brand-200',     icon_bg: 'bg-brand-100',   icon_color: 'text-brand-700', date_color: 'text-brand-700' },
  'custom':      { icon: 'star',        card: 'bg-purple-50 border-purple-200',   icon_bg: 'bg-purple-100',  icon_color: 'text-purple-600', date_color: 'text-purple-700' },
};

const MONTHS_PL  = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const MONTHS_GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

function fmtDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return `${d} ${MONTHS_GEN[m - 1]} ${y} r.`;
}
function fmtRange(s, e) {
  const [sy, sm, sd] = s.split('-').map(Number);
  const [ey, em, ed] = e.split('-').map(Number);
  if (sm === em) return `${sd}–${ed} ${MONTHS_GEN[sm - 1]} ${sy === ey ? sy : sy + '/' + ey} r.`;
  return `${sd} ${MONTHS_GEN[sm - 1]} – ${ed} ${MONTHS_GEN[em - 1]} ${sy === ey ? sy : sy + '/' + ey} r.`;
}
function dateLabel(ev) {
  if (ev.date) return fmtDate(ev.date);
  return fmtRange(ev.dateStart, ev.dateEnd);
}

function buildList(events) {
  const byMonth = {};
  events.forEach(ev => {
    const month = (ev.date || ev.dateStart).slice(0, 7);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(ev);
  });

  return Object.keys(byMonth).sort().map(ym => {
    const [, m] = ym.split('-').map(Number);
    const heading = `${MONTHS_PL[m - 1]} ${ym.slice(0, 4)}`;
    const cards = byMonth[ym].map(ev => {
      const t = TYPE[ev.type] || TYPE['custom'];
      const noteHtml = ev.note ? `<p class="text-xs text-gray-500 mt-0.5">${escapeHtml(ev.note)}</p>` : '';
      return `
            <div class="flex items-start gap-4 ${t.card} border rounded-xl p-4">
              <span class="mt-0.5 w-9 h-9 rounded-lg ${t.icon_bg} flex items-center justify-center flex-shrink-0">
                <i data-lucide="${t.icon}" class="w-5 h-5 ${t.icon_color}"></i>
              </span>
              <div>
                <p class="font-semibold text-gray-900">${escapeHtml(ev.label)}</p>
                <p class="text-sm ${t.date_color} font-medium">${dateLabel(ev)}</p>
                ${noteHtml}
              </div>
            </div>`;
    }).join('');

    return `
          <div class="mb-10">
            <h2 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">${heading}</h2>
            <div class="space-y-3">${cards}</div>
          </div>`;
  }).join('');
}

function renderKalendarzHtml() {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'kalendarz.json'), 'utf8'));
  const custom = (data.customEvents || []).filter(e => !e._example);
  const all = [...(data.events || []), ...custom.map(e => ({ ...e, type: 'custom' }))];
  all.sort((a, b) => (a.date || a.dateStart) > (b.date || b.dateStart) ? 1 : -1);
  return buildList(all);
}

// ── Iniekcja między znacznikami ─────────────────────────────────────

function injectBetweenMarkers(filePath, markerName, html) {
  const file = path.join(ROOT, filePath);
  const start = `<!-- ssg:${markerName}:start -->`;
  const end = `<!-- ssg:${markerName}:end -->`;
  const src = fs.readFileSync(file, 'utf8');
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(src)) throw new Error(`Nie znaleziono znaczników ssg:${markerName} w ${filePath}`);
  const out = src.replace(re, `${start}${html}${end}`);
  fs.writeFileSync(file, out, 'utf8');
  console.log(`✓ ${filePath} — wstrzyknięto statyczną treść (${markerName})`);
}

injectBetweenMarkers('aktualnosci.html', 'news', renderNewsHtml());
injectBetweenMarkers('kalendarz.html', 'kalendarz', renderKalendarzHtml());
