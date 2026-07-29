# FC Türk Hof – Vereins-App

Eine React-Native-App (Expo, TypeScript) für den FC Türk Hof mit Rollen-Login, Terminkalender,
News, Ergebnissen/Tabellen, Spielerprofilen, ausfüllbaren Formularen, getrennten Umfragen sowie
nach Mannschaft/Jugend/Funktionären getrennter Team-Kommunikation.

## Features

- **Rollen-Login** (kein Passwort, Demo-Modus): Spieler, Fan, Funktionär. Je nach Rolle werden
  zusätzliche Angaben abgefragt (Spieler → Mannschaft, Fan → optional Elternteil eines
  Jugendspielers, Funktionär → Zuständigkeitsbereich). Die Anmeldung wird lokal per
  `AsyncStorage` gespeichert.
- **Terminkalender**: Monatsansicht mit Markierungen für Trainings/Spiele/Sonstiges, Filter
  "Meine Mannschaft" vs. "Alle Termine", Termin-Detailansicht.
- **News/Ankündigungen**: Liste + Detailansicht.
- **Ergebnisse/Tabellen**: Ergebnisse mit Team-Filter, separate Tabellenansicht (Kreisliga).
- **Spielerprofile**: Kaderliste je Team, Profil mit Statistiken (Spiele/Tore/Vorlagen).
- **Ausfüllbare Formulare**: Dynamisch gerenderte Formulare (Text, Textarea, Auswahl, Checkbox,
  Datum) je nach Zielrolle, inkl. lokaler Speicherung der Einreichungen.
- **Umfragen, getrennt nach Zielgruppe**: Umfragen für *Eltern der Jugendspieler* und für
  *Spieler der 1. Mannschaft* sind strikt getrennt – jede Zielgruppe sieht und beantwortet nur
  ihre eigenen Umfragen; Funktionäre sehen beide Bereiche.
- **Team-Kommunikation**: Kanäle getrennt nach *Mannschaft* (Senioren), *Jugendmannschaften*
  (je Team) und *Funktionäre*. Zugriff ist rollen- und teamabhängig (Spieler sehen ihren
  eigenen Kanal, Eltern den Kanal des Jugendteams ihres Kindes, Funktionäre alle Kanäle).

## Tech-Stack

- [Expo](https://expo.dev) SDK 57 (React Native 0.86, React 19)
- TypeScript (strict mode)
- [React Navigation](https://reactnavigation.org) (Bottom Tabs + Native Stack)
- `@react-native-async-storage/async-storage` für lokale Persistenz (Login, Formular­einreichungen,
  Umfrage-Stimmen, Chat-Nachrichten)

Alle Inhalte (Termine, News, Ergebnisse, Tabelle, Spieler, Formulare, Umfragen, Kanäle) liegen
aktuell als Mock-Daten in `src/data/mockData.ts` und lassen sich später leicht durch eine
Backend-Anbindung (REST/GraphQL) ersetzen, da UI und Datenmodell (`src/types`) bereits sauber
getrennt sind.

## Projektstruktur

```
src/
  components/     Wiederverwendbare UI-Bausteine (Card, Chip, PrimaryButton, ...)
  context/        AuthContext (Login/Rollen) und DataContext (Formulare, Umfragen, Chat)
  data/           Mock-Daten für den FC Türk Hof
  navigation/     Root-, Tab- und Stack-Navigation inkl. Typen
  screens/        Alle App-Screens
  theme/          Farben
  types/          Zentrale TypeScript-Typen
  utils/          Datumshilfsfunktionen (Kalender-Grid, Formatierung)
```

## Setup & Start

```bash
cd fc-turk-hof-app
npm install
npx expo start
```

Danach in der Expo-CLI `i` (iOS-Simulator), `a` (Android-Emulator) oder `w` (Web) drücken, oder
den QR-Code mit der Expo-Go-App scannen.

## Rollen zum Ausprobieren

Beim Login gibt es keine echten Zugangsdaten – wähle einfach Namen und Rolle:

- **Spieler** → Team wählen (z. B. "1. Mannschaft (Herren)" für Umfragen/Kommunikation der
  1. Mannschaft, oder ein Jugendteam).
- **Fan** → Häkchen "Ich bin Elternteil eines Jugendspielers" setzen und Jugendteam wählen, um
  Zugriff auf Eltern-Umfragen und den Jugend-Kanal zu erhalten.
- **Funktionär** → Zuständigkeitsbereich wählen; Funktionäre sehen alle Kommunikationskanäle
  und beide Umfragen-Bereiche.

## Nächste Schritte (für eine Produktivversion)

- Mock-Daten durch echtes Backend/CMS ersetzen (z. B. Supabase, Firebase oder eigenes API).
- Echte Authentifizierung (Passwort/SSO) statt Demo-Login.
- Push-Benachrichtigungen für News, Termine und neue Chat-Nachrichten.
- Bildupload für Spielerprofile und News-Beiträge.
