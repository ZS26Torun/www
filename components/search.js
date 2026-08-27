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
      if (title.includes(q)) score += 10;
      if (desc.includes(q)) score += 5;
      const cIdx = content.indexOf(q);
      if (cIdx !== -1) score += 1;
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
    const snip = (start > 0 ? '…' : '') + raw.slice(start, end) + (end < raw.length ? '…' : '');
    return highlight(snip, q);
  }

  // Podświetlanie działa na surowym tekście, a escapowanie następuje dopiero na
  // poszczególnych fragmentach — inaczej wycinanie po indeksie mogło rozerwać
  // encję HTML (np. &amp;) i wyprodukować uszkodzony znacznik.
  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const i = norm(text).indexOf(norm(q));
    if (i === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, i))
      + '<mark class="bg-yellow-200 text-gray-900 rounded-sm">' + escapeHtml(text.slice(i, i + q.length)) + '</mark>'
      + escapeHtml(text.slice(i + q.length));
  }

  // ── Stan ───────────────────────────────────────────────────────────────────
  let lastFocused = null;
  let activeIndex = 0;
  let optionCount = 0;

  function announce(msg) {
    const el = document.getElementById('search-status');
    if (el) el.textContent = msg;
  }

  function setActive(i) {
    const input = document.getElementById('search-input');
    const opts = document.querySelectorAll('#search-results [role="option"]');
    if (!opts.length) { input.removeAttribute('aria-activedescendant'); return; }
    activeIndex = (i + opts.length) % opts.length;
    opts.forEach((el, n) => {
      const on = n === activeIndex;
      el.setAttribute('aria-selected', String(on));
      el.classList.toggle('bg-gray-50', on);
    });
    input.setAttribute('aria-activedescendant', opts[activeIndex].id);
    opts[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function renderResults(query, results) {
    const list  = document.getElementById('search-results');
    const empty = document.getElementById('search-empty');
    const input = document.getElementById('search-input');
    if (!list) return;

    optionCount = results.length;
    activeIndex = 0;
    input.removeAttribute('aria-activedescendant');

    if (!query.trim()) {
      list.innerHTML = '';
      list.classList.add('hidden');
      empty.classList.add('hidden');
      input.setAttribute('aria-expanded', 'false');
      announce('');
      return;
    }
    if (results.length === 0) {
      list.innerHTML = '';
      list.classList.add('hidden');
      empty.classList.remove('hidden');
      empty.textContent = `Brak wyników dla „${query}”`;
      input.setAttribute('aria-expanded', 'false');
      announce(`Brak wyników dla ${query}`);
      return;
    }

    empty.classList.add('hidden');
    list.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
    list.innerHTML = results.map((r, i) => `
      <li role="option" id="search-opt-${i}" aria-selected="${i === 0}"
        data-href="${escapeHtml(r.page.url)}"
        class="search-result-link block px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${i === 0 ? 'bg-gray-50' : ''}">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-gray-800 truncate">${highlight(r.page.title, query)}</p>
          ${r.page.isEtr ? '<span class="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide bg-leaf-600/10 text-leaf-700 px-1.5 py-0.5 rounded">Łatwy tekst</span>' : ''}
        </div>
        <p class="text-xs text-gray-500 mt-0.5 line-clamp-2">${snippet(r.page, r.contentIdx, query)}</p>
      </li>`).join('');

    input.setAttribute('aria-activedescendant', 'search-opt-0');
    announce(results.length === 1
      ? '1 wynik wyszukiwania. Użyj strzałek w górę i w dół, aby przeglądać, Enter aby otworzyć.'
      : `Liczba wyników: ${results.length}. Użyj strzałek w górę i w dół, aby przeglądać, Enter aby otworzyć.`);
  }

  function goTo(i) {
    const opts = document.querySelectorAll('#search-results [role="option"]');
    const el = opts[i];
    if (el) window.location.href = el.getAttribute('data-href');
  }

  // ── Pułapka fokusu (WCAG 2.4.3) ────────────────────────────────────────────
  // aria-modal="true" obiecuje czytnikom ekranu, że reszta strony jest
  // niedostępna — inert na treści strony faktycznie tego dotrzymuje.
  function pageRegions() {
    return Array.from(document.body.children)
      .filter(el => el.id !== 'search-overlay' && el.tagName !== 'SCRIPT');
  }
  function setPageInert(on) {
    pageRegions().forEach(el => {
      if (on) { el.setAttribute('inert', ''); el.dataset.searchInert = '1'; }
      else if (el.dataset.searchInert) { el.removeAttribute('inert'); delete el.dataset.searchInert; }
    });
  }

  function openModal() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    if (!overlay || !overlay.classList.contains('hidden')) return;

    // Menu mobilne i panel ułatwień mają własne blokady `inert`. Gdyby
    // któraś została aktywna, pole wyszukiwania nie przyjęłoby fokusu i okno
    // byłoby całkowicie nieoperacyjne (WCAG 2.1.1, 2.4.3).
    window.zs26CloseMenu?.();
    window.zs26CloseA11yPanel?.();
    overlay.removeAttribute('inert');
    delete overlay.dataset.menuInert;
    delete overlay.dataset.a11yInert;

    lastFocused = document.activeElement;
    overlay.classList.remove('hidden');
    setPageInert(true);
    input.value = '';
    renderResults('', []);
    loadIndex();
    input.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    overlay.classList.add('hidden');
    setPageInert(false);
    document.body.style.overflow = '';
    announce('');
    // Element, który otworzył okno, mógł w międzyczasie zniknąć (np. przycisk
    // w zamkniętym menu) — wtedy fokus wraca na lupę w pasku nawigacji.
    const back = (lastFocused && lastFocused.isConnected && !lastFocused.closest('[inert]'))
      ? lastFocused
      : document.querySelector('#site-header [data-search-trigger]');
    if (back && back.focus) back.focus();
  }

  function buildModal() {
    if (document.getElementById('search-overlay')) return;
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const shortcutHint = (isMac ? '⌘' : 'Ctrl') + ' + K otwiera';

    const wrap = document.createElement('div');
    wrap.id = 'search-overlay';
    wrap.className = 'hidden fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20 sm:pt-28 px-4 print:hidden';
    wrap.innerHTML = `
      <div id="search-panel" role="dialog" aria-modal="true" aria-label="Wyszukiwarka"
        class="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <i data-lucide="search" class="w-5 h-5 text-gray-500 flex-shrink-0"></i>
          <input id="search-input" type="text" autocomplete="off"
            placeholder="Szukaj na stronie…" aria-label="Szukaj na stronie"
            role="combobox" aria-expanded="false" aria-controls="search-results"
            aria-autocomplete="list" aria-haspopup="listbox"
            class="flex-grow outline-none text-sm text-gray-800 placeholder:text-gray-500">
          <button id="search-close" type="button" aria-label="Zamknij wyszukiwarkę"
            class="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors flex-shrink-0">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>
        <ul id="search-results" role="listbox" aria-label="Wyniki wyszukiwania"
          class="hidden max-h-80 overflow-y-auto p-2 space-y-0.5"></ul>
        <p id="search-empty" class="hidden px-4 py-6 text-sm text-gray-500 text-center"></p>
        <p id="search-status" class="sr-only" role="status" aria-live="polite"></p>
        <div class="px-4 py-2 border-t border-gray-50 text-[11px] text-gray-500 flex flex-wrap items-center gap-3">
          <span>↑↓ nawigacja</span><span>Enter przejdź</span><span>Esc zamknij</span><span>${shortcutHint}</span>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

    const input = document.getElementById('search-input');
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadIndex().then(() => renderResults(input.value, search(input.value)));
      }, 200);
    });

    document.getElementById('search-close').addEventListener('click', closeModal);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });

    // Kliknięcie w wynik — opcje listboxa nie są linkami, więc obsługujemy sami
    document.getElementById('search-results').addEventListener('click', e => {
      const opt = e.target.closest('[role="option"]');
      if (opt) window.location.href = opt.getAttribute('data-href');
    });

    wrap.addEventListener('keydown', e => {
      if (e.key === 'Escape')    { e.preventDefault(); closeModal(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIndex + 1); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(activeIndex - 1); return; }
      if (e.key === 'Home' && optionCount) { e.preventDefault(); setActive(0); return; }
      if (e.key === 'End'  && optionCount) { e.preventDefault(); setActive(optionCount - 1); return; }
      if (e.key === 'Enter' && optionCount) { e.preventDefault(); goTo(activeIndex); return; }
      if (e.key === 'Tab') {
        // Panel ma dokładnie dwa elementy w kolejności fokusu: pole i „zamknij”.
        const focusable = [document.getElementById('search-input'), document.getElementById('search-close')];
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildModal();

    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    // Skrót klawiszowy z modyfikatorem (WCAG 2.1.4 – jednoznakowy skrót „/”
    // nie dawał się wyłączyć ani przemapować, więc kolidował ze sterowaniem głosem).
    document.addEventListener('keydown', e => {
      if (e.key !== 'k' && e.key !== 'K') return;
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      e.preventDefault();
      openModal();
    });
  });
})();
