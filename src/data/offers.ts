/*
 * Landingi ofert — treść z PDF „Propozycja współpracy” (Pakiet PRO, Kampania wideo, Kanał).
 * Strony: /oferta/<slug>. Każda liczba rynkowa ma źródło; nasze wyniki pochodzą z realnych realizacji.
 */
export type Item = { t: string; d: string };
export type Num = { n: string; t: string; d: string };
export type Stat = { v: number; suf: string; d: string; src: string };
export type Price = {
	tag: string; name: string; price: string; per: string; note: string;
	items: string[]; featured?: boolean; cta?: { label: string; href: string };
};

export interface Offer {
	slug: string;
	pdf: string;
	seoTitle: string;
	seoDesc: string;
	service: string;
	eyebrow: string;
	title: [string, string?];
	lead: string;
	pkg: string;
	intro: { title: [string, string?]; paras: string[] };
	become: { title: [string, string?]; lead: string; items: Item[]; punch: string };
	stats: { title: [string, string?]; items: Stat[] };
	inside: { eyebrow: string; title: [string, string?]; lead: string; items: Num[] };
	special: 'rytm' | 'anatomia' | 'algorytm';
	faq: { q: string; a: string }[];
	doubts: { q: string; a: string }[];
	invest: { title: [string, string?]; cards: Price[]; footnote?: string };
	final: { title: [string, string?]; lead: string; cta: string };
}

const wyzowl = 'Wyzowl, za: SocialPilot';
const dr = 'DataReportal, „Digital 2025: Poland”, za: Radio Kielce';

const PRO_ITEMS = ['4 materiały wideo', '8 krótkich form pionowych', '8 grafik i miniatur', '3 nowe elementy animowane', 'rozwijany system graficzny', 'harmonogram publikacji i raport'];
const doubtAI = { q: '„AI zrobi to taniej.”', a: 'Może szybciej. Ale klienci coraz lepiej rozpoznają generowane treści i coraz mniej im ufają. U nas każdą klatkę układa człowiek.' };

export const offers: Offer[] = [
	{
		slug: 'dzial-wideo',
		pdf: '/oferty/SVC_Propozycja_Pakiet_PRO.pdf',
		seoTitle: 'Dział wideo dla firmy w abonamencie — Pakiet PRO | Opole',
		seoDesc: 'Wideo, rolki, grafika i animacja co miesiąc, w stałym rytmie — bez rekrutacji, sprzętu i szukania ludzi. Pakiet PRO od 7 200 zł netto / mies. Opole i cała Polska.',
		service: 'Abonamentowa produkcja wideo i social media dla firm',
		eyebrow: 'Propozycja współpracy · Pakiet PRO',
		title: ['Twój dział', 'wideo.'],
		lead: 'Pełne zaplecze działu marketingu: wideo, rolki, grafika i animacja w stałym rytmie — bez rekrutacji, sprzętu i szukania ludzi.',
		pkg: 'pro',
		intro: {
			title: ['Najdroższy materiał to', 'ten, który nie powstał.'],
			paras: [
				'Większość firm nie ma problemu z pomysłami. Ma problem z tym, że pomysły czekają.',
				'Aż ktoś znajdzie czas. Aż grafik wróci z urlopu. Aż szef zatwierdzi. W tym czasie konkurencja publikuje — i to ją klienci zapamiętują.',
				'Pakiet PRO odwraca tę kolejność. Najpierw jest rytm — co miesiąc, w terminie. Pomysły wreszcie mają gdzie trafić.',
			],
		},
		become: {
			title: ['Pokaż swój potencjał', 'w internecie.'],
			lead: 'Klient nie widzi Twojego zespołu. Widzi to, co publikujesz — i po tym ocenia, z kim ma do czynienia.',
			items: [
				{ t: 'Profesjonalny odbiór', d: 'Jeden styl w każdym poście, filmie i rolce. Klient czuje, że za marką stoi porządek, i szybciej jej ufa.' },
				{ t: 'Więcej współprac', d: 'Partnerzy, media i kontrahenci chętniej rozmawiają z firmą, która dobrze wygląda i regularnie się pokazuje.' },
				{ t: 'Nowe kanały', d: 'YouTube, Instagram, TikTok, LinkedIn, strona — z jednej produkcji obsługujesz wszystkie.' },
				{ t: 'Spokojna głowa', d: 'Nie szukasz montażysty, grafika i animatora. Masz jedną osobę kontaktową i jeden plan.' },
			],
			punch: 'Konkurencja publikuje, kiedy ma czas. Ty publikujesz co tydzień — i klienci zaczynają na to czekać.',
		},
		stats: {
			title: ['Sprzedaż zaczyna się', 'od wideo.'],
			items: [
				{ v: 85, suf: '%', d: 'ludzi mówi, że film przekonał ich do zakupu produktu lub usługi.', src: wyzowl },
				{ v: 83, suf: '%', d: 'marketerów mówi, że wideo bezpośrednio zwiększyło ich sprzedaż.', src: wyzowl },
				{ v: 63, suf: '%', d: 'konsumentów woli krótki film o produkcie niż tekst czy rozmowę handlową.', src: wyzowl },
				{ v: 29, suf: ' mln', d: 'użytkowników YouTube w Polsce. Twoi klienci już tam są.', src: dr },
			],
		},
		inside: {
			eyebrow: 'Co jest w środku · co miesiąc',
			title: ['Cały dział', 'w jednym pakiecie.'],
			lead: 'Wy decydujecie, co pokazać. Produkcję — od montażu po animację — bierzemy na siebie.',
			items: [
				{ n: '4', t: 'materiały wideo', d: 'Filmy o firmie, produktach i ludziach. Co tydzień masz coś, czym możesz się pochwalić.' },
				{ n: '8', t: 'krótkich form pionowych', d: 'Rolki na Instagram, TikTok i YouTube Shorts — tam, gdzie klienci przewijają.' },
				{ n: '8', t: 'grafik i miniatur', d: 'Posty, okładki, miniatury. Jeden styl, rozpoznawalny bez czytania podpisu.' },
				{ n: '3', t: 'nowe elementy animowane', d: 'Oprawa rośnie co miesiąc: logo w ruchu, plansze, przejścia, infografiki.' },
				{ n: '1', t: 'rozwijany system graficzny', d: 'Szablony i zasady, dzięki którym każdy kolejny materiał powstaje szybciej i wygląda spójnie.' },
				{ n: '1', t: 'harmonogram i raport', d: 'Wiesz, co wychodzi i kiedy. Na koniec miesiąca: co zadziałało i co zmieniamy.' },
			],
		},
		special: 'rytm',
		faq: [
			{ q: 'Skąd brać materiał do filmów?', a: 'Z tego, co już macie: nagrania z telefonu, zdjęcia, realizacje, pytania klientów. Resztę uzupełnia animacja i grafika.' },
			{ q: 'A jeśli nie mamy pomysłów na treści?', a: 'Macie, tylko jeszcze ich nie widzicie. Każde pytanie klienta to rolka, każda realizacja to film. Pomagamy je wyłapać.' },
			{ q: 'A jeśli w danym miesiącu potrzebujemy czegoś innego?', a: 'Dajcie znać wcześniej. Zmiany w ramach pakietu ustalamy przy planowaniu miesiąca.' },
			{ q: 'Do kogo należą materiały?', a: 'Gotowe materiały są Wasze po zapłacie. System szablonów działa na licencji i po 12 miesiącach przechodzi na Was w całości.' },
			{ q: 'Ile to zajmie naszego czasu?', a: 'Planowanie miesiąca i akceptacje. Nie szukacie ludzi i nie pilnujecie terminów.' },
			{ q: 'Co po sześciu miesiącach?', a: 'Patrzymy w raporty i decydujecie: kontynuujemy, zmieniamy pakiet albo kończymy. Bez niespodzianek w umowie.' },
		],
		doubts: [
			{ q: '„Taniej zatrudnić kogoś na etat.”', a: 'Etat to jedna osoba z jednym zestawem umiejętności — plus sprzęt, licencje, urlopy i zwolnienia. Tu masz montaż, animację, grafikę i dźwięk w jednej fakturze.' },
			{ q: '„Nie mamy tyle treści.”', a: 'Macie — tylko jeszcze jej nie widzicie. Każdy dzień w firmie i każde pytanie klienta to gotowy temat.' },
			{ q: '„7 200 zł to dużo.”', a: 'Dużo za jeden film. Za miesiąc pracy całego działu — 4 filmy, 8 rolek, 8 grafik i animacje — to inna rozmowa.' },
			doubtAI,
			{ q: '„Nie wiem, czy to się zwróci.”', a: 'Dlatego co miesiąc dostajesz raport: co działa, co nie i co zmieniamy. Decyzje opierasz na danych.' },
		],
		invest: {
			title: ['Płacisz raz,', 'korzystasz cały czas.'],
			cards: [
				{ tag: 'Start', name: 'START', price: '2 500', per: 'zł netto / mies.', note: 'Stała obecność, bez wideo.', items: ['6 krótkich form pionowych', '6 grafik i miniatur', '1 nowy element animowany', '1 runda poprawek', 'raport miesięczny'], cta: { label: 'Wybieram START', href: '/generator?pakiet=start' } },
				{ tag: 'Najczęściej wybierany', name: 'PRO', price: '7 200', per: 'zł netto / mies.', note: 'Pełne zaplecze działu marketingu.', items: PRO_ITEMS, featured: true, cta: { label: 'Skonfiguruj PRO', href: '/generator?pakiet=pro' } },
				{ tag: 'Priorytet', name: 'STUDIO', price: '12 900', per: 'zł netto / mies.', note: 'Najwyższy poziom, priorytet i strategia.', items: ['6 materiałów wideo', '12 krótkich form pionowych', '16 grafik i miniatur', '5 nowych elementów animowanych', 'dzień zdjęciowy, priorytet 24 h'], cta: { label: 'Wybieram STUDIO', href: '/generator?pakiet=studio' } },
			],
			footnote: 'Każdy pakiet: minimum 6 miesięcy współpracy. Materiały Wasze po zapłacie.',
		},
		final: { title: ['Zamów i zacznijmy', 'od zaraz.'], lead: 'Pierwszy krok to 30 minut rozmowy. Ułożymy plan pierwszego miesiąca — tak, żebyś wiedział dokładnie, co i kiedy wyjdzie.', cta: 'Skonfiguruj pakiet PRO' },
	},

	{
		slug: 'kampania-wideo',
		pdf: '/oferty/SVC_Propozycja_Kampania_Wideo.pdf',
		seoTitle: 'Kampania wideo: klip reklamowy + seria rolek | Opole',
		seoDesc: 'Klip reklamowy 30–45 s i seria 12 rolek, które niosą go przez kolejne tygodnie. Scenariusz i storyboard przed produkcją. Kampania premierowa od 7 400 zł netto.',
		service: 'Produkcja klipu reklamowego i serii rolek',
		eyebrow: 'Propozycja współpracy · Kampania wideo',
		title: ['Produkt, którego', 'nikt nie przewija.'],
		lead: 'Główny klip reklamowy i seria rolek, które niosą go przez kolejne tygodnie — wszędzie tam, gdzie są Twoi klienci.',
		pkg: 'pro',
		intro: {
			title: ['Ludzie nie kupują produktu.', 'Kupują to, kim się z nim stają.'],
			paras: [
				'Pierwsze wrażenie powstaje dziś na ekranie telefonu, między jednym przewinięciem a drugim.',
				'Twój produkt może być najlepszy w swojej kategorii. Ale jeśli na ekranie wygląda jak wszystko inne, klient nie będzie tego sprawdzał.',
				'Ta propozycja jest o tym, żeby te dwie sekundy pracowały na Ciebie: jeden dopracowany klip, który pokazuje, kim jesteś, i seria rolek, która przypomina o tym tak długo, aż klient zapamięta.',
			],
		},
		become: {
			title: ['Marka,', 'którą się poleca.'],
			lead: 'Dobra reklama nie krzyczy „kup”. Sprawia, że klient sam chce o Tobie opowiedzieć.',
			items: [
				{ t: 'Profesjonalny odbiór', d: 'Klient ocenia jakość produktu po tym, jak go pokazujesz. Dopracowany obraz mówi: tu nic nie jest przypadkowe.' },
				{ t: 'Więcej współprac', d: 'Dystrybutorzy, sklepy i partnerzy dostają gotowy materiał. Łatwiej im Cię sprzedawać, więc robią to chętniej.' },
				{ t: 'Nowe kanały', d: 'Ten sam klip trafia na stronę, do reklam płatnych, na targi, ekran w punkcie i do prezentacji handlowej.' },
				{ t: 'Spokojna głowa', d: 'Jedna produkcja daje materiał na miesiące. Nie musisz co tydzień wymyślać, co opublikować.' },
			],
			punch: 'Konkurencja pokazuje zdjęcie produktu. Ty pokażesz, jak zmienia dzień klienta.',
		},
		stats: {
			title: ['Klient chce zobaczyć,', 'zanim kupi.'],
			items: [
				{ v: 85, suf: '%', d: 'ludzi mówi, że film przekonał ich do zakupu produktu lub usługi.', src: wyzowl },
				{ v: 63, suf: '%', d: 'konsumentów woli obejrzeć krótki film o produkcie niż czytać opis czy instrukcję.', src: wyzowl },
				{ v: 83, suf: '%', d: 'marketerów mówi, że wideo bezpośrednio zwiększyło ich sprzedaż.', src: wyzowl },
				{ v: 29, suf: ' mln', d: 'użytkowników YouTube w Polsce. Twoi klienci już tam są.', src: dr },
			],
		},
		inside: {
			eyebrow: 'Jeden klip, wiele miejsc',
			title: ['Jedna historia.', 'Opowiedziana wszędzie.'],
			lead: 'Klip główny buduje wrażenie. Rolki powtarzają je z różnych stron — bo klient rzadko kupuje po pierwszym kontakcie.',
			items: [
				{ n: '01', t: 'Problem', d: 'sytuacja, w której klient rozpoznaje siebie' },
				{ n: '02', t: 'Pokaz', d: 'produkt w działaniu' },
				{ n: '03', t: 'Detal', d: 'zbliżenie, które buduje wartość' },
				{ n: '04', t: 'Pytanie klienta', d: 'odpowiedź na to, o co ludzie pytają' },
				{ n: '05', t: 'Kulisy', d: 'ludzie i miejsce, w którym powstaje' },
				{ n: '06', t: 'Porównanie', d: 'przed i po' },
				{ n: '07', t: 'Zastosowanie', d: 'jeden dzień z produktem' },
				{ n: '08', t: 'Oferta', d: 'jasne wezwanie do działania' },
			],
		},
		special: 'anatomia',
		faq: [
			{ q: 'Czy musimy cokolwiek nagrywać?', a: 'Nie zawsze. Klip może powstać w całości z animacji albo z ruchu na zdjęciach produktu. Jeśli macie nagrania — wykorzystamy je.' },
			{ q: 'Po co rolki, skoro mamy klip?', a: 'Klip to wizytówka, rolki to codzienna obecność. Klient zwykle musi zobaczyć markę kilka razy, zanim kupi.' },
			{ q: 'Gdzie to wszystko publikować?', a: 'Ustalamy to w briefie: strona, social media, reklama płatna, targi, ekran w punkcie. Formaty dobieramy do miejsc.' },
			{ q: 'Jak sprawdzimy, czy działa?', a: 'Rolki to też test. Różne pierwsze sekundy, ten sam produkt — po kilku tygodniach dane pokazują, co sprzedaje najlepiej.' },
			{ q: 'Do kogo należą materiały?', a: 'Gotowe materiały są Twoje po zapłacie. Publikujesz je, gdzie chcesz i jak długo chcesz.' },
			{ q: 'Ile to zajmie mojego czasu?', a: 'Brief, akceptacja scenariusza i akceptacja gotowego materiału. Nie musisz znać się na montażu.' },
		],
		doubts: [
			{ q: '„Mamy już zdjęcia produktu.”', a: 'To dobry punkt wyjścia. Zdjęcie pokazuje, jak produkt wygląda. Wideo pokazuje, co zmienia — a kupuje się to drugie.' },
			{ q: '„Reklama to koszt.”', a: 'Koszt jest wtedy, gdy materiał żyje tydzień. Klip i seria rolek pracują miesiącami: na stronie, w kampaniach, u partnerów.' },
			{ q: '„Nagramy to telefonem.”', a: 'Możecie. Tylko że klient porówna Was z marką, która tego nie zrobiła — i nie powie, dlaczego wybrał ją.' },
			doubtAI,
			{ q: '„Nie wiemy, czy to zadziała.”', a: 'Dlatego rolki wychodzą seriami. Każda to mały test, a dane po kilku tygodniach mówią więcej niż obietnice.' },
		],
		invest: {
			title: ['Raz', 'albo na stałe.'],
			cards: [
				{ tag: 'Opcja 1 · jednorazowo', name: 'Kampania premierowa', price: 'od 7 400', per: 'zł netto', note: 'Dokładna wycena po briefie.', items: ['klip główny 30–45 s (od 3 800 zł)', 'seria 12 rolek ze scenariuszami (3 600 zł)', 'formaty pod ustalone miejsca emisji'], cta: { label: 'Zapytaj o wycenę', href: '/generator' } },
				{ tag: 'Opcja 2 · najczęściej wybierany', name: 'Kampania w PRO', price: '7 200', per: 'zł netto / mies.', note: 'Min. 6 miesięcy · klip główny w 1. miesiącu zamiast 2 z 4 materiałów wideo.', items: PRO_ITEMS, featured: true, cta: { label: 'Skonfiguruj PRO', href: '/generator?pakiet=pro' } },
			],
			footnote: 'Po pół roku masz klip główny, 22 materiały wideo, 48 rolek i 48 grafik w jednym, spójnym stylu.',
		},
		final: { title: ['Daj produktowi', 'scenę.'], lead: 'Pierwszy krok to 30 minut rozmowy o produkcie i kliencie. Wyjdziesz z niej z pomysłem na klip — nawet jeśli nie zdecydujesz się od razu.', cta: 'Skonfiguruj pakiet PRO' },
	},

	{
		slug: 'kanal-youtube',
		pdf: '/oferty/SVC_Propozycja_Kanal.pdf',
		seoTitle: 'Kanał na YouTube pod klucz: oprawa, montaż, algorytm | Opole',
		seoDesc: 'Identyfikacja kanału, montaż odcinków, shorty, miniatury i opieka nad algorytmem. Od rozmowy do premiery w miesiąc. Fundament od 3 500 zł netto, produkcja w pakiecie PRO.',
		service: 'Prowadzenie i produkcja kanału YouTube',
		eyebrow: 'Propozycja współpracy · Kanał na YouTube i w social mediach',
		title: ['Twój kanał.', 'Twoje zasady.'],
		lead: 'Identyfikacja wizualna, montaż na YouTube i social media oraz stała opieka nad kanałami — razem z wiedzą o tym, jak działa algorytm.',
		pkg: 'pro',
		intro: {
			title: ['Wykorzystaj falę', 'i wybij się w internecie.'],
			paras: [
				'Coraz więcej ludzi szuka rozmów, komentarzy i programów w internecie. To dobry moment, żeby mieć własny kanał.',
				'Nie musisz czekać, aż ktoś zaprosi Cię do studia. Własny kanał to miejsce, w którym mówisz pełnym głosem, w swoim tempie, do ludzi, którzy przyszli właśnie do Ciebie.',
				'Ty przynosisz treść i swoją twarz. My zajmujemy się resztą: oprawą, montażem, publikacją i tym, żeby widzowie zostawali do końca.',
			],
		},
		become: {
			title: ['Zostań', 'twórcą.'],
			lead: 'Nie chodzi o to, żeby mieć kanał. Chodzi o to, żeby ludzie na niego wracali — a marki chciały na nim być.',
			items: [
				{ t: 'Profesjonalny odbiór', d: 'Spójna oprawa sprawia, że od pierwszego kadru widać przemyślany projekt, a nie przypadkowe nagranie.' },
				{ t: 'Więcej współprac', d: 'Marki szukają twórców, przy których ich logo dobrze wygląda. Dopracowany kanał to gotowa propozycja dla partnerów.' },
				{ t: 'Własny kanał komunikacji', d: 'Mówisz wtedy, kiedy chcesz, i tyle, ile chcesz. Bez skracania i bez cudzej interpretacji.' },
				{ t: 'Spokojna głowa', d: 'Montaż, miniatury, harmonogram i publikacja przestają być Twoim zmartwieniem. Ty nagrywasz — reszta dzieje się sama.' },
			],
			punch: 'Większość kanałów publikuje surowe nagrania. Twój będzie wyglądał jak program.',
		},
		stats: {
			title: ['Widzowie już tam są.', 'Pytanie, czy oglądają Ciebie.'],
			items: [
				{ v: 29, suf: ' mln', d: 'użytkowników YouTube w Polsce — ponad trzy czwarte mieszkańców kraju.', src: dr },
				{ v: 84.2, suf: '%', d: 'polskich internautów w zasięgu reklam na YouTube.', src: dr },
				{ v: 53, suf: ' dni', d: 'tyle zajęło Kanałowi Zero zdobycie miliona subskrypcji. Polacy chcą oglądać programy w sieci.', src: 'android.com.pl, 24.03.2024' },
				{ v: 3, suf: ' mld', d: 'wyszukiwań miesięcznie. Dobry odcinek znajduje widzów jeszcze długo po premierze.', src: 'Radio Kielce (dane globalne)' },
			],
		},
		inside: {
			eyebrow: 'Co robimy',
			title: ['Trzy etapy.', 'Jeden kanał.'],
			lead: 'Najpierw tożsamość, potem rytm, na końcu wzrost. W tej kolejności — bo bez fundamentu każdy odcinek zaczyna się od zera.',
			items: [
				{ n: '01', t: 'Fundament: identyfikacja kanału', d: 'Animowany ident i czołówka · intro, outro i przejścia · belki z nazwiskami i plansze · szablon miniatur · awatary i banery na platformy.' },
				{ n: '02', t: 'Co miesiąc: produkcja', d: '4 odcinki — montaż, napisy, dźwięk, kolor · 8 krótkich form z odcinków · 8 grafik i miniatur · 3 nowe elementy animowane · rozwijany system graficzny.' },
				{ n: '03', t: 'Na bieżąco: opieka i algorytm', d: 'Harmonogram publikacji · tytuły, opisy, rozdziały · testy miniatur w YouTube Studio · analiza utrzymania widzów · raport miesięczny z wnioskami.' },
			],
		},
		special: 'algorytm',
		faq: [
			{ q: 'Co, jeśli skończą mi się tematy?', a: 'Kanał opieramy na stałych cyklach: rubryka, gość, komentarz tygodnia. Projektujemy je na starcie, więc zawsze wiesz, co nagrywasz.' },
			{ q: 'Czy muszę być wszędzie?', a: 'Nie. Wybieramy dwie, trzy platformy, na których są Twoi widzowie. Z jednego nagrania powstaje komplet na każdą z nich.' },
			{ q: 'A jeśli nagram słabszy odcinek?', a: 'Od tego jest montaż. Tempo, cięcia, grafika i napisy sprawiają, że słabszy dzień wygląda dobrze.' },
			{ q: 'Do kogo należą materiały?', a: 'Gotowe materiały są Twoje po zapłacie. System oprawy działa na licencji czasowej i po 12 miesiącach przechodzi na Ciebie w całości.' },
			{ q: 'Ile to zajmie mojego czasu?', a: 'Nagranie i jedna akceptacja w tygodniu. Nie uczysz się montażu ani statystyk YouTube Studio.' },
			{ q: 'Czy kanał może na siebie zarobić?', a: 'Zasięg otwiera drzwi do współprac z markami. Ty dajesz treść, my dbamy o to, żeby wyglądała na wartą ich budżetu.' },
		],
		doubts: [
			{ q: '„To dużo pieniędzy.”', a: 'Policz, ile kosztuje Cię dziś godzina nad montażem zamiast nad tym, na czym zarabiasz. Montażysta, grafik, animator, sprzęt, licencje — tu masz to w jednej fakturze.' },
			{ q: '„Mam znajomego, który montuje.”', a: 'Świetnie, jeśli przez pół roku co tydzień znajdzie czas, zna algorytm i nie zniknie przed premierą. Kanał to nie jeden film, tylko system.' },
			{ q: '„AI zrobi to taniej.”', a: 'Może szybciej. Ale widzowie i marki coraz lepiej wyczuwają generowane treści. U nas każdą klatkę układa człowiek — i to jest Twoja przewaga.' },
			{ q: '„Pół roku umowy to długo.”', a: 'Kanał buduje się konsekwentnie. Sześć miesięcy to minimum, żeby widzowie i algorytm zdążyli Cię poznać, a Ty zobaczył realne dane.' },
			{ q: '„A jeśli się nie przyjmie?”', a: 'Co miesiąc dostajesz raport: co działa, co nie i co zmieniamy. Nie czekamy pół roku z korektą.' },
		],
		invest: {
			title: ['Jeden fundament.', 'Stały rytm.'],
			cards: [
				{ tag: 'Etap 1 · jednorazowo', name: 'Fundament — identyfikacja kanału', price: 'od 3 500', per: 'zł netto', note: 'Dokładna wycena po briefie.', items: ['ident, czołówka, intro i outro', 'belki, plansze, przejścia', 'szablon miniatur i banery'], cta: { label: 'Zapytaj o wycenę', href: '/generator' } },
				{ tag: 'Etap 2 · najczęściej wybierany', name: 'Produkcja i opieka nad kanałami', price: '7 200', per: 'zł netto / mies.', note: 'Minimum 6 miesięcy · zakres opieki doprecyzowujemy w umowie.', items: PRO_ITEMS, featured: true, cta: { label: 'Skonfiguruj PRO', href: '/generator?pakiet=pro' } },
			],
		},
		final: { title: ['Zacznijmy tworzyć', 'Twoją społeczność.'], lead: 'Pierwszy krok to 30 minut rozmowy. Ustalimy format, rytm i wygląd Twojego kanału. Bez zobowiązań — z konkretnym planem na koniec.', cta: 'Skonfiguruj pakiet PRO' },
	},
];
