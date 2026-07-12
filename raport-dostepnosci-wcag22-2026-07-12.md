# Raport dostępności cyfrowej — WCAG 2.2

**Serwis:** Zespół Szkół Nr 26 w Toruniu — https://szkola26.torun.pl/
**Data audytu:** 12 lipca 2026
**Standard odniesienia:** [WCAG 2.2](https://www.w3.org/TR/WCAG22/) (W3C Recommendation), poziomy A i AA; wybrane kryteria AAA omówione informacyjnie
**Zakres:** 13 podstron (index, o-szkole, oferta, rekrutacja, aktualnosci, kalendarz, dla-rodzicow, do-pobrania, faq, dostepnosc, rodo, dla-mediow, 404) + komponenty współdzielone (navbar.js, footer.js, a11y.js, style.css)

---

## 1. Streszczenie wykonawcze

Serwis jest w **bardzo dobrej kondycji dostępnościowej** — spełnia zdecydowaną większość kryteriów WCAG 2.2 na poziomie A i AA. Wcześniejszy audyt WCAG 2.1 AA (12.07.2026) i wdrożone po nim poprawki wyeliminowały wszystkie błędy kontrastu tekstu w trybie jasnym, ciemnym i wysokiego kontrastu — potwierdzone ponownym skanem wszystkich 13 stron.

Audyt względem **WCAG 2.2** (który dodaje 9 nowych kryteriów i usuwa 4.1.1 Parsing) wykazał:

| Waga | Liczba | Problemy |
|---|---|---|
| **Wysoka (AA)** | 2 | Niewidoczny wskaźnik fokusu w stopce (czerwony obrys na czerwonym tle); zbyt niski kontrast wskaźnika fokusu w trybie ciemnym |
| **Średnia (AA)** | 2 | Tooltipy CSS w kalendarzu bez możliwości odrzucenia (1.4.13); jeden zbyt mały cel dotykowy na faq.html (2.5.8) |
| **Niska (A / dobre praktyki)** | 4 | Przełącznik widoku kalendarza bez `aria-pressed`; akordeon do-pobrania bez `aria-controls`; `role="dialog"` na menu mobilnym bez semantyki dialogu; 404.html bez skip-linka i landmarków |
| **Infrastrukturalna** | 1 | Brak nagłówków `Cache-Control` — ryzyko serwowania przestarzałego HTML wskazującego na stare wersje CSS (zaobserwowane w teście) |

**Nowe kryteria WCAG 2.2:** 5 z 9 spełnione lub nie dotyczy, 1 częściowo (2.5.8 — pojedynczy element), szczegóły w sekcji 3.

---

## 2. Metodologia

**Środowisko:** Chromium (podgląd deweloperski), serwer lokalny `python3 -m http.server 5050`, viewporty: 1280×800 (desktop), 733×800 (tablet), 320×800 (minimalna szerokość reflow).

**Techniki:**
- Automatyczny skan kontrastu wszystkich widocznych węzłów tekstowych (algorytm luminancji względnej WCAG, z uwzględnieniem przezroczystości tła i dziedziczenia) — osobno dla trybu jasnego, ciemnego i wysokiego kontrastu, **z wyłączonymi tranzycjami CSS** (eliminacja fałszywych odczytów w trakcie animacji kolorów).
- Automatyczny pomiar celów dotykowych (2.5.8) z implementacją wyjątków normy: odstępu (okrąg 24 px), elementów w tekście (inline) i elementów zastępowalnych.
- Kontrola struktury: hierarchia nagłówków, landmarki, duplikaty ID, atrybuty `alt`, `title` ramek, dostępne nazwy linków/przycisków.
- Testy klawiatury: otwieranie/zamykanie dropdownów i menu mobilnego, obsługa Escape, przywracanie fokusu, pułapka fokusu panelu ułatwień — na viewportach desktop i tablet.
- Test reflow 320 px i test odstępów tekstu (1.4.12: interlinia 1,5×, odstęp liter 0,12 em, wyrazów 0,16 em, akapitów 2 em).
- Analiza statyczna kodu źródłowego (HTML, CSS, JS komponentów).

**Ograniczenia:**
- Nie wykonano testów z rzeczywistymi czytnikami ekranu (NVDA, JAWS, VoiceOver) — semantykę oceniono na podstawie drzewa dostępności i atrybutów ARIA.
- Osadzony feed Facebooka (ładowany na żądanie przyciskiem „Załaduj feed") to treść strony trzeciej — poza kontrolą serwisu; karta zastępcza wyświetlana domyślnie została zbadana i jest zgodna.
- Pseudoklasy `:focus`/`:focus-visible` nie aktywują się w oknie podglądu bez fokusu systemowego — wskaźniki fokusu oceniono przez analizę reguł CSS i obliczenie kontrastów wynikowych.
- Zawartość 74 plików PDF (statuty, wnioski) nie była przedmiotem audytu — wymaga osobnej weryfikacji (patrz sekcja 7).

---

## 3. Nowe kryteria WCAG 2.2 — ocena szczegółowa

### 2.4.11 Fokus nie zasłonięty (minimum) — AA — ✅ SPEŁNIONE
Jedyne elementy przyklejone to nagłówek (64 px) oraz przyciski „Ułatwienia" i „Wróć na górę". `html { scroll-padding-top: 4rem }` kompensuje wysokość nagłówka przy przewijaniu do fokusu i kotwic — element z fokusem nie jest w całości zasłaniany. Panele pływające są małe i położone w rogach; nie zasłaniają całkowicie żadnego elementu w kolejności fokusu.

### 2.4.12 Fokus nie zasłonięty (rozszerzone) — AAA — ⚠️ częściowo
Możliwe **częściowe** nachodzenie przyklejonych przycisków (lewy/prawy dolny róg) na elementy z fokusem przy dolnej krawędzi. Poziom AAA — informacyjnie, bez wpływu na zgodność AA.

### 2.4.13 Wygląd fokusu — AAA — ⚠️ częściowo
Obrys `3px solid` z odsunięciem 3 px spełnia wymogi rozmiaru (≥ obwód 2 px CSS). Kontrast koloru obrysu zawodzi na niektórych tłach — szczegóły w błędzie **B1/B2** (sekcja 5); po ich naprawie kryterium będzie spełnione również na AAA.

### 2.5.7 Ruchy przeciągania — AA — ✅ NIE DOTYCZY
Serwis nie zawiera żadnej funkcjonalności obsługiwanej przeciąganiem (brak sliderów, sortowania, map z przesuwaniem jako jedyną metodą — mapa Google w ramce ma alternatywę: link „Adres" otwierający Mapy Google).

### 2.5.8 Minimalny rozmiar celu (24×24 px) — AA — ⚠️ CZĘŚCIOWO
Zbadano wszystkie strony z pełną implementacją wyjątków normy:
- Linki w stopce (wys. 20 px) — **spełniają przez wyjątek odstępu** (padding `py-2` daje efektywnie 36 px wysokości klikalnej, a odstęp `space-y-2.5` zapewnia offset ≥ 24 px).
- Linki „Czytaj dalej", „Wszystkie", telefon/e-mail — spełniają przez wyjątek odstępu lub inline.
- Ikona BIP w stopce (22×32 px) — spełnia przez wyjątek odstępu.
- ❌ **faq.html — link „Więcej o rekrutacji"** (152×20 px): sąsiedni cel w promieniu < 24 px — **jedyny element niespełniający**. Rekomendacja: dodać `py-2` lub margines pionowy.

### 3.2.6 Spójna pomoc — A — ✅ SPEŁNIONE
Dane kontaktowe (telefon, e-mail, adres, godziny sekretariatu) są generowane ze wspólnego komponentu `footer.js` — identyczna zawartość i kolejność względna na wszystkich 13 stronach. Dodatkowo strona główna ma sekcję „Kontakt" z mapą.

### 3.3.7 Zbędne wprowadzanie danych — A — ✅ NIE DOTYCZY
Serwis nie zawiera formularzy ani procesów wieloetapowych.

### 3.3.8 Dostępne uwierzytelnianie (minimum) — AA — ✅ NIE DOTYCZY
Brak mechanizmów logowania. Linki do e-dziennika (Vulcan UONET+) i Office 365 prowadzą do systemów zewnętrznych, poza zakresem zgodności serwisu.

### 3.3.9 Dostępne uwierzytelnianie (rozszerzone) — AAA — ✅ NIE DOTYCZY

### Usunięte: 4.1.1 Parsing
Kryterium usunięte w WCAG 2.2 (przestarzałe). Niezależnie: skan nie wykazał duplikatów ID na żadnej stronie, HTML poprawny strukturalnie.

---

## 4. Pełna tabela zgodności — WCAG 2.2 poziom A i AA (55 kryteriów)

### Zasada 1: Postrzegalność

| Kryterium | Poziom | Status | Uwagi |
|---|---|---|---|
| 1.1.1 Treść nietekstowa | A | ✅ | Wszystkie `<img>` mają `alt`; muralowe grafiki hero i duplikaty logotypów w karuzeli poprawnie oznaczone `alt=""` + `aria-hidden="true"`; ikony lucide generowane z `aria-hidden="true"`; logo BIP z `alt="BIP"` |
| 1.2.1–1.2.5 Multimedia | A/AA | ✅ n/d | Brak audio/wideo |
| 1.3.1 Informacje i relacje | A | ⚠️ | Struktura poprawna (landmarki, nagłówki bez przeskoków na 13 stronach, listy, `aria-labelledby` sekcji). Drobiazg: akordeon na do-pobrania.html ma `aria-expanded`, ale brak `aria-controls` (FAQ ma — dodawane skryptem); przełącznik Lista/Kalendarz bez stanu programowego (błąd **B5**) |
| 1.3.2 Zrozumiała kolejność | A | ✅ | Kolejność DOM zgodna z wizualną; weryfikacja na 320–1280 px |
| 1.3.3 Właściwości zmysłowe | A | ✅ | Brak instrukcji opartych wyłącznie na kształcie/położeniu/kolorze |
| 1.3.4 Orientacja | AA | ✅ | Brak blokad orientacji; layout responsywny w pionie i poziomie |
| 1.3.5 Cel wprowadzania danych | AA | ✅ n/d | Brak formularzy |
| 1.4.1 Użycie koloru | A | ⚠️ | Aktywny widok kalendarza (Lista/Kalendarz) rozróżniany wyłącznie kolorem tła — powiązane z błędem **B5**; linki w treści rozróżnialne (kolor + pogrubienie + podkreślenie przy hover) |
| 1.4.2 Kontrola odtwarzania dźwięku | A | ✅ n/d | Brak dźwięku |
| 1.4.3 Kontrast (minimum) | AA | ✅ | **0 błędów** na 13 stronach — tryb jasny, ciemny i wysokiego kontrastu (skan pełny, tranzycje wyłączone). Poprawki z 12.07 (kalendarz `text-amber-700`, stopka `text-white`, FB `#1158B8`, nadpisania dark-mode) potwierdzone |
| 1.4.4 Zmiana rozmiaru tekstu | AA | ✅ | Reflow bez utraty treści; dodatkowo widget zmiany rozmiaru czcionki (12–28 px) |
| 1.4.5 Obrazy tekstu | AA | ✅ | Logotypy partnerów objęte wyjątkiem (logo); brak innych obrazów tekstu |
| 1.4.10 Reflow (320 px) | AA | ✅ | Brak przewijania poziomego na wszystkich testowanych stronach przy 320 px |
| 1.4.11 Kontrast elementów nietekstowych | AA | ❌ | Wskaźnik fokusu: na tle stopki 1,0:1 (**B1**), na powierzchniach trybu ciemnego 2,6:1 (**B2**) — wymagane ≥ 3:1. Pozostałe elementy UI (obramowania przycisków, ikony funkcyjne) spełniają |
| 1.4.12 Odstępy w tekście | AA | ✅ | Po narzuceniu odstępów wg normy: brak utraty treści i funkcjonalności; przepełnienie dokumentu o 14 px bez wpływu na czytelność (jedyne „przycięte" elementy to klasy `sr-only` — wzorzec zamierzony). Serwis ma też własny przełącznik „Zwiększony odstęp" |
| 1.4.13 Treść po najechaniu/fokusie | AA | ❌ | Tooltipy CSS w siatce kalendarza (106 elementów `[data-tooltip]`) nie są odrzucalne klawiszem Esc ani „hoverable" (**B3**) |

### Zasada 2: Funkcjonalność

| Kryterium | Poziom | Status | Uwagi |
|---|---|---|---|
| 2.1.1 Klawiatura | A | ✅ | Cała funkcjonalność dostępna z klawiatury: dropdowny, menu mobilne, akordeony, panel ułatwień, przełącznik widoku; komórki kalendarza fokusowalne (`tabindex="0"`) |
| 2.1.2 Bez pułapki na klawiaturę | A | ✅ | Pułapka fokusu w panelu ułatwień jest zamierzona (dialog modalny) i ma wyjście Esc — przetestowane |
| 2.1.4 Jednoznakowe skróty | A | ✅ n/d | Brak skrótów klawiszowych |
| 2.2.1 Regulowany czas | A | ✅ n/d | Brak limitów czasowych |
| 2.2.2 Pauza, zatrzymanie, ukrycie | A | ✅ | Karuzela „Przyjaciele Szkoły" (animacja > 5 s): pauza przy hover, pełne zatrzymanie widgetem „Zatrzymaj animacje" oraz automatycznie przy `prefers-reduced-motion` |
| 2.3.1 Trzy błyski | A | ✅ | Brak treści migających |
| 2.4.1 Pomijanie bloków | A | ⚠️ | Skip-link „Przejdź do głównej treści" na 12/13 stron; **brak na 404.html** (**B8**) |
| 2.4.2 Tytuły stron | A | ✅ | Unikalne, opisowe tytuły wg schematu „Sekcja – ZS Nr 26 Toruń" na wszystkich stronach |
| 2.4.3 Kolejność fokusu | A | ✅ | Logiczna; brak `tabindex` > 0; dropdowny wstrzykiwane w miejscu wywołania. Obserwacja: 106 fokusowalnych dni w siatce kalendarza wydłuża ścieżkę tabulacji (patrz sekcja 6) |
| 2.4.4 Cel linku (w kontekście) | A | ✅ | „Czytaj dalej" w obrębie `<article>` z nagłówkiem — cel ustalany z kontekstu; linki plików z dopiskiem „PDF · rok"; linki zewnętrzne z `sr-only` „(otwiera się w nowej karcie)" dodawanym globalnie w footer.js |
| 2.4.5 Wiele dróg | AA | ✅ | Nawigacja główna + nawigacja stopki + sitemap.xml |
| 2.4.6 Nagłówki i etykiety | AA | ✅ | Opisowe nagłówki bez przeskoków poziomów (weryfikacja automatyczna 13 stron); etykiety `aria-label` na przyciskach ikonowych |
| 2.4.7 Widoczny fokus | AA | ❌ | Globalny wskaźnik `:focus-visible` istnieje (3 px, odsunięcie 3 px), ale jest **niewidoczny na tle stopki** (czerwony na czerwonym — **B1**) i słabo widoczny w trybie ciemnym (**B2**) |
| 2.4.11 Fokus nie zasłonięty (min.) | AA | ✅ | Patrz sekcja 3 |
| 2.5.1 Gesty wskazywania | A | ✅ n/d | Brak gestów wielopunktowych/ścieżkowych |
| 2.5.2 Anulowanie wskazania | A | ✅ | Zdarzenia na click (up-event); brak akcji na down-event |
| 2.5.3 Etykieta w nazwie | A | ✅ | Nazwy dostępne zawierają tekst widoczny (np. `aria-label="Otwórz panel ułatwień dostępu"` zawiera „Ułatwienia" — zgodne) |
| 2.5.4 Aktywowanie ruchem | A | ✅ n/d | Brak funkcji aktywowanych ruchem urządzenia |
| 2.5.7 Ruchy przeciągania | AA | ✅ n/d | Patrz sekcja 3 |
| 2.5.8 Minimalny rozmiar celu | AA | ⚠️ | 1 element na faq.html (**B4**); reszta spełnia wprost lub przez wyjątki normy — patrz sekcja 3 |

### Zasada 3: Zrozumiałość

| Kryterium | Poziom | Status | Uwagi |
|---|---|---|---|
| 3.1.1 Język strony | A | ✅ | `<html lang="pl">` na wszystkich stronach |
| 3.1.2 Język części | AA | ✅ | Obce frazy to nazwy własne (Office 365, Teams, Grid 3) — wyjątek normy |
| 3.2.1 Po otrzymaniu fokusu | A | ✅ | Fokus nie wywołuje zmian kontekstu |
| 3.2.2 Podczas wprowadzania danych | A | ✅ n/d | Brak pól formularzy |
| 3.2.3 Spójna nawigacja | AA | ✅ | Nawigacja i stopka generowane ze wspólnych komponentów — identyczna kolejność na wszystkich stronach |
| 3.2.4 Spójna identyfikacja | AA | ✅ | Te same funkcje = te same nazwy/ikony w całym serwisie |
| 3.2.6 Spójna pomoc | A | ✅ | Patrz sekcja 3 |
| 3.3.1 Identyfikacja błędu | A | ✅ n/d | Brak formularzy |
| 3.3.2 Etykiety lub instrukcje | A | ✅ n/d | Brak formularzy (przyciski +/− rozmiaru tekstu mają `aria-label`) |
| 3.3.3 Sugestie korekty błędów | AA | ✅ n/d | Brak formularzy |
| 3.3.4 Zapobieganie błędom | AA | ✅ n/d | Brak transakcji |
| 3.3.7 Zbędne wprowadzanie danych | A | ✅ n/d | Patrz sekcja 3 |
| 3.3.8 Dostępne uwierzytelnianie | AA | ✅ n/d | Patrz sekcja 3 |

### Zasada 4: Solidność

| Kryterium | Poziom | Status | Uwagi |
|---|---|---|---|
| 4.1.2 Nazwa, rola, wartość | A | ⚠️ | Zdecydowana większość poprawna: `aria-expanded`/`aria-haspopup` na dropdownach, `aria-pressed` na przełącznikach widgetu, `role="dialog"` + `aria-modal` + pułapka fokusu na panelu ułatwień, `aria-current="page"` w nawigacji, 0 elementów bez dostępnej nazwy. Wyjątki: przełącznik Lista/Kalendarz bez `aria-pressed` (**B5**); `role="dialog"` na menu mobilnym bez `aria-modal` i pułapki fokusu (**B7**) |
| 4.1.3 Komunikaty o stanie | AA | ✅ | Region `aria-live="polite"` (`#a11y-announcer`) ogłasza zmiany ustawień; lista aktualności z `aria-live="polite"` + `aria-busy` na czas ładowania |

**Bilans A+AA: 44 spełnione / nie dotyczy · 5 częściowo · 3 niespełnione (B1/B2 → 1.4.11 + 2.4.7, B3 → 1.4.13, B4 → 2.5.8 częściowo)**

---

## 5. Błędy — szczegóły i rekomendacje

### B1 — Wskaźnik fokusu niewidoczny w stopce ❗ priorytet wysoki
**Kryteria:** 2.4.7 (AA), 1.4.11 (AA) · **Lokalizacja:** stopka na wszystkich 13 stronach (komponent [footer.js](components/footer.js))
Globalna reguła [style.css:65](style.css:65) `:focus-visible { outline: 3px solid #C62828 }` rysuje czerwony obrys. Tło stopki to ten sam kolor `#C62828` (`bg-brand-600`) — **kontrast 1,0:1, obrys całkowicie niewidoczny**. Użytkownik klawiatury traci orientację na 14 linkach stopki + ikonie Facebooka.
**Naprawa** (w style.css):
```css
footer :focus-visible,
.bg-brand-600 :focus-visible,
.bg-brand-700 :focus-visible {
  outline-color: #fff; /* biały na #C62828 = 5,6:1 */
}
```

### B2 — Wskaźnik fokusu poniżej progu w trybie ciemnym ❗ priorytet wysoki
**Kryteria:** 1.4.11 (AA), 2.4.7 (AA) · **Lokalizacja:** wszystkie strony w trybie ciemnym
Obrys `#C62828`: na tle stron `#0F172A` — 3,18:1 (na granicy, formalnie spełnia), ale na powierzchniach kart/nawigacji `#1E293B` — **2,6:1 < 3:1**.
**Naprawa:**
```css
body.dark-mode :focus-visible { outline-color: #FCA5A5; } /* ≈ 8:1 na obu tłach */
```

### B3 — Tooltipy kalendarza nieodrzucalne — priorytet średni
**Kryterium:** 1.4.13 (AA) · **Lokalizacja:** [kalendarz.html](kalendarz.html) — widok siatki, 106 komórek `[data-tooltip]`
Tooltip realizowany czystym CSS (`:hover::after` / `:focus::after`): nie można go odrzucić klawiszem Esc bez przesuwania fokusu, nie można najechać kursorem na sam dymek. Waga obniżona, bo identyczna informacja jest dostępna w widoku listy (domyślnym).
**Naprawa:** handler Esc zdejmujący tooltip (np. dodanie klasy tłumiącej `::after`), lub zastąpienie dymka stale widoczną etykietą w komórce.

### B4 — Za mały cel dotykowy — priorytet średni
**Kryterium:** 2.5.8 (AA) · **Lokalizacja:** [faq.html](faq.html) — link „Więcej o rekrutacji" (152×20 px, brak wystarczającego odstępu od sąsiedniego celu)
**Naprawa:** dodać `py-2` (podniesie wysokość klikalną do 36 px) lub `inline-block` z marginesem pionowym ≥ 4 px.

### B5 — Przełącznik widoku kalendarza bez stanu programowego — priorytet niski
**Kryteria:** 4.1.2 (A), 1.4.1 (A) · **Lokalizacja:** [kalendarz.html:93](kalendarz.html:93) przyciski `#btn-list`/`#btn-grid`, funkcja `setView()` ([kalendarz.html:335](kalendarz.html:335))
Aktywny widok komunikowany wyłącznie kolorem (`.view-btn.active`); czytnik ekranu nie pozna stanu.
**Naprawa:** w HTML `aria-pressed="true/false"`, w `setView()`:
```js
document.getElementById('btn-list').setAttribute('aria-pressed', v === 'list');
document.getElementById('btn-grid').setAttribute('aria-pressed', v === 'grid');
```

### B6 — Akordeon bez `aria-controls` — priorytet niski
**Kryterium:** 1.3.1/4.1.2 (dobra praktyka) · **Lokalizacja:** [do-pobrania.html](do-pobrania.html) — przyciski kategorii mają `aria-expanded`, brak `aria-controls` (na faq.html atrybut jest dodawany skryptem — warto ujednolicić).

### B7 — `role="dialog"` na menu mobilnym — priorytet niski
**Kryterium:** 4.1.2 (A) · **Lokalizacja:** [navbar.js:113](components/navbar.js:113)
Menu mobilne ma `role="dialog"`, ale nie jest modalne (brak `aria-modal`, brak pułapki fokusu) — czytniki mogą zapowiedzieć dialog i zdezorientować użytkownika. Escape i przywracanie fokusu działają poprawnie (przetestowane na 733 px i 1280 px).
**Naprawa:** usunąć `role="dialog"` (wzorzec disclosure z `aria-expanded` na hamburgerze jest wystarczający i już wdrożony).

### B8 — 404.html bez skip-linka i landmarków — priorytet niski
**Kryterium:** 2.4.1 (A — wymagany dla powtarzalnych bloków; strona nie ma nawigacji, więc formalnie nie łamie normy) · Strona ma tylko `<main>` — brak nagłówka, nawigacji i stopki. Zalecane ujednolicenie ze schematem pozostałych stron (nawigacja + stopka + skip-link) dla spójności (3.2.3).

### B9 — Brak nagłówków cache — ryzyko regresji dostępności — priorytet średni (infrastruktura)
Podczas audytu zaobserwowano, że przeglądarka potrafiła serwować **przestarzałą kopię HTML** (odwołującą się do `style.css?v=3` sprzed poprawek kontrastu) mimo aktualnych plików na serwerze — heurystyczne cache'owanie przy braku `Cache-Control`. Skutek: użytkownik może widzieć wersję strony **bez poprawek dostępności**. Wersjonowanie zasobów (`?v=7`) działa, ale tylko gdy sam HTML jest świeży.
**Naprawa:** na hostingu produkcyjnym (GitHub Pages wysyła `max-age=600` — ryzyko ograniczone do 10 min) nie trzeba nic robić; przy zmianie hostingu ustawić `Cache-Control: no-cache` dla HTML. Utrzymywać dyscyplinę bumpowania `?v=` przy każdej zmianie CSS/JS.

---

## 6. Obserwacje i zalecenia dodatkowe (poza zgodnością AA)

1. **Ścieżka tabulacji w siatce kalendarza** — 106 komórek dni z `tabindex="0"` oznacza ponad sto tabnięć do przejścia siatki. Rozważyć wzorzec „roving tabindex" (strzałki poruszają się po siatce, Tab wychodzi z komponentu) — poprawi wygodę bez wpływu na zgodność.
2. **2.4.9 Cel linku — tylko z linku (AAA):** cztery linki „Czytaj dalej" na stronie głównej mają identyczną nazwę dostępną. Na AA wystarcza kontekst artykułu; dla AAA można dodać `sr-only` z tytułem newsa.
3. **1.4.6 Kontrast wzmocniony (AAA):** większość tekstu spełnia 7:1; tekst pomocniczy `#4B5563` na białym = 6,4:1 — poniżej AAA, powyżej AA. Informacyjnie.
4. **Panel ułatwień dostępu** — wzorowo zaimplementowany (dialog modalny, pułapka fokusu, Esc, `aria-pressed`, komunikaty `aria-live`, trwałość w `localStorage`, przywracanie ustawień przy ładowaniu). Wysoki kontrast, tryb ciemny, skala szarości, czcionka dla dysleksji, odstępy, stop-animacji, rozmiar tekstu 12–28 px.
5. **`prefers-reduced-motion`** — pełne poszanowanie systemowej preferencji (animacje hero, reveal, karuzela, parallax, smooth-scroll) — wzorcowe.
6. **Sierotki (jednoliterowe spójniki)** — skrypt zamienia spacje na niełamliwe; bez wpływu na czytniki ekranu (biały znak), OK.
7. **74 pliki PDF** (statuty, wnioski, kalendarz) — dostępność samych dokumentów nie była badana. Zgodnie z ustawą o dostępności cyfrowej pliki do pobrania również muszą być dostępne (PDF/UA lub wersja HTML). Zalecany osobny przegląd, zaczynając od najczęściej pobieranych wniosków rekrutacyjnych.
8. **Deklaracja dostępności** ([dostepnosc.html](dostepnosc.html)) deklaruje częściową zgodność z WCAG 2.1 — po wdrożeniu poprawek B1–B4 warto zaktualizować treść deklaracji (polskie prawo wymaga WCAG 2.1 AA — EN 301 549; zgodność z 2.2 to nadwyżka, którą warto odnotować).
9. **Feed Facebooka** — domyślnie wyświetlana jest w pełni dostępna karta zastępcza; iframe strony trzeciej ładowany dopiero po świadomym kliknięciu, z `title`. Dobry wzorzec (privacy + performance + a11y). Treść samego feedu FB pozostaje poza kontrolą serwisu — dopuszczalne jako „treść strony trzeciej".

---

## 7. Plan naprawczy (proponowana kolejność)

| # | Działanie | Kryterium | Nakład |
|---|---|---|---|
| 1 | Biały obrys fokusu w stopce (B1) | 2.4.7, 1.4.11 | 3 linie CSS |
| 2 | Jasny obrys fokusu w dark mode (B2) | 1.4.11 | 1 linia CSS |
| 3 | `py-2` na linku w FAQ (B4) | 2.5.8 | 1 klasa |
| 4 | `aria-pressed` w przełączniku kalendarza (B5) | 4.1.2 | 4 linie JS + 2 atrybuty |
| 5 | Usunąć `role="dialog"` z menu mobilnego (B7) | 4.1.2 | 1 atrybut |
| 6 | `aria-controls` w akordeonie do-pobrania (B6) | dobra praktyka | kilka linii |
| 7 | Obsługa Esc dla tooltipów kalendarza (B3) | 1.4.13 | ~10 linii JS/CSS |
| 8 | Ujednolicenie 404.html (B8) | spójność | szablon |
| 9 | Bump `?v=` po zmianach CSS (B9) | proces | — |
| 10 | Audyt dostępności plików PDF | ustawa | osobny projekt |

Po wykonaniu punktów 1–5 serwis będzie w pełni zgodny z **WCAG 2.2 AA** (punkt 7 domyka ostatnie kryterium AA — 1.4.13).

---

*Raport przygotowany automatycznie z weryfikacją manualną. Poprzedni raport (WCAG 2.1 AA): [raport-dostepnosci-2026-07-12.md](raport-dostepnosci-2026-07-12.md).*
