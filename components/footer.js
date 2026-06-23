(function () {
  const html = `
    <footer class="bg-brand-900 text-white pt-14 pb-8 px-4" role="contentinfo">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-10 mb-10">

          <!-- Logo + opis -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <img src="images/ui/logo.png" alt="Logo ZS Nr 26 w Toruniu"
                class="h-14 object-contain brightness-0 invert" onerror="this.style.display='none'">
              <div>
                <p class="font-bold text-white leading-tight">Zespół Szkół Nr 26</p>
                <p class="text-red-300 text-sm">w Toruniu</p>
              </div>
            </div>
            <p class="text-red-300 text-sm leading-relaxed">
              Szkoła specjalna z&nbsp;wieloletnią tradycją przy ul.&nbsp;Fałata&nbsp;88/90.
              Przedszkole, szkoła podstawowa, klasy rewalidacyjne, przysposabiająca do pracy, OWiT i&nbsp;SCWEW.
            </p>
            <div class="flex items-center gap-3 mt-5">
              <a href="https://www.facebook.com/zs26.torun" target="_blank" rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook Zespołu Szkół Nr 26 (otwiera w nowej karcie)">
                <i data-lucide="facebook" class="w-5 h-5"></i>
              </a>
            </div>
          </div>

          <!-- Nawigacja -->
          <nav aria-label="Nawigacja w stopce">
            <p class="font-bold text-red-200 mb-5 uppercase text-xs tracking-widest">Nawigacja</p>
            <ul class="space-y-2.5">
              <li><a href="index.html"        class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Strona główna</a></li>
              <li><a href="o-szkole.html"     class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>O szkole</a></li>
              <li><a href="oferta.html"       class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Oferta edukacyjna</a></li>
              <li><a href="rekrutacja.html"   class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Rekrutacja</a></li>
              <li><a href="aktualnosci.html"  class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Aktualności</a></li>
              <li><a href="dla-rodzicow.html" class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Dla rodziców</a></li>
              <li><a href="dostepnosc.html"   class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Deklaracja dostępności</a></li>
              <li><a href="index.html#kontakt" class="text-red-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Kontakt</a></li>
            </ul>
          </nav>

          <!-- Kontakt -->
          <div>
            <p class="font-bold text-red-200 mb-5 uppercase text-xs tracking-widest">Kontakt</p>
            <ul class="space-y-3.5">
              <li class="flex items-center gap-3 text-red-300 text-sm">
                <i data-lucide="phone" class="w-4 h-4 flex-shrink-0 text-red-400"></i>
                <a href="tel:+48566485784" class="hover:text-white transition-colors">(56) 648-57-84</a>
              </li>
              <li class="flex items-center gap-3 text-red-300 text-sm">
                <i data-lucide="mail" class="w-4 h-4 flex-shrink-0 text-red-400"></i>
                <a href="mailto:sekretariat@szkola26.torun.pl" class="hover:text-white transition-colors break-all">sekretariat@szkola26.torun.pl</a>
              </li>
              <li class="flex items-start gap-3 text-red-300 text-sm">
                <i data-lucide="map-pin" class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400"></i>
                <span>ul. Juliana Fałata 88/90<br>87-100 Toruń</span>
              </li>
              <li class="flex items-start gap-3 text-red-300 text-sm">
                <i data-lucide="clock" class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400"></i>
                <span>Sekretariat: pn.–pt.<br>7:30–15:30</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="border-t border-red-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-red-300">
          <p>© 2026 Zespół Szkół Nr 26 w Toruniu</p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-red-400">
            <a href="dostepnosc.html" class="hover:text-red-200 transition-colors">Deklaracja dostępności</a>
            <a href="o-szkole.html#rodo" class="hover:text-red-200 transition-colors">RODO</a>
            <a href="o-szkole.html#bip" class="hover:text-red-200 transition-colors">BIP</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('site-footer').outerHTML = html;
  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();
