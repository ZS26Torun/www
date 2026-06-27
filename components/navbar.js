(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  function desktopLink(href, label) {
    const active = href.split('/').pop() === page;
    return `<a href="${href}"
      class="font-semibold text-sm transition-colors ${active ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}"
      ${active ? 'aria-current="page"' : ''}>${label}</a>`;
  }

  function mobileLink(href, icon, label) {
    const active = href.split('/').pop() === page;
    return `<a href="${href}"
      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}"
      ${active ? 'aria-current="page"' : ''}>
      <i data-lucide="${icon}" class="w-5 h-5 flex-shrink-0"></i>${label}
    </a>`;
  }

  const pracownikLinks = [
    { href: 'https://uonetplus.vulcan.net.pl/torun', icon: 'book-open', label: 'E-dziennik', sub: 'Vulcan UONET+' },
    { href: 'https://outlook.office.com',            icon: 'mail',      label: 'Poczta Outlook', sub: 'Microsoft 365' },
    { href: 'https://teams.microsoft.com',           icon: 'video',     label: 'Microsoft Teams', sub: 'Spotkania i komunikacja' },
    { href: 'https://kadryplace.vulcan.net.pl/torun/1/PRACOWNIK/', icon: 'briefcase', label: 'Kadry Place', sub: 'Vulcan – kadry i płace' },
  ];

  const navHTML = `
    <header id="site-header" role="banner"
      class="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
      style="background:rgba(255,255,255,0.97);backdrop-filter:blur(8px);color:#1f2937;box-shadow:0 1px 6px rgba(0,0,0,.07);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        <!-- Logo + nazwa -->
        <a href="index.html" class="flex items-center gap-3 flex-shrink-0 min-w-0"
          aria-label="Strona główna – Zespół Szkół Nr 26 w Toruniu">
          <img src="images/ui/logo.png" alt="" class="h-9 w-auto flex-shrink-0" aria-hidden="true">
          <div class="hidden sm:block leading-tight">
            <p class="font-bold text-sm text-gray-900">Zespół Szkół Nr 26</p>
            <p class="text-xs text-gray-500">w Toruniu</p>
          </div>
        </a>

        <!-- Desktop nawigacja -->
        <nav class="hidden lg:flex items-center gap-7" aria-label="Główna nawigacja">
          ${desktopLink('o-szkole.html',    'O szkole')}
          ${desktopLink('oferta.html',      'Oferta')}
          ${desktopLink('rekrutacja.html',  'Rekrutacja')}
          ${desktopLink('aktualnosci.html', 'Aktualności')}
          ${desktopLink('dla-rodzicow.html','Dla rodziców')}
          ${desktopLink('do-pobrania.html', 'Do pobrania')}
          <div class="relative" id="pracownik-wrap">
            <button id="pracownik-btn"
              class="font-semibold text-sm text-gray-600 hover:text-brand-600 transition-colors flex items-center gap-1"
              aria-haspopup="true" aria-expanded="false">
              Dla pracownika <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200" id="pracownik-chevron"></i>
            </button>
            <div id="pracownik-menu"
              class="hidden absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              ${pracownikLinks.map(l => `
              <a href="${l.href}" target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                <span class="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <i data-lucide="${l.icon}" class="w-4 h-4 text-gray-500 group-hover:text-brand-700 transition-colors"></i>
                </span>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">${l.label}</p>
                  <p class="text-xs text-gray-400">${l.sub}</p>
                </div>
              </a>`).join('')}
            </div>
          </div>
          ${desktopLink('dostepnosc.html',  'Dostępność')}
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
          ${mobileLink('index.html',       'home',         'Strona główna')}
          ${mobileLink('o-szkole.html',    'info',         'O szkole')}
          ${mobileLink('oferta.html',      'book-open',    'Oferta edukacyjna')}
          ${mobileLink('rekrutacja.html',  'user-plus',    'Rekrutacja')}
          ${mobileLink('aktualnosci.html', 'newspaper',    'Aktualności')}
          ${mobileLink('dla-rodzicow.html','users',        'Dla rodziców')}
          ${mobileLink('do-pobrania.html', 'download',     'Do pobrania')}
          ${mobileLink('dostepnosc.html',  'accessibility','Dostępność')}
          <div class="pt-3 mt-2 border-t border-gray-100">
            <p class="px-4 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wide">Dla pracownika</p>
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

  // Dropdown pracownika
  const btn = document.getElementById('pracownik-btn');
  const menu = document.getElementById('pracownik-menu');
  const chevron = document.getElementById('pracownik-chevron');
  if (btn && menu) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open);
      if (chevron) chevron.style.transform = open ? 'rotate(180deg)' : '';
    });
    document.addEventListener('click', () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = '';
    });
  }

  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();
