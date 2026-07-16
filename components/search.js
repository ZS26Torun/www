/* components/search.js — Globalna wyszukiwarka (modal, przeszukuje wszystkie strony) */

(function () {
  const DIACRITICS = {
    'ą':'a','ć':'c','ę':'e','ł':'l','ń':'n','ó':'o','ś':'s','ź':'z','ż':'z',
    'Ą':'A','Ć':'C','Ę':'E','Ł':'L','Ń':'N','Ó':'O','Ś':'S','Ź':'Z','Ż':'Z',
  };
  function norm(str) {
    return str.toLowerCase().replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, c => (DIACRITICS[c] || c).toLowerCase());
  }
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  let indexData = null;
  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch('data/search-index.json')
        .then(r => r.ok ? r.json() : [])
        .then(data => { indexData = data; return data; })
        .catch(() => { indexData = []; return []; });
    }
    return indexPromise;
  }

  function search(query) {
    const q = norm(query.trim());
    if (!q || !indexData) return [];
    const results = [];
    for (const page of indexData) {
      const title = norm(page.title);
      const desc = norm(page.description);
      const content = norm(page.content);
      let score = 0;
      let idx = -1;
      if (title.includes(q)) { score += 10; idx = title.indexOf(q); }
      if (desc.includes(q)) score += 5;
      const cIdx = content.indexOf(q);
      if (cIdx !== -1) { score += 1; if (idx === -1) idx = -1; }
      if (score === 0) continue;
      results.push({ page, score, contentIdx: cIdx });
    }
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 8);
  }

  function snippet(page, contentIdx, q) {
    if (contentIdx === -1) return escapeHtml(page.description || '');
    const raw = page.content;
    const start = Math.max(0, contentIdx - 40);
    const end = Math.min(raw.length, contentIdx + q.length + 60);
    let snip = (start > 0 ? '…' : '') + raw.slice(start, end) + (end < raw.length ? '…' : '');
    return highlight(escapeHtml(snip), q);
  }

  function highlight(escapedText, q) {
    if (!q) return escapedText;
    const normText = norm(escapedText);
    const nq = norm(q);
    const i = normText.indexOf(nq);
    if (i === -1) return escapedText;
    return escapedText.slice(0, i)
      + '<mark class="bg-yellow-200 text-gray-900 rounded-sm">' + escapedText.slice(i, i + q.length) + '</mark>'
      + escapedText.slice(i + q.length);
  }

  function renderResults(query, results) {
    const list = document.getElementById('search-results');
    const empty = document.getElementById('search-empty');
    if (!list) return;
    if (!query.trim()) {
      list.innerHTML = '';
      list.classList.add('hidden');
      empty.classList.add('hidden');
      return;
    }
    if (results.length === 0) {
      list.innerHTML = '';
      list.classList.add('hidden');
      empty.classList.remove('hidden');
      empty.textContent = `Brak wyników dla „${query}”`;
      return;
    }
    empty.classList.add('hidden');
    list.classList.remove('hidden');
    list.innerHTML = results.map((r, i) => `
      <li role="option" id="search-opt-${i}" aria-selected="${i === 0}">
        <a href="${r.page.url}"
          class="search-result-link block px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors ${i === 0 ? 'bg-gray-50' : ''}"
          data-index="${i}">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-gray-800 truncate">${highlight(escapeHtml(r.page.title), query)}</p>
            ${r.page.isEtr ? '<span class="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-leaf-600/10 text-leaf-700 px-1.5 py-0.5 rounded">Łatwy tekst</span>' : ''}
          </div>
          <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">${snippet(r.page, r.contentIdx, query)}</p>
        </a>
      </li>`).join('');
  }

  function openModal() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    if (!overlay) return;
    lastFocused = document.activeElement;
    overlay.classList.remove('hidden');
    loadIndex().then(() => { if (input.value) renderResults(input.value, search(input.value)); });
    input.value = '';
    renderResults('', []);
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  let lastFocused = null;
  let activeIndex = 0;

  function moveSelection(delta) {
    const items = Array.from(document.querySelectorAll('.search-result-link'));
    if (!items.length) return;
    activeIndex = (activeIndex + delta + items.length) % items.length;
    items.forEach((el, i) => {
      el.classList.toggle('bg-gray-50', i === activeIndex);
      el.parentElement.setAttribute('aria-selected', String(i === activeIndex));
    });
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function buildModal() {
    if (document.getElementById('search-overlay')) return;
    const wrap = document.createElement('div');
    wrap.id = 'search-overlay';
    wrap.className = 'hidden fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20 sm:pt-28 px-4 print:hidden';
    wrap.innerHTML = `
      <div id="search-panel" role="dialog" aria-modal="true" aria-label="Wyszukiwarka"
        class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <i data-lucide="search" class="w-5 h-5 text-gray-400 flex-shrink-0"></i>
          <input id="search-input" type="text" autocomplete="off"
            placeholder="Szukaj na stronie…" aria-label="Szukaj na stronie"
            class="flex-grow outline-none text-sm text-gray-800 placeholder:text-gray-400">
          <button id="search-close" aria-label="Zamknij wyszukiwarkę"
            class="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors flex-shrink-0">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <ul id="search-results" role="listbox" aria-label="Wyniki wyszukiwania"
          class="hidden max-h-80 overflow-y-auto p-2 space-y-0.5"></ul>
        <p id="search-empty" class="hidden px-4 py-6 text-sm text-gray-500 text-center"></p>
        <div class="px-4 py-2 border-t border-gray-50 text-[11px] text-gray-400 flex items-center gap-3">
          <span>↑↓ nawigacja</span><span>Enter przejdź</span><span>Esc zamknij</span>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

    const input = document.getElementById('search-input');
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        activeIndex = 0;
        loadIndex().then(() => renderResults(input.value, search(input.value)));
      }, 120);
    });

    document.getElementById('search-close').addEventListener('click', closeModal);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });

    wrap.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); moveSelection(1); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveSelection(-1); return; }
      if (e.key === 'Enter') {
        const active = document.querySelector('.search-result-link.bg-gray-50');
        if (active) { e.preventDefault(); window.location.href = active.getAttribute('href'); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildModal();

    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    // Skrót klawiszowy: "/" otwiera wyszukiwarkę (poza polami tekstowymi)
    document.addEventListener('keydown', e => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      openModal();
    });
  });
})();
