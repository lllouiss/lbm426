# Umsetzungsplan – Casino (Blackjack & Roulette)

Referenz: `AGENTS.md` (Projekt-Kontext-Abschnitt) für die verbindlichen Regeln (TDD, Patterns, Branching). Dieser Plan bricht die Arbeit in Feature-Branches herunter, die 1:1 auf User Stories (`US-1` … `US-6`) mappen sollten — **US-IDs unten sind Platzhalter, beim Erstellen der echten Branches durch eure tatsächlichen IDs ersetzen.**

Jeder Schritt folgt demselben Ablauf (Definition of Done):
1. Branch von `main`: `feature/<US-ID>-<kurzbeschreibung>`
2. Tests schreiben → committen → pushen (roter Test)
3. Implementieren, bis Test grün → committen → pushen
4. Branch stichwortartig dokumentieren (Lösungsdokument/MR-Beschreibung)
5. Merge Request → Review durch Teampartner → Merge nach `main`

---

## Phase 0 — Setup (gemeinsam, kein Feature-Branch nötig oder `chore/setup`)
- [ ] GitLab-Projekt auf git.bbbaden.ch anlegen, Sichtbarkeit auf Team + Lehrperson (Maintainer) beschränken
- [ ] MR-Settings: "Enable 'Delete source branch' by default" deaktivieren
- [ ] Testing-Setup: Vitest + React Testing Library installieren und konfigurieren
- [ ] Basis-Ordnerstruktur anlegen: `src/games/`, `src/games/registry.ts`, `src/lib/wallet/`, `src/lib/observer/`
- [ ] Lösungsdokument anlegen (Word/PDF) mit Gliederung für: User Stories, Pattern-Begründung, Branch-Dokumentation, SOLID-Beurteilung, Retrospektive

## Phase 1 — Kern-Architektur (bevor die Spiele gebaut werden)
Diese Teile werden von beiden Spielen gebraucht, deshalb zuerst.

- [ ] **US-1** `feature/US-1-observer-wallet` — Generisches Observer-Pattern (`Subject`/`Observer`-Interfaces mit `subscribe()`/`notify()`) + `Wallet`-Klasse (Jetons-Bestand, Einsatz, Auszahlung) als konkretes Subject
  - Tests zuerst: Wallet-Auf-/Abbuchung, Observer wird bei Änderung benachrichtigt, mehrere Observer gleichzeitig
- [ ] **US-2** `feature/US-2-game-registry` — `Game`-Interface (Strategy Pattern) + `registry.ts`, das Spiele zur Laufzeit registriert/auflistet
  - Tests zuerst: Registry gibt registrierte Spiele zurück, unbekanntes Spiel liefert definierten Fehler/Fallback
- [ ] **US-3** `feature/US-3-casino-shell` — Grundgerüst-UI: Betrag eingeben → in Jetons umwandeln (nutzt Wallet), Spielauswahl-Screen (nutzt Registry), Rückkehr-zur-Auswahl-Flow
  - Tests zuerst: Betrag→Jetons-Umrechnung, Navigation zwischen Auswahl und Spiel

→ Diese drei Branches sind idealerweise von unterschiedlichen Teammitgliedern parallelisierbar, sobald das `Game`-Interface (US-2) grob feststeht (kurz gemeinsam absprechen, dann trennen).

## Phase 2 — Blackjack (ein Teammitglied)
- [ ] **US-4** `feature/US-4-blackjack-logic` — Spiellogik pur (Karten/Deck, Werte, Hit/Stand, Dealer-Regeln, Gewinn-/Verlustermittlung) als reine Funktionen/Klassen ohne UI
  - Tests zuerst: Kartenwert-Berechnung (inkl. Ass 1/11), Bust-Erkennung, Blackjack-Erkennung, Dealer-Logik, Gewinnermittlung bei mehreren Gegnern
- [ ] **US-5** `feature/US-5-blackjack-ui` — UI, die die Logik aus US-4 über das `Game`-Interface anbindet; Einsatz + Anzahl Gegner wählbar; Auszahlung steigt mit Anzahl Gegnern
  - Tests zuerst: Komponenten-Tests (RTL) für Einsatz-Auswahl, Spielverlauf-Rendering, Wallet-Update nach Spielende

## Phase 3 — Roulette (anderes Teammitglied, parallel zu Phase 2 möglich)
- [ ] **US-6** `feature/US-6-roulette-logic` — Spiellogik pur (Zahlenkreis, Farben, Auszahlungsquoten je Wettart, mehrere gleichzeitige Wetten)
  - Tests zuerst: Auszahlung pro Wettart (Zahl, Farbe, ggf. weitere), gleichzeitige Wetten auf mehrere Felder, ungültige Wetten
- [ ] `feature/<US-ID>-roulette-ui` (falls als eigene User Story geführt) — UI zum Setzen auf Farben/Nummern, Anbindung an Wallet/Registry
  - Tests zuerst: Wett-Eingabe, Rad-Ergebnis-Anzeige, Wallet-Update nach Spielende

## Phase 4 — Qualitätssicherung (nach beiden Spielen)
- [ ] Code-Smell-Review: Duplikation zwischen Blackjack/Roulette identifizieren, ggf. in `src/lib/` extrahieren
- [ ] SOLID-Review der fertigen Software durchführen, Verstösse + Verbesserungsvorschläge ins Lösungsdokument (Aufgabe 4-1)
- [ ] ESLint/TypeScript strict ohne Fehler

## Phase 5 — Dokumentation & Abgabe (nicht-Code)
- [ ] User Stories im Lösungsdokument mit IDs (bereits vorhanden — einfügen)
- [ ] Designpattern-Begründung (Observer + Strategy) schreiben (Aufgabe 2-1)
- [ ] Branch-Dokumentation zusammenführen (alle stichwortartigen Beschreibungen aus den MRs)
- [ ] Retrospektive: 3 Hindernisse + je 1 Lösungsvorschlag, Fokus auf Praktiken/Zusammenarbeit (Aufgabe 5-1, 5-2)
- [ ] Administrative Vorgaben prüfen: Ordner-/Zip-Naming `Name1Name2LB-426`, alles in einem File zusammengefasst, Abgabe auf Moodle

---

## Offene Entscheidungen
- Wer übernimmt Blackjack, wer Roulette? (Phase 2 vs. Phase 3)
- Reale User-Story-IDs einsetzen, sobald verfügbar (aktuell Platzhalter US-1…US-6)
- Ist die Next.js/TypeScript-Ausnahme zum vorgeschriebenen C# mit der Lehrperson abgesprochen?
