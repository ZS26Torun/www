/* components/a11y.js — Widget ułatwień dostępu + scroll progress + wróć na górę */

// ── State ───────────────────────────────────────────────────────────────────
let a11yOpen = false;
let currentFontSize = 16;

// ── Helpers ─────────────────────────────────────────────────────────────────
function setA11yBadge(id, active) {
  const btn = document.getElementById(id); if (!btn) return;
  const badge = btn.querySelector('.a11y-badge');
  if (badge) { badge.textContent = active ? 'WŁ' : 'WYŁ'; badge.classList.toggle('on', active); badge.classList.toggle('off', !active); }
  btn.setAttribute('aria-pressed', String(active));
}
function updateA11yCount() {
  const modes = ['high-contrast','a11y-dyslexic','a11y-spacing','a11y-stop-motion','a11y-grayscale'];
  const n = modes.filter(m => document.body.classList.contains(m)).length + (currentFontSize !== 16 ? 1 : 0);
  const el = document.getElementById('a11y-active-count');
  if (el) { el.textContent = n; el.classList.toggle('hidden', n === 0); el.classList.toggle('flex', n > 0); }
}
function announce(msg) { const a = document.getElementById('a11y-announcer'); if (a) a.textContent = msg; }

// ── Panel toggle ─────────────────────────────────────────────────────────────
function toggleA11yPanel() {
  a11yOpen = !a11yOpen;
  const panel = document.getElementById('a11y-panel');
  const btn   = document.getElementById('a11y-toggle-btn');
  if (!panel || !btn) return;
  panel.classList.toggle('hidden', !a11yOpen);
  btn.setAttribute('aria-expanded', String(a11yOpen));
  if (a11yOpen) {
    if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    const first = panel.querySelector('button, [tabindex="0"]');
    if (first) first.focus();
  }
}

// ── A11y actions ─────────────────────────────────────────────────────────────
function toggleHighContrast() {
  document.body.classList.toggle('high-contrast');
  const on = document.body.classList.contains('high-contrast');
  setA11yBadge('a11y-contrast', on); localStorage.setItem('zs26-contrast', on); updateA11yCount();
  announce(on ? 'Wysoki kontrast włączony' : 'Wysoki kontrast wyłączony');
}
function changeFontSize(step) {
  currentFontSize = Math.min(28, Math.max(12, currentFontSize + step * 2));
  document.documentElement.style.fontSize = currentFontSize + 'px';
  const label = document.getElementById('font-size-label');
  if (label) label.textContent = currentFontSize === 16 ? 'Domyślny (16px)' : currentFontSize + 'px';
  localStorage.setItem('zs26-font-size', currentFontSize); updateA11yCount();
  announce('Rozmiar tekstu: ' + currentFontSize + 'px');
}
function toggleDyslexicFont() {
  document.body.classList.toggle('a11y-dyslexic');
  const on = document.body.classList.contains('a11y-dyslexic');
  setA11yBadge('a11y-dyslexic', on); localStorage.setItem('zs26-dyslexic', on); updateA11yCount();
  announce(on ? 'Czcionka dla dysleksji włączona' : 'Czcionka dla dysleksji wyłączona');
}
function toggleSpacing() {
  document.body.classList.toggle('a11y-spacing');
  const on = document.body.classList.contains('a11y-spacing');
  setA11yBadge('a11y-spacing', on); localStorage.setItem('zs26-spacing', on); updateA11yCount();
  announce(on ? 'Zwiększony odstęp włączony' : 'Zwiększony odstęp wyłączony');
}
function toggleStopAnimations() {
  document.body.classList.toggle('a11y-stop-motion');
  const on = document.body.classList.contains('a11y-stop-motion');
  setA11yBadge('a11y-motion', on); localStorage.setItem('zs26-motion', on); updateA11yCount();
  announce(on ? 'Animacje zatrzymane' : 'Animacje włączone');
}
function toggleDarkMode() {
  const on = document.body.classList.toggle('dark-mode');
  setA11yBadge('a11y-dark-mode', on); localStorage.setItem('zs26-dark', on); updateA11yCount();
}
function toggleGrayscale() {
  document.body.classList.toggle('a11y-grayscale');
  const on = document.body.classList.contains('a11y-grayscale');
  setA11yBadge('a11y-grayscale', on); localStorage.setItem('zs26-grayscale', on); updateA11yCount();
  announce(on ? 'Skala szarości włączona' : 'Skala szarości wyłączona');
}
function resetA11y() {
  ['high-contrast','a11y-dyslexic','a11y-spacing','a11y-stop-motion','a11y-grayscale','dark-mode'].forEach(c => document.body.classList.remove(c));
  currentFontSize = 16; document.documentElement.style.fontSize = '16px';
  ['a11y-contrast','a11y-dyslexic','a11y-spacing','a11y-motion','a11y-grayscale','a11y-dark-mode'].forEach(id => setA11yBadge(id, false));
  const label = document.getElementById('font-size-label');
  if (label) label.textContent = 'Domyślny (16px)';
  ['zs26-contrast','zs26-dyslexic','zs26-spacing','zs26-motion','zs26-grayscale','zs26-font-size','zs26-dark'].forEach(k => localStorage.removeItem(k));
  updateA11yCount();
}

// ── Init ─────────────────────────────────────────────────────────────────────
(function () {
  // Scroll progress
  if (!document.getElementById('scroll-progress')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(bar, document.body.firstChild);
  }

  // A11y live region
  if (!document.getElementById('a11y-announcer')) {
    const ann = document.createElement('div');
    ann.id = 'a11y-announcer'; ann.className = 'sr-only';
    ann.setAttribute('aria-live', 'polite'); ann.setAttribute('aria-atomic', 'true');
    document.body.appendChild(ann);
  }

  // Widget HTML
  if (!document.getElementById('a11y-widget')) {
    const w = document.createElement('div');
    w.id = 'a11y-widget';
    w.className = 'fixed bottom-6 left-6 z-50 print:hidden';
    w.innerHTML = `
      <div id="a11y-panel"
        class="hidden mb-3 bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden"
        role="dialog" aria-modal="true" aria-label="Panel ułatwień dostępu" tabindex="-1">
        <div class="px-4 pt-4 pb-2 border-b border-gray-100 flex items-center justify-between">
          <p class="text-xs font-bold text-gray-600 uppercase tracking-wider">Ułatwienia dostępu</p>
          <button onclick="toggleA11yPanel()" class="text-gray-500 hover:text-gray-700 p-1 rounded transition-colors" aria-label="Zamknij panel">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="p-2 space-y-0.5">
          <button onclick="toggleHighContrast()" id="a11y-contrast" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0"><i data-lucide="eye" class="w-5 h-5 text-yellow-400"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Wysoki kontrast</p><p class="text-[11px] text-gray-500">Żółty tekst na czarnym tle</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
          <div class="flex items-center gap-3 px-3 py-2.5">
            <span class="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0"><i data-lucide="type" class="w-5 h-5 text-brand-700"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Rozmiar tekstu</p><p class="text-[11px] text-gray-500" id="font-size-label">Domyślny (16px)</p></div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button onclick="changeFontSize(-1)" class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-base transition-colors flex items-center justify-center" aria-label="Zmniejsz tekst">−</button>
              <button onclick="changeFontSize(1)"  class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-base transition-colors flex items-center justify-center" aria-label="Powiększ tekst">+</button>
            </div>
          </div>
          <button onclick="toggleDyslexicFont()" id="a11y-dyslexic" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0"><i data-lucide="book-open" class="w-5 h-5 text-blue-600"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Czcionka dla dysleksji</p><p class="text-[11px] text-gray-500">Lexend – ułatwia czytanie</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
          <button onclick="toggleSpacing()" id="a11y-spacing" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0"><i data-lucide="align-justify" class="w-5 h-5 text-violet-600"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Zwiększony odstęp</p><p class="text-[11px] text-gray-500">Szersza interlinia i litery</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
          <button onclick="toggleStopAnimations()" id="a11y-motion" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0"><i data-lucide="zap-off" class="w-5 h-5 text-orange-500"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Zatrzymaj animacje</p><p class="text-[11px] text-gray-500">Dla wrażliwości na ruch</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
          <button onclick="toggleDarkMode()" id="a11y-dark-mode" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0"><i data-lucide="moon" class="w-5 h-5 text-slate-700"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Tryb ciemny</p><p class="text-[11px] text-gray-500">Ciemne tło, mniej zmęczenia oczu</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
          <button onclick="toggleGrayscale()" id="a11y-grayscale" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left" aria-pressed="false">
            <span class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><i data-lucide="contrast" class="w-5 h-5 text-gray-600"></i></span>
            <div class="flex-grow min-w-0"><p class="text-sm font-semibold text-gray-800">Skala szarości</p><p class="text-[11px] text-gray-500">Pomoc przy ślepocie barw</p></div>
            <span class="a11y-badge off">WYŁ</span>
          </button>
        </div>
        <div class="px-4 pb-4 pt-2 border-t border-gray-50">
          <button onclick="resetA11y()" class="w-full text-xs text-gray-500 hover:text-red-500 transition-colors py-1 flex items-center justify-center gap-1.5">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i>Przywróć ustawienia domyślne
          </button>
        </div>
      </div>
      <button id="a11y-toggle-btn" onclick="toggleA11yPanel()"
        class="flex items-center gap-2 text-white px-4 py-3 rounded-full shadow-xl transition-all font-semibold text-sm"
        style="background:#2B7333;"
        onmouseover="this.style.background='#1E5C27'" onmouseout="this.style.background='#2B7333'"
        aria-expanded="false" aria-controls="a11y-panel" aria-label="Otwórz panel ułatwień dostępu">
        <i data-lucide="accessibility" class="w-5 h-5"></i>
        <span>Ułatwienia</span>
        <span id="a11y-active-count" class="hidden w-5 h-5 bg-white text-brand-700 text-xs font-bold rounded-full items-center justify-center">0</span>
      </button>`;
    document.body.appendChild(w);
  }

  // Scroll-top button
  if (!document.getElementById('scroll-top-btn')) {
    const topBtn = document.createElement('button');
    topBtn.id = 'scroll-top-btn';
    topBtn.className = 'hidden fixed bottom-6 right-6 z-50 w-12 h-12 text-white rounded-full shadow-lg items-center justify-center transition-all';
    topBtn.style.background = '#2B7333';
    topBtn.setAttribute('aria-label', 'Wróć na górę strony');
    topBtn.innerHTML = '<i data-lucide="arrow-up" class="w-5 h-5"></i>';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(topBtn);
  }

  // Re-render icons (widget was just appended)
  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

  // Scroll listener
  const bar    = document.getElementById('scroll-progress');
  const topBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    if (bar) bar.style.width = pct + '%';
    if (topBtn) {
      const show = window.scrollY > 400;
      topBtn.classList.toggle('hidden', !show);
      topBtn.classList.toggle('flex', show);
    }
  }, { passive: true });

  // Click outside
  document.addEventListener('click', e => {
    const widget = document.getElementById('a11y-widget');
    if (widget && !widget.contains(e.target) && a11yOpen) toggleA11yPanel();
  });

  // Focus trap
  const panel     = document.getElementById('a11y-panel');
  const toggleBtn = document.getElementById('a11y-toggle-btn');
  if (panel) {
    panel.addEventListener('keydown', function (e) {
      if (!a11yOpen) return;
      const focusable = Array.from(panel.querySelectorAll('button, [tabindex="0"]')).filter(el => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.key === 'Escape') { e.preventDefault(); toggleA11yPanel(); if (toggleBtn) toggleBtn.focus(); }
      else if (e.key === 'Tab') {
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
      }
    });
  }

  // Restore preferences
  const prefMap = {
    'zs26-contrast':  () => { document.body.classList.add('high-contrast');    setA11yBadge('a11y-contrast',  true); },
    'zs26-dyslexic':  () => { document.body.classList.add('a11y-dyslexic');    setA11yBadge('a11y-dyslexic',  true); },
    'zs26-spacing':   () => { document.body.classList.add('a11y-spacing');     setA11yBadge('a11y-spacing',   true); },
    'zs26-motion':    () => { document.body.classList.add('a11y-stop-motion'); setA11yBadge('a11y-motion',    true); },
    'zs26-grayscale': () => { document.body.classList.add('a11y-grayscale');   setA11yBadge('a11y-grayscale', true); },
    'zs26-dark':      () => { document.body.classList.add('dark-mode');        setA11yBadge('a11y-dark-mode', true); },
  };
  Object.entries(prefMap).forEach(([k, fn]) => { if (localStorage.getItem(k) === 'true') fn(); });
  const savedSize = localStorage.getItem('zs26-font-size');
  if (savedSize) {
    currentFontSize = parseInt(savedSize);
    document.documentElement.style.fontSize = currentFontSize + 'px';
    const label = document.getElementById('font-size-label');
    if (label) label.textContent = currentFontSize === 16 ? 'Domyślny (16px)' : currentFontSize + 'px';
  }
  updateA11yCount();
})();
