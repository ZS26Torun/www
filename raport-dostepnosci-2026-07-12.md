# Audyt dostępności: szkola26.torun.pl (www-szkola)
**Standard:** WCAG 2.1 AA | **Data:** 2026-07-12 | **Zakres:** 13 stron HTML + komponenty (navbar.js, footer.js, a11y.js) + style.css

**Metoda:** analiza statyczna kodu (wszystkie strony) + testy live w przeglądarce: automatyczny skan kontrastu każdego widocznego tekstu, test klawiatury, reflow 320 px, tryb ciemny/wysoki kontrast z widżetu ułatwień, cele dotykowe, struktura nagłówków, nazwy linków.

## Podsumowanie
**Problemy: 9** | **Krytyczne: 1** | **Ważne: 4** | **Drobne: 4**
**Status: WSZYSTKIE NAPRAWIONE 2026-07-12** ✅ (zweryfikowane ponownie live po każdej poprawce)

Strona jest w bardzo dobrym stanie po audycie z 27.06 — semantyka, ARIA, klawiatura, skip-linki, reflow i redukcja animacji działają wzorowo. Nowe znaleziska to niemal wyłącznie kontrast: licznik dni w kalendarzu, stopka na wszystkich stronach, karta Facebooka oraz — paradoksalnie — tryb ciemny z widżetu ułatwień dostępu.

### Zastosowane poprawki
1. **Licznik kalendarza** — `text-amber-400` → `text-amber-700` (`kalendarz.html`)
2. **Stopka (13 stron)** — `text-red-200` → `text-white`, dodano `py-2` do linków dolnego paska dla większych celów dotykowych (`components/footer.js`)
3. **Karta Facebooka** — `#1877F2` → `#1158B8`, usunięto `opacity:0.75` z podtytułu (`index.html`)
4. **Escape zamyka dropdown/menu mobilne** + przywraca fokus (`components/navbar.js`) — zweryfikowane testem klawiatury na desktopie (1280px) i mobile (700px)
5. **Tryb ciemny — pełna korekta kontrastu** (`style.css`): odkryto podczas weryfikacji, że problem był głębszy niż pierwotnie sądzono — dziesiątki jasnych tła-odznak (`bg-{brand,red,amber,yellow,green,teal,blue,purple,orange}-{50,100}`) nie miały odpowiednika w `.dark-mode`, przez co jasny tekst lądował na jasnym tle. Dodano pełny zestaw nadpisań teł i kolorów tekstu (marka, teal, leaf, amber, blue, purple, orange) + wyjątek dla aktywnego przycisku widoku kalendarza. Przeskanowano automatycznie wszystkie 13 stron w obu trybach (light/dark) po korekcie — **0 błędów kontrastu**.
6. Cache-busting: `style.css` v3→v7, `navbar.js` v1→v2, `footer.js` v7→v8 (bez tego użytkownicy z zapisanym w przeglądarce plikiem nie zobaczyliby poprawek)

**Nota:** wstępny automatyczny skan trybu ciemnego dał kilka fałszywych alarmów (kolor odczytany w trakcie `transition-colors`, zanim animacja się zakończyła) — zweryfikowano ręcznie z opóźnieniem, żeby odróżnić realne błędy od artefaktów pomiaru.

---

## Ustalenia

### Postrzegalność (Perceivable)

| # | Problem | Kryterium WCAG | Waga | Rekomendacja |
|---|---------|----------------|------|--------------|
| 1 | Licznik dni „51" w kalendarzu: `text-amber-400` (#FBBF24) na `bg-amber-50` (#FFFBEB) = **1,61:1** (wymagane 3:1 dla dużego tekstu). Praktycznie niewidoczny. `kalendarz.html:400` i `:433` | 1.4.3 Kontrast | 🔴 Krytyczny | Zmienić na `text-amber-700` (#B45309) → ~4,9:1 |
| 2 | Stopka — dolny pasek linków („Deklaracja dostępności", „Ochrona danych", „BIP"): `text-red-200` (#FECACA) na `bg-brand-600` (#C62828) = **3,89:1** przy 12 px (wymagane 4,5:1). Dotyczy **wszystkich 13 stron** (footer.js) | 1.4.3 Kontrast | 🟡 Ważny | Zmienić na `text-white` → 5,6:1 (lub `text-brand-100`) |
| 3 | Karta Facebooka (index): biały tekst na #1877F2 = **4,23:1** — tytuł 16 px, przycisk „Załaduj feed" 13,6 px; podtytuł ma dodatkowo opacity 0.75 (realnie ~3,2:1); link „Otwórz profil" #1877F2 na białym = 4,23:1 | 1.4.3 Kontrast | 🟡 Ważny | Przyciemnić niebieski do np. **#1158B8** (~6,6:1 w obu kierunkach — jeden kolor naprawia tło karty i link); podtytułowi usunąć opacity lub dać pełną biel |
| 4 | Tryb ciemny (własny widżet a11y) — **11 kombinacji poniżej progu**, w tym niemal niewidoczne: nagłówek kafelka „Wczesne Wspomaganie Rozwoju" gray-900 na slate-800 = **1,21:1**, „E-dziennik" gray-700 na slate-800 = **1,42:1**, linki `text-brand-600/700` na granacie = 2,6–2,7:1, gray-500 = 3,1–3,8:1. Funkcja dostępności sama łamie dostępność | 1.4.3 Kontrast | 🟡 Ważny | Dodać nadpisania w `style.css` sekcji `.dark-mode`: jasne odpowiedniki dla `text-gray-700/800/900`, `text-brand-600/700` → `text-brand-300` (#EF9A9A), `text-gray-500` → gray-400 |
| 5 | Podtytuł karty FB `rgba(255,255,255,0.75)` — półprzezroczysty tekst na kolorowym tle utrudnia odbiór | 1.4.3 | 🟢 Drobny | Objęte poprawką #3 |

### Funkcjonalność (Operable)

| # | Problem | Kryterium WCAG | Waga | Rekomendacja |
|---|---------|----------------|------|--------------|
| 6 | Dropdown „Dla pracownika" i menu mobilne **nie zamykają się klawiszem Escape** (potwierdzone testem — `aria-expanded` zostaje `true`). Zamknięcie tylko przez klik poza menu lub Tab przez wszystkie pozycje | 2.1.1 Klawiatura (dobra praktyka ARIA APG) | 🟡 Ważny | W `navbar.js` dodać nasłuch `keydown` → Escape zamyka dropdown/menu i przywraca fokus na przycisk (wzorzec już jest w `a11y.js:218-226` — skopiować) |
| 7 | Cele dotykowe: linki dolnego paska stopki 16 px wysokości, ikona BIP 22×16 px (poniżej 24×24 z WCAG 2.2, daleko od 44×44) | 2.5.5 Rozmiar celu | 🟢 Drobny | Dodać `py-2` / `inline-block` z paddingiem na linkach stopki |
| 8 | `404.html` bez skip-linku (jedyna strona; ma tylko 1 link, więc wpływ minimalny) | 2.4.1 | 🟢 Drobny | Dodać skip-link dla spójności lub zostawić |

### Zrozumiałość (Understandable)
Brak problemów. Brak formularzy (3.3.x nie dotyczy), `lang="pl"` na wszystkich stronach, nawigacja spójna między stronami, brak nieoczekiwanych zmian kontekstu przy fokusie.

### Solidność (Robust)

| # | Problem | Kryterium WCAG | Waga | Rekomendacja |
|---|---------|----------------|------|--------------|
| 9 | Treść iframe'a Facebooka (po kliknięciu „Załaduj feed") jest poza kontrolą — Facebook historycznie ma własne braki a11y | 4.1.2 | 🟢 Drobny / informacyjny | Obecne rozwiązanie (load-on-demand + `title` na iframe) to najlepsza możliwa praktyka; bez działań |

---

## Weryfikacja kontrastu (pomiary z przeglądarki)

| Element | Pierwszy plan | Tło | Wynik | Wymagane | Status |
|---------|---------------|-----|-------|----------|--------|
| Licznik dni (kalendarz, 36 px bold) | #FBBF24 | #FFFBEB | 1,61:1 | 3:1 | ❌ |
| Stopka: pasek prawny (12 px, 13 stron) | #FECACA | #C62828 | 3,89:1 | 4,5:1 | ❌ |
| Karta FB: tytuł/przycisk | #FFFFFF | #1877F2 | 4,23:1 | 4,5:1 | ❌ |
| Karta FB: link „Otwórz profil" | #1877F2 | #FFFFFF | 4,23:1 | 4,5:1 | ❌ |
| Dark mode: kafelek WWR | #111827 | #1E293B | 1,21:1 | 4,5:1 | ❌ |
| Dark mode: „E-dziennik" | #374151 | #1E293B | 1,42:1 | 4,5:1 | ❌ |
| Dark mode: „Czytaj dalej" | #C62828 | #1E293B | 2,60:1 | 4,5:1 | ❌ |
| Tekst główny (gray-600+) na białym/cream | ≥#4B5563 | #FFF/#FDF4E3 | ≥7:1 | 4,5:1 | ✅ |
| Navbar, przyciski brand-600, hero | różne | różne | ≥4,6:1 | 4,5:1 | ✅ |
| Fokus: outline #C62828 na białym | #C62828 | #FFFFFF | 5,6:1 | 3:1 | ✅ |

Skan objął każdy widoczny węzeł tekstowy na 13 stronach — powyżej wszystkie unikalne porażki.

## Nawigacja klawiaturą (testy live)

| Element | Tab | Enter/Spacja | Escape | Uwagi |
|---------|-----|--------------|--------|-------|
| Skip-link „Przejdź do treści" | pierwszy fokus, widoczny po fokusie | ✅ → `#main-content` (istnieje) | — | ✅ |
| Dropdown „Dla pracownika" | ✅ | ✅ otwiera, `aria-expanded` aktualizowane | ❌ **nie zamyka** | jedyny brak |
| Menu mobilne (hamburger) | ✅ `aria-controls`, `aria-expanded` | ✅ | ❌ nie zamyka | jw. |
| Akordeony (rekrutacja, do-pobrania) | ✅ natywne `<button>` | ✅ | — | `aria-expanded` + `aria-controls` + `role="region"` ✅ |
| Filtry aktualności | ✅ | ✅ | — | `aria-pressed` ✅ |
| Panel ułatwień dostępu | ✅ | ✅ | ✅ zamyka + przywraca fokus | pełny focus trap ✅ wzorowo |
| Kratki kalendarza (widok siatki) | ✅ | — | — | `aria-label` + fokus (poprawka z 27.06) ✅ |
| Wskaźnik fokusu | globalny `:focus-visible` 3 px #C62828 | — | — | ✅ |

## Czytnik ekranu (analiza semantyki)

| Element | Ogłaszane jako | Problem |
|---------|----------------|---------|
| Logo w navbarze/stopce | pomijane (`alt=""` + `aria-hidden`) — nazwa szkoły jest tekstem obok | ✅ brak |
| Loga „Przyjaciół szkoły" | pomijane (dekoracyjne, `aria-hidden`) | ✅ brak |
| Linki `target="_blank"` i pobierania | nazwa + „(otwiera się w nowej karcie)" (sr-only, auto z footer.js) | ✅ brak |
| Iframe mapy | „Mapa lokalizacji Zespołu Szkół Nr 26 w Toruniu" | ✅ brak |
| Iframe FB | „Profil szkoły na Facebooku" | ✅ brak |
| Widżet a11y | dialog, przyciski ze stanem (`aria-pressed`), zmiany ogłaszane przez `aria-live` announcer | ✅ brak |
| Nagłówki | 1 × h1 na stronę, zero przeskoków poziomów (sprawdzone na wszystkich 13) | ✅ brak |
| Bieżąca strona w menu | `aria-current` | ✅ brak |

## Co przeszło bez zastrzeżeń
- `lang="pl"`, unikalne `<h1>`, landmark `<main>` — wszystkie strony
- Wszystkie obrazy mają `alt` (treściowe lub puste+`aria-hidden` dla dekoracyjnych)
- Reflow 320 px: **zero poziomego przewijania** na wszystkich stronach (1.4.10)
- `prefers-reduced-motion` respektowane globalnie (2.3.3)
- Brak dodatnich `tabindex`, brak duplikatów `id`
- Brak automatycznie odtwarzanych mediów i limitów czasowych
- Znany wcześniej bug ikon `data-lucide="facebook"` — nieaktualny, ikon brak w kodzie

## Poza zakresem naprawy w HTML
**PDF-y** (wnioski, statuty, procedury) pozostają niedostępne cyfrowo — deklaracja dostępności słusznie deklaruje zgodność częściową. Pełna zgodność = remediacja PDF (tagi, język, struktura) albo równoległa treść HTML. Bez zmian od poprzedniego audytu.

## Priorytety napraw
1. **Licznik kalendarza** (`kalendarz.html:400,433`): `text-amber-400` → `text-amber-700`. Jedna zmiana klasy ×2, blokuje odczyt słabowidzącym.
2. **Stopka** (`footer.js`): `text-red-200` → `text-white` w dolnym pasku. Jedna zmiana, naprawia 13 stron — w tym link do samej deklaracji dostępności.
3. **Karta FB** (`index.html`): #1877F2 → #1158B8 (tło karty i kolor linku).
4. **Dark mode** (`style.css`): nadpisania `.dark-mode` dla `text-gray-700/800/900`, `text-brand-600/700`, `text-gray-500`.
5. **Escape w navbarze** (`navbar.js`): zamykanie dropdownu i menu mobilnego, wzorzec z `a11y.js`.
6. Drobne: skip-link na 404, padding linków stopki.

⚠️ Po zmianach klas Tailwind w HTML/JS: `npm run build:css`.
