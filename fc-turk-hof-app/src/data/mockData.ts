import {
  ClubEvent,
  Channel,
  ChatMessage,
  FormTemplate,
  FunktionaerBereich,
  MatchResult,
  NewsItem,
  Player,
  Survey,
  TableRow,
  TeamId,
  TeamInfo,
} from '../types';

export const BEREICH_LABELS: Record<FunktionaerBereich, string> = {
  trainer: 'Trainer',
  jugendleiter: 'Jugendleiter',
  vorstand1: '1. Vorstand',
  vorstand2: '2. Vorstand',
  kassier: 'Kassier',
  presse: 'Presse / Öffentlichkeitsarbeit',
  schriftfuehrer: 'Schriftführer',
  sonstiges: 'Sonstiges Vorstandsmitglied',
};

export const bereichLabel = (bereich?: FunktionaerBereich): string =>
  bereich ? BEREICH_LABELS[bereich] : '';

export const TEAMS: TeamInfo[] = [
  { id: 'herren1', name: 'Herrenmannschaft', category: 'senior' },
  { id: 'u11', name: 'U11 Jugend', category: 'jugend' },
  { id: 'u9', name: 'U9 Jugend', category: 'jugend' },
  { id: 'bambini', name: 'Bambini', category: 'jugend' },
];

export const teamName = (id?: string): string =>
  TEAMS.find((t) => t.id === id)?.name ?? 'Unbekanntes Team';

export const YOUTH_TEAMS = TEAMS.filter((t) => t.category === 'jugend');
export const SENIOR_TEAMS = TEAMS.filter((t) => t.category === 'senior');
export const ALL_TEAM_IDS: TeamId[] = TEAMS.map((t) => t.id);

export const EVENTS: ClubEvent[] = [
  {
    id: 'e1',
    title: 'Training Herrenmannschaft',
    date: '2026-07-29',
    time: '18:30',
    endTime: '20:00',
    location: 'Sportgelände FC Türk Hof, Platz 1',
    type: 'training',
    teamId: 'herren1',
    description: 'Reguläres Abschlusstraining vor dem Pokalspiel.',
  },
  {
    id: 'e2',
    title: 'Vorstandssitzung',
    date: '2026-07-30',
    time: '19:00',
    endTime: '21:00',
    location: 'Vereinsheim, Besprechungsraum',
    type: 'sonstiges',
    teamId: 'herren1',
    description: 'Planung Saisonstart und Sponsoring-Update.',
  },
  {
    id: 'e3',
    title: 'Kreispokal: FC Türk Hof – SV Oberkotzau',
    date: '2026-08-02',
    time: '15:00',
    endTime: '17:00',
    location: 'Sportgelände FC Türk Hof, Platz 1',
    type: 'spiel',
    teamId: 'herren1',
    description: '1. Runde Kreispokal. Einlass ab 14:00 Uhr.',
  },
  {
    id: 'e4',
    title: 'Training U11',
    date: '2026-07-31',
    time: '17:30',
    endTime: '19:00',
    location: 'Sportgelände FC Türk Hof, Platz 2',
    type: 'training',
    teamId: 'u11',
  },
  {
    id: 'e5',
    title: 'Freundschaftsspiel U9',
    date: '2026-08-01',
    time: '11:00',
    endTime: '12:00',
    location: 'Sportgelände TSV Hof',
    type: 'spiel',
    teamId: 'u9',
    description: 'Testspiel gegen TSV Hof zur Saisonvorbereitung.',
  },
  {
    id: 'e6',
    title: 'Trikot-Ausgabe Bambini',
    date: '2026-08-03',
    time: '16:00',
    endTime: '17:00',
    location: 'Vereinsheim',
    type: 'sonstiges',
    teamId: 'bambini',
  },
  {
    id: 'e7',
    title: 'Training Bambini',
    date: '2026-07-30',
    time: '17:00',
    endTime: '18:00',
    location: 'Sportgelände FC Türk Hof, Platz 2',
    type: 'training',
    teamId: 'bambini',
  },
  {
    id: 'e8',
    title: 'Sommerfest FC Türk Hof',
    date: '2026-08-09',
    time: '14:00',
    endTime: '22:00',
    location: 'Vereinsgelände',
    type: 'sonstiges',
    teamId: 'herren1',
    description: 'Vereinsfest für alle Mitglieder, Familien und Fans.',
  },
  {
    id: 'e9',
    title: 'Spieltag U11',
    date: '2026-08-08',
    time: '10:00',
    endTime: '13:00',
    location: 'Sportgelände FC Türk Hof, Platz 2',
    type: 'spiel',
    teamId: 'u11',
    description: 'Rundenturnier mit drei weiteren Vereinen.',
  },
];

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Saisonvorbereitung läuft auf Hochtouren',
    date: '2026-07-27',
    tag: 'Verein',
    summary: 'Die Herrenmannschaft startet mit intensiven Einheiten in die neue Saison.',
    content:
      'Unsere Herrenmannschaft ist seit dieser Woche wieder im Training. Trainer Cem Yildiz setzt in den ersten Wochen vor allem auf Kondition und Teambuilding. Am 2. August steht bereits das erste Pflichtspiel im Kreispokal gegen den SV Oberkotzau an. Wir freuen uns auf zahlreiche Zuschauer!',
  },
  {
    id: 'n2',
    title: 'Neue Trikots für alle Jugendmannschaften',
    date: '2026-07-24',
    tag: 'Jugend',
    summary: 'Dank unseres Sponsors erhalten alle Jugendteams neue Trikotsätze.',
    content:
      'Wir bedanken uns herzlich bei unserem langjährigen Sponsor Hofer Getränkemarkt für die Ausstattung aller Jugendmannschaften mit neuen Trikots. Die Ausgabe für die Bambini erfolgt am 3. August im Vereinsheim, weitere Termine folgen.',
  },
  {
    id: 'n3',
    title: 'Einladung zum Sommerfest am 9. August',
    date: '2026-07-20',
    tag: 'Veranstaltung',
    summary: 'Traditionelles Sommerfest mit Live-Musik, Grill und Kinderprogramm.',
    content:
      'Am 9. August laden wir alle Mitglieder, Spieler, Fans und Familien herzlich zu unserem Sommerfest auf dem Vereinsgelände ein. Ab 14 Uhr erwartet euch ein buntes Programm mit Grillstand, Getränken, Live-Musik und einem Kinderprogramm. Der Eintritt ist frei.',
  },
  {
    id: 'n4',
    title: 'Neuer Sponsor an Bord',
    date: '2026-07-15',
    tag: 'Verein',
    summary: 'Autohaus Demir wird neuer Trikotsponsor der Herrenmannschaft.',
    content:
      'Wir freuen uns, das Autohaus Demir als neuen Hauptsponsor der Herrenmannschaft begrüßen zu dürfen. Die Zusammenarbeit ist zunächst auf drei Jahre angelegt und stärkt die finanzielle Basis des Vereins nachhaltig.',
  },
];

export const RESULTS: MatchResult[] = [
  {
    id: 'r1',
    date: '2026-07-19',
    competition: 'Testspiel',
    teamId: 'herren1',
    homeTeam: 'FC Türk Hof',
    awayTeam: 'SpVgg Rehau',
    homeScore: 3,
    awayScore: 1,
    isHome: true,
  },
  {
    id: 'r2',
    date: '2026-07-12',
    competition: 'Testspiel',
    teamId: 'herren1',
    homeTeam: 'TSV Münchberg',
    awayTeam: 'FC Türk Hof',
    homeScore: 2,
    awayScore: 2,
    isHome: false,
  },
  {
    id: 'r3',
    date: '2026-05-24',
    competition: 'Kreisliga, 30. Spieltag',
    teamId: 'herren1',
    homeTeam: 'FC Türk Hof',
    awayTeam: 'SV Konradsreuth',
    homeScore: 4,
    awayScore: 0,
    isHome: true,
  },
  {
    id: 'r4',
    date: '2026-05-17',
    competition: 'Kreisliga, 29. Spieltag',
    teamId: 'herren1',
    homeTeam: 'FC Schwarzenbach',
    awayTeam: 'FC Türk Hof',
    homeScore: 1,
    awayScore: 1,
    isHome: false,
  },
  {
    id: 'r5',
    date: '2026-07-18',
    competition: 'Freundschaftsspiel',
    teamId: 'u11',
    homeTeam: 'FC Türk Hof U11',
    awayTeam: 'SC Selb U11',
    homeScore: 4,
    awayScore: 2,
    isHome: true,
  },
  {
    id: 'r6',
    date: '2026-07-11',
    competition: 'Rundenturnier',
    teamId: 'u9',
    homeTeam: 'DJK Naila',
    awayTeam: 'FC Türk Hof U9',
    homeScore: 1,
    awayScore: 3,
    isHome: false,
  },
  {
    id: 'r7',
    date: '2026-07-05',
    competition: 'Spieltreff',
    teamId: 'bambini',
    homeTeam: 'FC Türk Hof Bambini',
    awayTeam: 'TSV Hof Bambini',
    homeScore: 0,
    awayScore: 0,
    isHome: true,
  },
];

export const TABLES: Record<TeamId, TableRow[]> = {
  herren1: [
    { position: 1, club: 'SV Konradsreuth', played: 30, won: 22, drawn: 5, lost: 3, goalsFor: 78, goalsAgainst: 28, points: 71 },
    { position: 2, club: 'FC Türk Hof', played: 30, won: 20, drawn: 6, lost: 4, goalsFor: 71, goalsAgainst: 33, points: 66, isOwnTeam: true },
    { position: 3, club: 'FC Schwarzenbach', played: 30, won: 18, drawn: 7, lost: 5, goalsFor: 65, goalsAgainst: 37, points: 61 },
    { position: 4, club: 'TSV Münchberg', played: 30, won: 16, drawn: 8, lost: 6, goalsFor: 58, goalsAgainst: 40, points: 56 },
    { position: 5, club: 'SpVgg Rehau', played: 30, won: 14, drawn: 6, lost: 10, goalsFor: 52, goalsAgainst: 44, points: 48 },
    { position: 6, club: 'DJK Naila', played: 30, won: 11, drawn: 9, lost: 10, goalsFor: 46, goalsAgainst: 47, points: 42 },
    { position: 7, club: 'SC Selb', played: 30, won: 10, drawn: 7, lost: 13, goalsFor: 41, goalsAgainst: 50, points: 37 },
    { position: 8, club: 'TSV Hof', played: 30, won: 8, drawn: 8, lost: 14, goalsFor: 38, goalsAgainst: 55, points: 32 },
    { position: 9, club: 'SV Oberkotzau', played: 30, won: 6, drawn: 5, lost: 19, goalsFor: 30, goalsAgainst: 68, points: 23 },
    { position: 10, club: 'FC Helmbrechts', played: 30, won: 3, drawn: 4, lost: 23, goalsFor: 24, goalsAgainst: 81, points: 13 },
  ],
  u11: [
    { position: 1, club: 'SC Selb U11', played: 10, won: 8, drawn: 1, lost: 1, goalsFor: 40, goalsAgainst: 12, points: 25 },
    { position: 2, club: 'FC Türk Hof U11', played: 10, won: 7, drawn: 2, lost: 1, goalsFor: 35, goalsAgainst: 15, points: 23, isOwnTeam: true },
    { position: 3, club: 'TSV Münchberg U11', played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 28, goalsAgainst: 20, points: 17 },
    { position: 4, club: 'DJK Naila U11', played: 10, won: 3, drawn: 3, lost: 4, goalsFor: 20, goalsAgainst: 22, points: 12 },
    { position: 5, club: 'TSV Hof U11', played: 10, won: 2, drawn: 2, lost: 6, goalsFor: 15, goalsAgainst: 30, points: 8 },
    { position: 6, club: 'SV Oberkotzau U11', played: 10, won: 1, drawn: 2, lost: 7, goalsFor: 10, goalsAgainst: 33, points: 5 },
  ],
  u9: [
    { position: 1, club: 'FC Türk Hof U9', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 30, goalsAgainst: 10, points: 19, isOwnTeam: true },
    { position: 2, club: 'DJK Naila U9', played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 26, goalsAgainst: 13, points: 17 },
    { position: 3, club: 'TSV Hof U9', played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 20, goalsAgainst: 18, points: 13 },
    { position: 4, club: 'SC Selb U9', played: 8, won: 2, drawn: 2, lost: 4, goalsFor: 14, goalsAgainst: 22, points: 8 },
    { position: 5, club: 'TSV Münchberg U9', played: 8, won: 0, drawn: 2, lost: 6, goalsFor: 8, goalsAgainst: 25, points: 2 },
  ],
  bambini: [
    { position: 1, club: 'FC Türk Hof Bambini', played: 6, won: 3, drawn: 2, lost: 1, goalsFor: 18, goalsAgainst: 10, points: 11, isOwnTeam: true },
    { position: 2, club: 'TSV Hof Bambini', played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 16, goalsAgainst: 12, points: 10 },
    { position: 3, club: 'SC Selb Bambini', played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 12, goalsAgainst: 12, points: 8 },
    { position: 4, club: 'DJK Naila Bambini', played: 6, won: 1, drawn: 1, lost: 4, goalsFor: 8, goalsAgainst: 20, points: 4 },
  ],
};

export const PLAYERS: Player[] = [
  { id: 'p1', name: 'Emre Kaya', number: 1, position: 'Torwart', teamId: 'herren1', birthYear: 1998, initials: 'EK', stats: { games: 28, goals: 0, assists: 0 } },
  { id: 'p2', name: 'Cem Yildiz', number: 4, position: 'Innenverteidiger', teamId: 'herren1', birthYear: 1995, initials: 'CY', stats: { games: 29, goals: 2, assists: 1 } },
  { id: 'p3', name: 'Deniz Aydin', number: 6, position: 'Defensives Mittelfeld', teamId: 'herren1', birthYear: 1997, initials: 'DA', stats: { games: 27, goals: 3, assists: 6 } },
  { id: 'p4', name: 'Mert Sahin', number: 9, position: 'Stürmer', teamId: 'herren1', birthYear: 1999, initials: 'MS', stats: { games: 28, goals: 19, assists: 5 } },
  { id: 'p5', name: 'Baris Demir', number: 10, position: 'Offensives Mittelfeld', teamId: 'herren1', birthYear: 1996, initials: 'BD', stats: { games: 30, goals: 12, assists: 11 } },
  { id: 'p6', name: 'Kaan Öztürk', number: 3, position: 'Linksverteidiger', teamId: 'herren1', birthYear: 2001, initials: 'KÖ', stats: { games: 26, goals: 1, assists: 4 } },
  { id: 'p7', name: 'Yusuf Celik', number: 7, position: 'Rechtsaußen', teamId: 'herren1', birthYear: 2000, initials: 'YC', stats: { games: 25, goals: 8, assists: 7 } },
  { id: 'p8', name: 'Ali Yavuz', number: 9, position: 'Stürmer', teamId: 'u11', birthYear: 2015, initials: 'AY', stats: { games: 10, goals: 12, assists: 3 } },
  { id: 'p9', name: 'Efe Arslan', number: 7, position: 'Mittelfeld', teamId: 'u11', birthYear: 2015, initials: 'EA', stats: { games: 10, goals: 5, assists: 8 } },
  { id: 'p10', name: 'Kerem Toprak', number: 5, position: 'Abwehr', teamId: 'u11', birthYear: 2016, initials: 'KT', stats: { games: 9, goals: 1, assists: 2 } },
  { id: 'p11', name: 'Mika Schneider', number: 1, position: 'Torwart', teamId: 'u9', birthYear: 2017, initials: 'MS', stats: { games: 8, goals: 0, assists: 0 } },
  { id: 'p12', name: 'Leon Weber', number: 9, position: 'Stürmer', teamId: 'u9', birthYear: 2017, initials: 'LW', stats: { games: 8, goals: 9, assists: 4 } },
  { id: 'p13', name: 'Ada Kurt', number: 8, position: 'Mittelfeld', teamId: 'u9', birthYear: 2018, initials: 'AK', stats: { games: 7, goals: 3, assists: 5 } },
  { id: 'p14', name: 'Finn Bauer', number: 4, position: 'Allrounder', teamId: 'bambini', birthYear: 2019, initials: 'FB', stats: { games: 6, goals: 4, assists: 2 } },
  { id: 'p15', name: 'Elif Şahin', number: 6, position: 'Allrounder', teamId: 'bambini', birthYear: 2020, initials: 'EŞ', stats: { games: 6, goals: 3, assists: 3 } },
];

export const FORMS: FormTemplate[] = [
  {
    id: 'f1',
    title: 'Trainingsabmeldung',
    description: 'Melde dich für ein Training oder Spiel ab, damit die Trainer planen können.',
    targetRoles: ['spieler'],
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'termin', label: 'Betroffener Termin', type: 'text', required: true },
      { id: 'grund', label: 'Grund', type: 'select', options: ['Krankheit', 'Verletzung', 'Beruflich', 'Urlaub', 'Sonstiges'], required: true },
      { id: 'anmerkung', label: 'Anmerkung', type: 'textarea' },
    ],
  },
  {
    id: 'f2',
    title: 'Mitgliedsantrag',
    description: 'Werde Mitglied im FC Türk Hof. Wir melden uns nach Eingang bei dir.',
    targetRoles: ['fan', 'spieler', 'funktionaer'],
    fields: [
      { id: 'name', label: 'Vor- und Nachname', type: 'text', required: true },
      { id: 'geburtsdatum', label: 'Geburtsdatum', type: 'date', required: true },
      { id: 'abteilung', label: 'Gewünschte Abteilung', type: 'select', options: ['Herrenmannschaft', 'Jugend', 'Fördermitglied', 'Passiv'], required: true },
      { id: 'nachricht', label: 'Nachricht an den Vorstand', type: 'textarea' },
    ],
  },
  {
    id: 'f3',
    title: 'Helfer beim Sommerfest',
    description: 'Trage dich als Helfer für unser Sommerfest am 9. August ein.',
    targetRoles: ['fan', 'spieler', 'funktionaer'],
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'schicht', label: 'Wunschschicht', type: 'select', options: ['Aufbau (10-14 Uhr)', 'Grillstand (14-18 Uhr)', 'Theke (18-22 Uhr)', 'Abbau (22-23 Uhr)'], required: true },
      { id: 'telefon', label: 'Telefonnummer', type: 'text' },
      { id: 'zusage', label: 'Ich bin verbindlich dabei', type: 'checkbox', required: true },
    ],
  },
  {
    id: 'f4',
    title: 'Schiedsrichter-Ansetzung bestätigen',
    description: 'Bestätige oder storniere deine Ansetzung als Schiedsrichter/Helfer.',
    targetRoles: ['funktionaer'],
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'spiel', label: 'Spiel', type: 'text', required: true },
      { id: 'status', label: 'Status', type: 'select', options: ['Bestätigt', 'Storniert'], required: true },
      { id: 'anmerkung', label: 'Anmerkung', type: 'textarea' },
    ],
  },
];

export const SURVEYS: Survey[] = [
  {
    id: 's1',
    title: 'Fahrgemeinschaften Auswärtsspiele',
    description: 'Damit die Fahrten zu Auswärtsspielen organisiert werden können, bitten wir alle Eltern um eine Rückmeldung zur Mitfahrbereitschaft.',
    audience: 'eltern_jugend',
    deadline: '2026-08-05',
    options: [
      { id: 'o1', label: 'Ich kann regelmäßig fahren', votes: 6 },
      { id: 'o2', label: 'Ich kann gelegentlich fahren', votes: 9 },
      { id: 'o3', label: 'Ich kann derzeit nicht fahren', votes: 3 },
    ],
  },
  {
    id: 's2',
    title: 'Zeitpunkt Herbstferien-Trainingslager (Jugend)',
    description: 'Wann sollen die Jugendabteilungen das Trainingslager in den Herbstferien durchführen?',
    audience: 'eltern_jugend',
    deadline: '2026-08-15',
    options: [
      { id: 'o1', label: '1. Ferienwoche', votes: 11 },
      { id: 'o2', label: '2. Ferienwoche', votes: 8 },
    ],
  },
  {
    id: 's3',
    title: 'Wunschtermin Teamabend Herrenmannschaft',
    description: 'An welchem Abend soll der gemeinsame Teamabend vor dem Saisonstart stattfinden?',
    audience: 'spieler_mannschaft',
    deadline: '2026-08-01',
    options: [
      { id: 'o1', label: 'Montag', votes: 4 },
      { id: 'o2', label: 'Mittwoch', votes: 10 },
      { id: 'o3', label: 'Freitag', votes: 7 },
    ],
  },
  {
    id: 's4',
    title: 'Neue Trainingszeiten ab September',
    description: 'Stimmt für euren bevorzugten Trainingsbeginn ab der neuen Saison ab.',
    audience: 'spieler_mannschaft',
    deadline: '2026-08-20',
    options: [
      { id: 'o1', label: '18:00 Uhr', votes: 9 },
      { id: 'o2', label: '18:30 Uhr', votes: 13 },
      { id: 'o3', label: '19:00 Uhr', votes: 5 },
    ],
  },
];

export const CHANNELS: Channel[] = [
  {
    id: 'c1',
    name: 'Herrenmannschaft',
    category: 'mannschaft',
    teamId: 'herren1',
    description: 'Interner Austausch der Herrenmannschaft.',
  },
  {
    id: 'c2',
    name: 'U11 Jugend',
    category: 'jugend',
    teamId: 'u11',
    description: 'Team- und Elternkommunikation U11.',
  },
  {
    id: 'c3',
    name: 'U9 Jugend',
    category: 'jugend',
    teamId: 'u9',
    description: 'Team- und Elternkommunikation U9.',
  },
  {
    id: 'c4',
    name: 'Bambini',
    category: 'jugend',
    teamId: 'bambini',
    description: 'Team- und Elternkommunikation Bambini.',
  },
  {
    id: 'c5',
    name: 'Vorstand & Funktionäre',
    category: 'funktionaere',
    description: 'Interner Austausch für Vorstand, Trainer und Betreuer.',
  },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    channelId: 'c1',
    author: 'Cem Yildiz (Trainer)',
    role: 'funktionaer',
    text: 'Denkt bitte alle an das Training heute um 18:30 Uhr, danach kurze Besprechung zum Pokalspiel.',
    timestamp: '2026-07-29T08:10:00',
  },
  {
    id: 'm2',
    channelId: 'c1',
    author: 'Mert Sahin',
    role: 'spieler',
    text: 'Bin dabei, bringe die neuen Bälle mit.',
    timestamp: '2026-07-29T08:32:00',
  },
  {
    id: 'm3',
    channelId: 'c2',
    author: 'Trainerteam U11',
    role: 'funktionaer',
    text: 'Spieltag am Samstag wurde bestätigt. Treffpunkt 9:45 Uhr am Vereinsheim.',
    timestamp: '2026-07-28T17:00:00',
  },
  {
    id: 'm4',
    channelId: 'c3',
    author: 'Jugendleitung',
    role: 'funktionaer',
    text: 'Bitte die Umfrage zu den Fahrgemeinschaften bis Mittwoch ausfüllen. Danke euch!',
    timestamp: '2026-07-27T12:00:00',
  },
  {
    id: 'm5',
    channelId: 'c5',
    author: '1. Vorstand',
    role: 'funktionaer',
    text: 'Nächste Vorstandssitzung morgen 19 Uhr im Vereinsheim, Tagesordnung folgt per Mail.',
    timestamp: '2026-07-29T09:00:00',
  },
];
