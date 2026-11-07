# sobotkavisual.pl — notatki robocze

Strona Sobotka Visual Creations (SVC), właściciel: Krzysztof „Krzysiu” Sobotka.
Plik czytany automatycznie na starcie sesji. **Nie wpływa na stronę ani SEO**, bo nie trafia do `dist/`.
Aktualizuj sekcje „Zrobione” i „Do zrobienia” po każdej większej zmianie.

## Zasady współpracy (ważne)

- **Nic na `main` bez zgody Krzysia** („wrzucaj”). Pracuj na gałęzi, otwieraj PR, scalaj dopiero po zgodzie.
- **Nigdy nie pisz publicznie o statusie VAT** (strona, oferty, artykuły). Nie pisz też „zł netto”.
- Nie zmyślaj faktów o realizacjach (godziny, programy, liczby). Pisz tylko to, co podał Krzysiu albo co widać w materiale; o resztę zapytaj.
- Odpowiedzi po polsku, krótko, wspierająco; terminy angielskie w nawiasach.
- Linki dla Krzysia podawaj w bloku kodu w osobnej linii (kropka na końcu zdania psuła mu adresy).
- Nazwa marki zawsze „Sobotka Visual” / „SVC”, nigdy samo „Sobotka” (konkurencja z miastem Sobótka).

## Technika

- Astro 7 (SSG) + Tailwind v4, Content Collections (Zod) w `src/content.config.ts`.
- Kolekcje: `work` (realizacje), `pages` (podstrony i artykuły, pole `blocks`), `oferty` (noindex).
- Artykuły = strony z polem `updated` → renderowane przez `src/components/article/Article.astro` (styl bloga inFakt).
- Bloki treści: `src/components/blocks/Blocks.astro` (tekst, zdjecie, karuzela, wideo 16:9/9:16/1:1, realizacje, przycisk, oferta…). Markdown w blokach: `src/lib/md.ts`.
- **CMS-y dwa**: Sveltia (`public/admin/config.yml`, kotwica `*blocktypes`) i Pages CMS (`.pages.yml`). Każde nowe pole dodawaj w obu.
- Build: `astro build && node scripts/slashes.mjs && node scripts/markdown.mjs && pagefind --site dist && node scripts/indexnow.mjs`.
- Cloudflare Pages + `functions/_middleware.js` (301 www→apex, wersje `index.md` dla agentów AI przy `Accept: text/markdown`), `functions/api/order.js` (Resend).
- GA4 `G-YR5N7K6FYS` z Consent Mode v2 (domyślnie odmowa), pasek zgody `src/components/analytics/ConsentBar.astro` (localStorage `svc-zgoda`), tylko na sobotkavisual.pl.
- Dane strukturalne (JSON-LD) firmy w `src/components/landing/Hero.astro` (ProfessionalService, sameAs, taxID 7532467050).
- `public/robots.txt` wpuszcza wszystkie boty AI (decyzja Krzysia: opcja A).
- IndexNow: klucz `5cd1e4fb34174428a4d5b1ba8787dbc6`, GitHub Action po wdrożeniu; Bing zwraca 403, więc w praktyce działa Cloudflare Crawler Hints.

## Media — repo `SobotkaVisualElements/svc-media`

- Serwowane z `https://media.sobotkavisual.pl/` (`filmy/`, `obrazy/`). Krzysiu wrzuca tam surowe pliki.
- Workflow: zmień nazwę na czystą (małe litery, myślniki), oryginał zostaw jako `*-org`, zrób wersję na stronę:
  - rolki: 1080×1920, H.264 CRF 22–25, `-movflags +faststart`, AAC 128k;
  - film w tle: bez dźwięku, 720p, CRF 30;
  - plakaty pionowe 800×1280, kadry 720×1280, JPEG q80 progresywny (~100–250 KB).
- **Sprawdzaj `sample_aspect_ratio` w ffprobe** — eksporty z HandBrake bywały anamorficzne (1080×1080 wyświetlane jako 9:16). Skaluj z `setsar=1`.
- Przy podmianie pliku zmieniaj nazwę (cache 1 dzień).
- Dodawanie nowych plików do svc-media jest bezpieczne (strona ich nie używa, dopóki nie zmienimy linków).

## Zrobione (do 7.11.2026)

- Pełny audyt techniczny SEO: GSC, Bing, Ahrefs (Health 100), SEOChecker, GTmetrix, walidatory schema — błędy usunięte.
- Strona 404, tytuły, og:image, apple-touch-icon, przekierowanie www, ukośniki w linkach, noindex ofert.
- O nas, linki do profili (YouTube, IG, TikTok, FB, wizytówka Google), podpis Gmail (`/podpis/`).
- 6 artykułów-poradników (ceny rolek, filmu reklamowego, animacji; pomysły na rolki; rolki rekrutacyjne; booktrailer) + `/poradniki/`.
- Markdown dla agentów AI, robots.txt dla botów AI, GA4 z paskiem zgody, NIP w polityce prywatności i stopce.
- Kompresja mediów (−25 MB): plakaty, film w tle, rolki.
- Realizacje: Wędrowycz (pełny tekst Krzysia + 3 kadry), „Zapiski z Tajpej” R.F. Kuang (nowa, 9:16).
- Dłuższe opisy meta (strona główna, generator, realizacje, 2 projekty).

## Wyniki słów kluczowych (5.11.2026, Google incognito)

- **oprawa transmisji meczu** — 1. miejsce. Nisza do rozbudowy.
- **Sobotka Visual / Krzysztof Sobotka motion** — 1. miejsce + wizytówka 5,0 (6 opinii).
- **montaż wideo Opole** — w podsumowaniu AI tak, organicznie ~11., w mapie brak (konkurenci: Fi-Fi Film, StudiOZ, MORAFILM; 24–33 opinii).
- **film reklamowy Opole** — brak (Pantoda, BartosikStudio w AI).
- **filmowanie / film promocyjny Nysa** — brak; wyniki zdominowane przez wesela → luka „dla firm”.
- **animacja logo cena** — brak, słaba konkurencja.
- Odpuszczone: „animacja Opole” (animatorzy dla dzieci), Wrocław, „rolki dla firm”, ogólny „booktrailer”.

## Do zrobienia

**Moje (czekają na „tak” / „wrzucaj”):**
1. Rozbudowa `/uslugi/montaz-wideo-opole/` (treść, FAQ, realizacje, linki z artykułów).
2. Podstrona „film reklamowy / wizerunkowy Opole”.
3. Podstrona „film promocyjny dla firm Nysa”.
4. Artykuł „Ile kosztuje animacja logo” (+ GSC pokazuje „projektowanie logo opole”).
5. Nisza sportowa: belka wynikowa, grafika meczowa, oprawa klubu.
6. Artykuły: „jak zrobić miniaturę, która przyciąga kliknięcia” (case Langier, CTR 21%), „postprodukcja YouTube”.
7. Wiosną: oferta „relacja wideo z Sobótek” dla gmin; ewentualnie strona lokalna „Sobótka”.
8. Poprawić wielkość liter „HR I Rekrutacja” w filtrach `/poradniki/`.
9. Kulisy Tajpej — czekam na tekst od Krzysia (elementy, godziny, programy); data realizacji wpisana na 6.11.2026 do weryfikacji.

**Krzysia:**
- Wizytówka Google: kategoria dodatkowa „Wideofilmowanie”, zdjęcia, więcej opinii.
- Profil Oferteo; link z sobotkadesign.myportfolio.com do strony.
- Gmail „Wyślij jako” przez Resend SMTP (smtp.resend.com:587, user `resend`) — maile lądują w Ofertach przez śledzenie Brevo.
- Cache Rule dla media.sobotkavisual.pl w Cloudflare.
- Ahrefs: włączyć integrację IndexNow w ustawieniach Site Audit (do sprawdzenia, czy jest).
- Daty i plakaty brakujących realizacji w CMS; zdjęcia stockowe do artykułów.
- Ewentualny ponowny eksport rolki Tajpej (HandBrake: Anamorphic None, 1080×1920).

## Komendy

- `pnpm dev` / `pnpm build` / `pnpm preview`.
- Lokalny podgląd: `python3 -m http.server 4329 -d dist`.
- Playwright: `/opt/npm-tools/node_modules/playwright`.
- Sandbox nie ma dostępu do sobotkavisual.pl, media.sobotkavisual.pl ani bing.com — weryfikację na żywo robi Krzysiu.
