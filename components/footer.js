(function () {
  const html = `
    <footer class="bg-brand-600 text-white pt-14 pb-8 px-4" role="contentinfo">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-10 mb-10">

          <!-- Logo + opis -->
          <div>
            <div class="flex items-center gap-3 mb-5">
              <img src="images/ui/logo.png" alt="Logo ZS Nr 26 w Toruniu"
                class="h-14 object-contain brightness-0 invert" onerror="this.style.display='none'">
              <div>
                <p class="font-bold text-white leading-tight">Zespół Szkół Nr 26</p>
                <p class="text-red-100 text-sm">w Toruniu</p>
              </div>
            </div>
            <p class="text-red-100 text-sm leading-relaxed">
              Szkoła specjalna z&nbsp;wieloletnią tradycją przy ul.&nbsp;Fałata&nbsp;88/90.
              Przedszkole, szkoła podstawowa, grupy terapeutyczne, przysposabiająca do pracy, OWiT i&nbsp;SCWEW.
            </p>
            <div class="flex items-center gap-3 mt-5">
              <a href="https://www.facebook.com/szkola.podstawowa.specjalna.nr26.Torun" target="_blank" rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook Zespołu Szkół Nr 26 (otwiera w nowej karcie)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          <!-- Nawigacja -->
          <nav aria-label="Nawigacja w stopce">
            <p class="font-bold text-red-100 mb-5 uppercase text-xs tracking-widest">Nawigacja</p>
            <ul class="space-y-2.5">
              <li><a href="index.html"        class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Strona główna</a></li>
              <li><a href="o-szkole.html"     class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>O szkole</a></li>
              <li><a href="oferta.html"       class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Oferta edukacyjna</a></li>
              <li><a href="rekrutacja.html"   class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Rekrutacja</a></li>
              <li><a href="aktualnosci.html"  class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Aktualności</a></li>
              <li><a href="kalendarz.html"    class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Kalendarz szkolny</a></li>
              <li><a href="dla-rodzicow.html" class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Dla rodziców</a></li>
              <li><a href="faq.html"          class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>FAQ</a></li>
              <li><a href="dla-mediow.html"   class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Dla mediów</a></li>
              <li><a href="dostepnosc.html"   class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Deklaracja dostępności</a></li>
              <li><a href="index.html#kontakt" class="text-red-100 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Kontakt</a></li>
            </ul>
          </nav>

          <!-- Kontakt -->
          <div>
            <p class="font-bold text-red-100 mb-5 uppercase text-xs tracking-widest">Kontakt</p>
            <ul class="space-y-3.5">
              <li class="flex items-center gap-3 text-red-100 text-sm">
                <i data-lucide="phone" class="w-4 h-4 flex-shrink-0 text-red-200"></i>
                <a href="tel:+48566485784" class="hover:text-white transition-colors">(56) 648-57-84</a>
              </li>
              <li class="flex items-center gap-3 text-red-100 text-sm">
                <i data-lucide="mail" class="w-4 h-4 flex-shrink-0 text-red-200"></i>
                <a href="mailto:sekretariat@szkola26.torun.pl" class="hover:text-white transition-colors break-all">sekretariat@szkola26.torun.pl</a>
              </li>
              <li class="flex items-start gap-3 text-red-100 text-sm">
                <i data-lucide="map-pin" class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-200"></i>
                <a href="https://maps.google.com/maps?q=ul.+Fa%C5%82ata+88%2F90,+87-100+Toru%C5%84"
                  target="_blank" rel="noopener noreferrer"
                  class="hover:text-white transition-colors">ul. Juliana Fałata 88/90<br>87-100 Toruń</a>
              </li>
              <li class="flex items-start gap-3 text-red-100 text-sm">
                <i data-lucide="clock" class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-200"></i>
                <span>Sekretariat: pn.–pt.<br>7:30–15:30</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Bottom bar -->
        <div class="border-t border-red-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-red-100">
          <p>© 2026 Zespół Szkół Nr 26 w Toruniu</p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-red-200">
            <a href="dostepnosc.html" class="hover:text-red-100 transition-colors">Deklaracja dostępności</a>
            <a href="rodo.html" class="hover:text-red-100 transition-colors">Ochrona danych</a>
            <a href="https://zs26torun.naszbip.pl/" target="_blank" rel="noopener noreferrer" class="hover:text-red-100 transition-colors">BIP</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('site-footer').outerHTML = html;
  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

  // ── A11y: zapowiedź linków otwieranych w nowej karcie / pobierań ──────────
  // WCAG 3.2.5 – informujemy użytkownika (czytniki ekranu), że link otwiera
  // nową kartę albo pobiera plik. Dotyczy całej strony, nie tylko stopki.
  (function labelExternalLinks() {
    const fileRe = /\.(pdf|docx?|xlsx?|pptx?|zip|doc)$/i;
    document.querySelectorAll('a[target="_blank"], a[download]').forEach(a => {
      if (a.dataset.extLabeled) return;
      a.dataset.extLabeled = '1';
      // Link z własnym aria-label (np. Facebook w stopce) już to opisuje
      if (a.getAttribute('aria-label')) return;
      // Linki bez widocznego tekstu (sama ikona) pomijamy – brak nazwy do uzupełnienia
      if (!a.textContent.trim()) return;
      const isFile = a.hasAttribute('download') || fileRe.test(a.getAttribute('href') || '');
      const span = document.createElement('span');
      span.className = 'sr-only';
      span.textContent = isFile ? ' (otwiera plik do pobrania)' : ' (otwiera się w nowej karcie)';
      a.appendChild(span);
    });
  })();
})();
