# FC Türk Hof – Vereins-App

Eine React-Native-App (Expo, TypeScript) für den FC Türk Hof mit Rollen-Login, Terminkalender,
News, Ergebnissen/Tabellen, Spielerprofilen, ausfüllbaren Formularen, streng getrennten Umfragen
sowie fein nach Team/Bereich getrennter Kommunikation.

## Teams

Herrenmannschaft, U11, U9, Bambini.

## Rollen & Zugriffsrechte

Beim Login (Demo, kein Passwort) gibt man persönliche Daten (Name, E-Mail, Telefon, Geburtsdatum,
Adresse) an und wählt **eine oder mehrere Rollen gleichzeitig** (z. B. Spieler *und* Trainer).
Die Zugriffsrechte ergeben sich aus der Vereinigung aller gewählten Rollen.

- **Spieler** – wählt sein Team. Sieht ausschließlich den Chat-Kanal des eigenen Teams.
- **Fan** – optional als *Elternteil eines Jugendspielers* mit Name des Kindes + Jugendteam.
  Eltern sehen **nur** Ergebnisse/Tabelle sowie den Chat-Kanal des Teams ihres Kindes.
- **Funktionär** – wählt einen Zuständigkeitsbereich:
  - **Trainer** – wählt die trainierte(n) Mannschaft(en) und erhält Schreibzugriff auf genau
    deren Chat-Kanäle (+ interner Funktionäre-Kanal).
  - **Jugendleiter** – sieht/schreibt in alle Jugend-Kanäle (+ Funktionäre-Kanal).
  - **1./2. Vorstand, Kassier, Presse/Öffentlichkeitsarbeit, Schriftführer, Sonstige** –
    sehen alle Tabellen/Ergebnisse, aber **keine** Mannschafts-Chats, nur den internen
    Funktionäre-Kanal.
- **News und Kalender** sind für alle Rollen uneingeschränkt sichtbar. Funktionäre können im
  Kalender neue Termine anlegen und bestehende löschen (Button „+“ bzw. „Termin löschen“).

Die komplette Zugriffslogik für Chat-Kanäle und Ergebnis-Sichtbarkeit ist zentral in
`src/utils/permissions.ts` gebündelt.

## Features

- **Rollen-Login mit Mehrfachauswahl** und erweiterten Pflichtangaben (Name, E-Mail, Telefon,
  Geburtsdatum, Adresse), lokale Persistenz per `AsyncStorage`.
- **Bearbeitbares Profil**: Persönliche Daten können jederzeit in der App geändert werden.
- **Terminkalender**: Monatsansicht, Filter „Meine Mannschaft“/„Alle Termine“, Termine anlegen
  und löschen (nur Funktionäre), Detailansicht.
- **News/Ankündigungen**: Liste + Detailansicht, für alle sichtbar.
- **Ergebnisse/Tabellen**: pro Team, für Eltern automatisch auf das Team ihres Kindes begrenzt.
- **Spielerprofile**: Kaderliste je Team mit Statistiken.
- **Ausfüllbare Formulare**: dynamisch je nach Zielrolle, inkl. lokaler Speicherung.
- **Umfragen, getrennt nach Zielgruppe**: *Eltern der Jugendspieler* und *Spieler der
  Herrenmannschaft* sehen und beantworten ausschließlich ihre eigenen Umfragen.
- **Team-Kommunikation**: Kanäle je Team + interner Funktionäre-Kanal, Zugriff exakt wie oben
  beschrieben geregelt.
- **Vereinsinfo**: Kontakt, Adresse, Vorstandsübersicht.
- **Sponsoren**: Hauptsponsoren, Ausrüster und Partner in Kategorien.
- **Einstellungen**: Benachrichtigungen ein/aus, Profil-Zugriff, Abmelden, App-Info.
- **Lokale Benachrichtigungen**: Berechtigungsabfrage beim Login, Test-Button in den
  Einstellungen, sowie automatische Benachrichtigung beim Anlegen eines neuen Termins.
  **Wichtig:** Das sind reine On-Device-Benachrichtigungen. Echte Push-Nachrichten zwischen
  verschiedenen Handys (z. B. „neue Chat-Nachricht von einem Mitspieler“) erfordern zusätzlich
  ein Backend, siehe unten.

## ⚠️ Wichtige Einschränkung: kein Backend

Alle Daten (Chat-Nachrichten, Formular-Einreichungen, Umfrage-Stimmen, neu angelegte Termine)
werden ausschließlich **lokal auf dem jeweiligen Gerät** in `AsyncStorage` gespeichert. Zwei
Personen, die die App auf unterschiedlichen Handys installieren, sehen die Nachrichten der
jeweils anderen Person **nicht** – die Team-Kommunikation ist aktuell nur eine funktionale
Oberfläche ohne echten Datenaustausch zwischen Geräten. Für eine produktive Nutzung mit mehreren
Personen wird ein Backend benötigt (z. B. Supabase oder Firebase) für:

- zentrale Speicherung von Nachrichten, Formularen, Umfragen und Terminen
- echte Push-Benachrichtigungen zwischen Geräten (in Expo Go seit SDK 53 ohnehin nicht mehr
  möglich – dafür ist ein eigener Development-/Production-Build nötig)
- echte Authentifizierung statt Demo-Login

## Tech-Stack

- [Expo](https://expo.dev) SDK 54 (React Native 0.81, React 19.1) — bewusst auf SDK 54 statt der
  neuesten Version gepinnt, damit die App in der aktuellen Expo-Go-App aus dem App Store/Play
  Store lauffähig bleibt.
- TypeScript (strict mode)
- [React Navigation](https://reactnavigation.org) (Bottom Tabs + Native Stack)
- `@react-native-async-storage/async-storage` für lokale Persistenz
- `expo-notifications` für lokale Benachrichtigungen

Alle Inhalte (Termine, News, Ergebnisse, Tabellen, Spieler, Formulare, Umfragen, Kanäle) liegen
als Mock-Daten in `src/data/mockData.ts` und lassen sich später durch eine Backend-Anbindung
ersetzen, da UI und Datenmodell (`src/types`) sauber getrennt sind.

## Projektstruktur

```
src/
  components/     Wiederverwendbare UI-Bausteine (Card, Chip, PrimaryButton, ...)
  context/        AuthContext (Login/Rollen) und DataContext (Termine, Formulare, Umfragen, Chat)
  data/           Mock-Daten für den FC Türk Hof
  navigation/     Root-, Tab- und Stack-Navigation inkl. Typen
  screens/        Alle App-Screens
  theme/          Farben (Weinrot/Weiß)
  types/          Zentrale TypeScript-Typen
  utils/          Datumshilfen, Zugriffslogik (permissions.ts), Benachrichtigungen
```

## Setup & Start

```bash
cd fc-turk-hof-app
npm install
npx expo start
```

Danach in der Expo-CLI `i` (iOS-Simulator), `a` (Android-Emulator) oder `w` (Web) drücken, oder
den QR-Code mit der Expo-Go-App scannen.

## Nächste Schritte (für eine Produktivversion)

- Backend anbinden (siehe Einschränkung oben) – Voraussetzung für echte Team-Kommunikation und
  Push-Benachrichtigungen zwischen Geräten.
- Echte Authentifizierung (Passwort/SSO) statt Demo-Login.
- Bildupload für Spielerprofile und News-Beiträge.
- Verteilung an Tester ohne Expo Go: Web-Deployment (sofort möglich) oder EAS Build für eine
  installierbare Android-APK / iOS-TestFlight-Build.
