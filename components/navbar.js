(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Strony mające wersję ETR (tekst łatwy do czytania). W trybie ETR linki
  // nawigacji prowadzą do odpowiedników -etr, dopóki użytkownik nie wyjdzie
  // z tego trybu (link "Zobacz zwykłą wersję tej strony" na stronie -etr).
  const ETR_PAGES = new Set([
    'index.html', 'o-szkole.html', 'oferta.html', 'rekrutacja.html',
    'aktualnosci.html', 'kalendarz.html', 'dla-rodzicow.html',
    'do-pobrania.html', 'faq.html',
  ]);
  const inEtrMode = page.endsWith('-etr.html');
  function href_(href) {
    if (!inEtrMode || /^https?:\/\//.test(href)) return href;
    const [base, hash] = href.split('#');
    if (!ETR_PAGES.has(base)) return href;
    return base.replace(/\.html$/, '-etr.html') + (hash ? '#' + hash : '');
  }

  function isActive(href) { return href.split('/').pop() === page; }

  function desktopLink(href, label) {
    const active = isActive(href);
    return `<a href="${href}"
      class="font-semibold text-sm py-2 transition-colors ${active ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}"
      ${active ? 'aria-current="page"' : ''}>${label}</a>`;
  }

  function mobileLink(href, icon, label) {
    const active = isActive(href);
    return `<a href="${href}"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}"
      ${active ? 'aria-current="page"' : ''}>
      <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i>${label}
    </a>`;
  }

  // Dropdown: Aktualności
  const aktPages = ['aktualnosci.html', 'kalendarz.html'].map(href_);
  const aktActive = aktPages.includes(page);
  const aktLinks = [
    { href: href_('aktualnosci.html'), icon: 'newspaper',  label: 'Aktualności',     sub: 'Newsy i ogłoszenia' },
    { href: href_('kalendarz.html'),   icon: 'calendar',   label: 'Kalendarz szkolny', sub: 'Rok szkolny 2026/2027' },
  ];

  // Dropdown: Dla rodziców
  const rodzPages = ['dla-rodzicow.html', 'do-pobrania.html', 'faq.html'].map(href_);
  const rodzActive = rodzPages.includes(page);
  const rodzLinks = [
    { href: href_('dla-rodzicow.html'), icon: 'users',       label: 'Przydatne informacje',  sub: 'E-dziennik, rada rodziców' },
    { href: href_('do-pobrania.html'),  icon: 'download',    label: 'Do pobrania',   sub: 'Statuty, wnioski, procedury' },
    { href: href_('faq.html'),          icon: 'help-circle', label: 'FAQ',           sub: 'Często zadawane pytania' },
  ];

  // Dropdown: Dla pracownika
  const pracownikLinks = [
    { href: 'https://uonetplus.vulcan.net.pl/torun', icon: 'book-open', label: 'E-dziennik',     sub: 'Vulcan UONET+' },
    { href: 'https://outlook.office.com',            icon: 'mail',      label: 'Poczta Outlook', sub: 'Microsoft 365' },
    { href: 'https://teams.microsoft.com',           icon: 'video',     label: 'Microsoft Teams', sub: 'Spotkania i komunikacja' },
    { href: 'https://kadryplace.vulcan.net.pl/torun/1/PRACOWNIK/', icon: 'briefcase', label: 'Kadry i Płace', sub: 'Vulcan – kadry i płace' },
  ];

  function desktopDropdown(id, label, links, active, external) {
    const btnClass = `font-semibold text-sm py-2 transition-colors flex items-center gap-1 ${active ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;
    const items = links.map(l => `
      <a href="${l.href}" ${external ? 'target="_blank" rel="noopener noreferrer"' : ''}
        class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group ${isActive(l.href) ? 'bg-brand-50' : ''}">
        <span class="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors ${isActive(l.href) ? 'bg-brand-100' : ''}">
          <i data-lucide="${l.icon}" class="w-4 h-4 text-gray-500 group-hover:text-brand-700 transition-colors ${isActive(l.href) ? 'text-brand-700' : ''}"></i>
        </span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">${l.label}</p>
          <p class="text-xs text-gray-500">${l.sub}</p>
        </div>
      </a>`).join('');
    return `
      <div class="relative" id="${id}-wrap">
        <button id="${id}-btn" class="${btnClass}" aria-expanded="false" aria-haspopup="true"
          aria-controls="${id}-menu"${active ? ' aria-current="true"' : ''}>
          ${label} <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200" id="${id}-chevron"></i>
        </button>
        <div id="${id}-menu" class="hidden absolute left-1/2 -translate-x-1/2 top-full mt-3 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          ${items}
        </div>
      </div>`;
  }

  const navHTML = `
    <header id="site-header" role="banner"
      class="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      style="background:rgba(255,255,255,0.97);backdrop-filter:blur(8px);color:#1f2937;box-shadow:0 1px 6px rgba(0,0,0,.07);">
      <div id="site-bar" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-16 py-1 gap-2">

        <!-- Logo + nazwa -->
        <a href="${href_('index.html')}" class="flex items-center gap-3 min-w-0"
          aria-label="Strona główna – Zespół Szkół Nr 26 w Toruniu">
          <img src="images/ui/logo.png" alt="" class="h-9 w-auto flex-shrink-0" aria-hidden="true">
          <div id="brand-text" class="leading-tight min-w-0">
            <p class="font-bold text-sm text-gray-900"><span class="sm:hidden">ZS Nr&nbsp;26</span><span class="hidden sm:inline">Zespół Szkół Nr 26</span></p>
            <p class="text-xs text-gray-500">w Toruniu</p>
          </div>
        </a>

        <!-- Desktop nawigacja -->
        <nav class="hidden lg:flex items-center gap-6" aria-label="Główna nawigacja">
          ${desktopLink(href_('o-szkole.html'),   'O szkole')}
          ${desktopLink(href_('oferta.html'),     'Oferta')}
          ${desktopLink(href_('rekrutacja.html'), 'Rekrutacja')}
          ${desktopDropdown('akt',        'Aktualności',    aktLinks,       aktActive,   false)}
          ${desktopDropdown('rodzice',    'Dla rodziców',   rodzLinks,      rodzActive,  false)}
          ${desktopDropdown('pracownik',  'Dla pracownika', pracownikLinks, false,       true)}
        </nav>

        <!-- Prawa strona: CTA + hamburger -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <button data-search-trigger aria-label="Szukaj na stronie"
            class="w-10 h-10 flex items-center justify-center rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          </button>
          <a href="${href_('index.html')}#kontakt"
            class="hidden sm:inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all shadow-sm">
            <i data-lucide="phone" class="w-4 h-4"></i>Kontakt
          </a>
          <button id="hamburger" aria-label="Otwórz menu" aria-expanded="false" aria-controls="mobile-menu"
            class="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-gray-100 transition-colors">
            <span class="ham-line block w-5 h-0.5 bg-gray-700 transition-all duration-300 origin-center"></span>
            <span class="ham-line block w-5 h-0.5 bg-gray-700 transition-all duration-300 origin-center"></span>
            <span class="ham-line block w-5 h-0.5 bg-gray-700 transition-all duration-300 origin-center"></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-y-auto"
        style="max-height: calc(100vh - var(--zs-header-h, 4rem)); max-height: calc(100dvh - var(--zs-header-h, 4rem)); -webkit-overflow-scrolling: touch; overscroll-behavior: contain; touch-action: pan-y;">
        <nav class="max-w-7xl mx-auto px-4 py-4 space-y-0.5" aria-label="Mobilna nawigacja">
          <button data-search-trigger
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <span class="w-5 h-5 flex-shrink-0 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg></span>Szukaj na stronie
          </button>
          ${mobileLink(href_('index.html'),       'home',          'Strona główna')}
          ${mobileLink(href_('o-szkole.html'),    'info',          'O szkole')}
          ${mobileLink(href_('oferta.html'),      'book-open',     'Oferta edukacyjna')}
          ${mobileLink(href_('rekrutacja.html'),  'user-plus',     'Rekrutacja')}
          ${mobileLink(href_('aktualnosci.html'), 'newspaper',     'Aktualności')}
          ${mobileLink(href_('kalendarz.html'),   'calendar',      'Kalendarz szkolny')}
          ${mobileLink(href_('dla-rodzicow.html'),'users',         'Dla rodziców')}
          ${mobileLink(href_('do-pobrania.html'), 'download',      'Do pobrania')}
          ${mobileLink(href_('faq.html'),         'help-circle',   'FAQ')}
          ${mobileLink('dostepnosc.html',  'accessibility', 'Dostępność')}
          <div class="pt-3 mt-2 border-t border-gray-100">
            <p class="px-4 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Dla pracownika</p>
            ${pracownikLinks.map(l => `
            <a href="${l.href}" target="_blank" rel="noopener noreferrer"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <i data-lucide="${l.icon}" class="w-5 h-5 flex-shrink-0 text-gray-400"></i>${l.label}
            </a>`).join('')}
          </div>
        </nav>
      </div>
    </header>
  `;

  document.getElementById('navbar-placeholder').outerHTML = navHTML;

  // Pasek jest position:fixed i rośnie razem z powiększanym tekstem. Mierzymy go
  // i podajemy do CSS, żeby przesunięcie treści, docelowy punkt kotwic i wysokość
  // menu mobilnego zawsze odpowiadały jego rzeczywistej wysokości — inaczej przy
  // większej czcionce nagłówek zasłaniał początek strony.
  (function trackHeaderHeight() {
    // Mierzymy sam pasek, a nie cały <header> — ten drugi zawiera rozwijane
    // menu mobilne, którego wysokość zależy od --zs-header-h. Obserwowanie
    // headera tworzyłoby pętlę: menu rośnie → zmienna rośnie → menu maleje.
    const bar = document.getElementById('site-bar');
    if (!bar) return;
    const brand = document.getElementById('brand-text');

    // Nazwa szkoły obok logo zawija się przy mocno powiększonym tekście i na
    // wąskim ekranie potrafiła rozepchnąć pasek na pół wysokości okna. Gdy
    // brakuje miejsca, zostaje samo logo — pełna nazwa i tak jest w aria-label
    // linku, w <title> oraz w nagłówku h1 strony, więc nic nie ginie.
    function fitBrand() {
      if (!brand) return;
      const root = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      brand.hidden = window.innerWidth < root * 16;
    }

    const apply = () => {
      fitBrand();
      document.documentElement.style.setProperty('--zs-header-h', bar.offsetHeight + 'px');
    };
    apply();
    if (window.ResizeObserver) new ResizeObserver(apply).observe(bar);
    window.addEventListener('resize', apply, { passive: true });
    window.addEventListener('load', apply);
  })();

  // Blokada scrolla tła — position:fixed zamiast overflow:hidden, bo Android
  // Chrome/Edge potrafi przy samym overflow:hidden zablokować też scroll
  // wewnątrz otwartego menu (nie tylko tła).
  function lockBodyScroll() {
    const scrollY = window.scrollY;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockBodyScroll() {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    delete document.body.dataset.scrollY;
    window.scrollTo(0, scrollY);
  }

  // Menu mobilne zasłania całą stronę, więc na czas otwarcia reszta serwisu
  // dostaje `inert` — bez tego fokus wędrował Tabem po treści schowanej pod menu
  // (WCAG 2.4.3).
  // #search-overlay jest wyłączone z blokady: wyszukiwarkę można otworzyć
  // wprost z menu mobilnego, a jej własna warstwa musi wtedy pozostać
  // operacyjna (inaczej pole nie przyjmuje fokusu — WCAG 2.1.1).
  function setPageInert(on) {
    Array.from(document.body.children).forEach(el => {
      if (el.id === 'site-header' || el.id === 'search-overlay' || el.tagName === 'SCRIPT') return;
      if (on) { el.setAttribute('inert', ''); el.dataset.menuInert = '1'; }
      else if (el.dataset.menuInert) { el.removeAttribute('inert'); delete el.dataset.menuInert; }
    });
  }

  // Hamburger
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!ham || !mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    ham.setAttribute('aria-expanded', String(open));
    ham.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    if (open) lockBodyScroll(); else unlockBodyScroll();
    setPageInert(open);
    document.getElementById('a11y-widget')?.classList.toggle('hidden', open);
    const lines = ham.querySelectorAll('.ham-line');
    if (open) {
      lines[0].style.transform = 'translateY(7px) rotate(45deg)';
      lines[1].style.transform = 'scaleX(0)';
      lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      lines.forEach(l => l.style.transform = '');
    }
  }

  // Wyszukiwarka zamyka menu przed otwarciem własnego okna modalnego —
  // dwie nakładające się blokady `inert` unieruchamiały całą stronę.
  window.zs26CloseMenu = () => { if (mobileMenu && !mobileMenu.classList.contains('hidden')) setMenu(false); };

  if (ham && mobileMenu) {
    ham.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
    // Tab z ostatniego elementu menu wraca na hamburgera – fokus nie wypada poza
    // menu także w przeglądarkach bez obsługi `inert`.
    mobileMenu.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || mobileMenu.classList.contains('hidden')) return;
      const items = Array.from(mobileMenu.querySelectorAll('a[href], button'))
        .filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); ham.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); ham.focus(); }
    });
  }

  // Obsługa dropdownów
  function closeDropdown(id) {
    document.getElementById(`${id}-menu`)?.classList.add('hidden');
    document.getElementById(`${id}-btn`)?.setAttribute('aria-expanded', 'false');
    const chev = document.getElementById(`${id}-chevron`);
    if (chev) chev.style.transform = '';
  }

  ['akt', 'rodzice', 'pracownik'].forEach(id => {
    const btn  = document.getElementById(`${id}-btn`);
    const menu = document.getElementById(`${id}-menu`);
    const chev = document.getElementById(`${id}-chevron`);
    const wrap = document.getElementById(`${id}-wrap`);
    if (!btn || !menu) return;

    // Tab poza listę zamyka ją tak samo jak kliknięcie poza nią — inaczej
    // rozwinięte menu zostawało otwarte za plecami użytkownika klawiatury.
    wrap?.addEventListener('focusout', e => {
      if (!wrap.contains(e.relatedTarget)) closeDropdown(id);
    });

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open);
      if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
      // zamknij pozostałe
      ['akt', 'rodzice', 'pracownik'].filter(x => x !== id).forEach(closeDropdown);
    });
  });

  document.addEventListener('click', () => {
    ['akt', 'rodzice', 'pracownik'].forEach(closeDropdown);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['akt', 'rodzice', 'pracownik'].forEach(id => {
      const menu = document.getElementById(`${id}-menu`);
      const btn = document.getElementById(`${id}-btn`);
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
        btn?.setAttribute('aria-expanded', 'false');
        const chev = document.getElementById(`${id}-chevron`);
        if (chev) chev.style.transform = '';
        btn?.focus();
      }
    });
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      setMenu(false);
      ham?.focus();
    }
  });

  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();
