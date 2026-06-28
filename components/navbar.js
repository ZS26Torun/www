(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  function isActive(href) { return href.split('/').pop() === page; }

  function desktopLink(href, label) {
    const active = isActive(href);
    return `<a href="${href}"
      class="font-semibold text-sm transition-colors ${active ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}"
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
  const aktPages = ['aktualnosci.html', 'kalendarz.html'];
  const aktActive = aktPages.includes(page);
  const aktLinks = [
    { href: 'aktualnosci.html', icon: 'newspaper',  label: 'Aktualności',     sub: 'Newsy i ogłoszenia' },
    { href: 'kalendarz.html',   icon: 'calendar',   label: 'Kalendarz szkolny', sub: 'Rok szkolny 2026/2027' },
  ];

  // Dropdown: Dla rodziców
  const rodzPages = ['dla-rodzicow.html', 'do-pobrania.html', 'faq.html'];
  const rodzActive = rodzPages.includes(page);
  const rodzLinks = [
    { href: 'dla-rodzicow.html', icon: 'users',       label: 'Przydatne informacje',  sub: 'E-dziennik, rada rodziców' },
    { href: 'do-pobrania.html',  icon: 'download',    label: 'Do pobrania',   sub: 'Statuty, wnioski, procedury' },
    { href: 'faq.html',          icon: 'help-circle', label: 'FAQ',           sub: 'Często zadawane pytania' },
  ];

  // Dropdown: Dla pracownika
  const pracownikLinks = [
    { href: 'https://uonetplus.vulcan.net.pl/torun', icon: 'book-open', label: 'E-dziennik',     sub: 'Vulcan UONET+' },
    { href: 'https://outlook.office.com',            icon: 'mail',      label: 'Poczta Outlook', sub: 'Microsoft 365' },
    { href: 'https://teams.microsoft.com',           icon: 'video',     label: 'Microsoft Teams', sub: 'Spotkania i komunikacja' },
    { href: 'https://kadryplace.vulcan.net.pl/torun/1/PRACOWNIK/', icon: 'briefcase', label: 'Kadry Place', sub: 'Vulcan – kadry i płace' },
  ];

  function desktopDropdown(id, label, links, active, external) {
    const btnClass = `font-semibold text-sm transition-colors flex items-center gap-1 ${active ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;
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
        <button id="${id}-btn" class="${btnClass}" aria-haspopup="true" aria-expanded="false">
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        <!-- Logo + nazwa -->
        <a href="index.html" class="flex items-center gap-3 flex-shrink-0 min-w-0"
          aria-label="Strona główna – Zespół Szkół Nr 26 w Toruniu">
          <img src="images/ui/logo.png" alt="" class="h-9 w-auto flex-shrink-0" aria-hidden="true">
          <div class="leading-tight">
            <p class="font-bold text-sm text-gray-900"><span class="sm:hidden">ZS Nr&nbsp;26</span><span class="hidden sm:inline">Zespół Szkół Nr 26</span></p>
            <p class="text-xs text-gray-500">w Toruniu</p>
          </div>
        </a>

        <!-- Desktop nawigacja -->
        <nav class="hidden lg:flex items-center gap-6" aria-label="Główna nawigacja">
          ${desktopLink('o-szkole.html',   'O szkole')}
          ${desktopLink('oferta.html',     'Oferta')}
          ${desktopLink('rekrutacja.html', 'Rekrutacja')}
          ${desktopDropdown('akt',        'Aktualności',    aktLinks,       aktActive,   false)}
          ${desktopDropdown('rodzice',    'Dla rodziców',   rodzLinks,      rodzActive,  false)}
          ${desktopDropdown('pracownik',  'Dla pracownika', pracownikLinks, false,       true)}
        </nav>

        <!-- Prawa strona: CTA + hamburger -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <a href="index.html#kontakt"
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
      <div id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100 shadow-xl"
        role="dialog" aria-label="Menu mobilne">
        <nav class="max-w-7xl mx-auto px-4 py-4 space-y-0.5" aria-label="Mobilna nawigacja">
          ${mobileLink('index.html',       'home',          'Strona główna')}
          ${mobileLink('o-szkole.html',    'info',          'O szkole')}
          ${mobileLink('oferta.html',      'book-open',     'Oferta edukacyjna')}
          ${mobileLink('rekrutacja.html',  'user-plus',     'Rekrutacja')}
          ${mobileLink('aktualnosci.html', 'newspaper',     'Aktualności')}
          ${mobileLink('kalendarz.html',   'calendar',      'Kalendarz szkolny')}
          ${mobileLink('dla-rodzicow.html','users',         'Dla rodziców')}
          ${mobileLink('do-pobrania.html', 'download',      'Do pobrania')}
          ${mobileLink('faq.html',         'help-circle',   'FAQ')}
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

  // Hamburger
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      const nowOpen = mobileMenu.classList.toggle('hidden') === false;
      ham.setAttribute('aria-expanded', nowOpen);
      const lines = ham.querySelectorAll('.ham-line');
      if (nowOpen) {
        lines[0].style.transform = 'translateY(7px) rotate(45deg)';
        lines[1].style.transform = 'scaleX(0)';
        lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        lines.forEach(l => l.style.transform = '');
      }
    });
  }

  // Obsługa dropdownów
  ['akt', 'rodzice', 'pracownik'].forEach(id => {
    const btn  = document.getElementById(`${id}-btn`);
    const menu = document.getElementById(`${id}-menu`);
    const chev = document.getElementById(`${id}-chevron`);
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open);
      if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
      // zamknij pozostałe
      ['akt', 'rodzice', 'pracownik'].filter(x => x !== id).forEach(other => {
        document.getElementById(`${other}-menu`)?.classList.add('hidden');
        document.getElementById(`${other}-btn`)?.setAttribute('aria-expanded', 'false');
        const oc = document.getElementById(`${other}-chevron`);
        if (oc) oc.style.transform = '';
      });
    });
  });

  document.addEventListener('click', () => {
    ['akt', 'rodzice', 'pracownik'].forEach(id => {
      document.getElementById(`${id}-menu`)?.classList.add('hidden');
      document.getElementById(`${id}-btn`)?.setAttribute('aria-expanded', 'false');
      const chev = document.getElementById(`${id}-chevron`);
      if (chev) chev.style.transform = '';
    });
  });

  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();
