# Umsetzungsplan – Casino (Blackjack & Roulette)

Referenz: `AGENTS.md` (Projekt-Kontext) für die verbindlichen Regeln (TDD, Patterns, Branching). User Stories und Akzeptanzkriterien: `LB_426_Personas.pptx` (US-001 … US-006).

Jeder Schritt folgt demselben Ablauf (Definition of Done):
1. Branch von `main`: `feature/<US-ID>-<kurzbeschreibung>` (echte ID, z.B. `US-005`)
2. Tests schreiben → committen → pushen (roter Test)
3. Implementieren, bis Test grün → committen → pushen
4. Branch stichwortartig dokumentieren (Lösungsdokument / MR-Beschreibung)
5. Merge Request → Review durch Teampartner → Merge nach `main`

## User Stories (Quelle: LB_426_Personas.pptx)
| ID | Inhalt |
|---|---|
| US-001 | Frei gewählten Betrag in Jetons umwandeln |
| US-002 | Im Hauptmenü zwischen den verfügbaren Spielen wählen |
| US-003 | Blackjack: Einsatz und Gegnerzahl festlegen, Hit/Stand |
| US-004 | Roulette: mehrere Felder mit Farb-/Nummerneinsätzen besetzen |
| US-005 | Jeton-Kontostand nach jeder Änderung sofort angezeigt (Observer) |
| US-006 | Casino verlassen, restliche Jetons auszahlen, Schlussbilanz |

---

## Phase 0 — Setup (`chore/setup`, gemeinsam)
- [ ] GitLab: Projekt auf git.bbbaden.ch, Sichtbarkeit nur Team + Lehrperson (Maintainer)
- [ ] MR-Settings: "Enable 'Delete source branch' by default" deaktivieren
- [ ] Vitest + React Testing Library installieren (`npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`); Konfiguration (`vitest.config.ts`, `vitest.setup.ts`, `npm test`) liegt bereits im Branch
- [ ] Ordnerstruktur: `src/games/`, `src/lib/wallet/`, `src/lib/observer/` (liegt im Branch)
- [ ] `Game`-Interface kurz gemeinsam absprechen, bevor die Branches getrennt werden

## Phase 1 — Kern (vor den Spielen)
- [ ] **US-005** `feature/US-005-observer-wallet` — GoF-Observer (`Subject`/`Observer`, `subscribe()`/`unsubscribe()`/`notify()`) + `Wallet` als Subject (Gutschrift, Einsatz, Auszahlung)
  - Tests zuerst: Stand nach Gewinn/Verlust, Observer wird bei jeder Änderung benachrichtigt, mehrere Observer, Observer anhängbar ohne Änderung am Wallet
- [ ] **US-001** `feature/US-001-jetons-umwandeln` — Betrag → Jetons (nutzt Wallet)
  - Tests zuerst: positiver Betrag wird gutgeschrieben; 0, negativ, ungültig (NaN, Text) abgelehnt
- [ ] **US-002** `feature/US-002-game-registry` — `Game`-Interface (Strategy) + `registry.ts` + Spielauswahl-Menü
  - Tests zuerst: alle registrierten Spiele gelistet; ungültige Auswahl abgewiesen; bei 0 Jetons Start blockiert
- [ ] **US-006** `feature/US-006-casino-verlassen` — «Aufhören», Auszahlung, Bilanz (Einzahlung, Endstand, Differenz)
  - Tests zuerst: Bilanz-Berechnung; während laufender Runde nicht wählbar; Beenden ohne Absturz

→ US-005 zuerst (Wallet wird von allen gebraucht). US-001, US-002, US-006 danach parallel auf beide Personen verteilbar.

## Phase 2 — Blackjack (Teammitglied A)
- [ ] **US-003** `feature/US-003-blackjack-logic` — reine Logik: Deck, Kartenwerte (Ass 1/11), Bust >21, Dealer/Gegner ziehen bis 17, Gegnerzahl 1–5, Auszahlungsfaktor steigt mit Gegnerzahl, Einsatz ≤ Guthaben
- [ ] **US-003** `feature/US-003-blackjack-ui` — UI (Einsatz, Gegnerzahl, Hit/Stand) über `Game`-Interface, Wallet-Update nach Rundenende

## Phase 3 — Roulette (Teammitglied B, parallel zu Phase 2)
- [ ] **US-004** `feature/US-004-roulette-logic` — reine Logik: Zahlenkreis, Farben, Farbe 1:1, Nummer 35:1, 0 → Farbeinsätze verloren, mehrere gleichzeitige Wetten, Summe aller Einsätze ≤ Guthaben
- [ ] **US-004** `feature/US-004-roulette-ui` — UI zum Setzen auf Farben/Nummern, Einsatzübersicht vor dem Dreh, Wallet-Update

(Mehrere Branches pro User Story sind erlaubt; die ID steht im Branch-Namen.)

## Phase 4 — Qualitätssicherung
- [ ] Code-Smell-Review: Duplikation zwischen den Spielen in `src/lib/` extrahieren
- [ ] SOLID-Review, Verstösse + Verbesserungen ins Lösungsdokument (Aufgabe 4)
- [ ] ESLint / TypeScript strict ohne Fehler

## Phase 5 — Dokumentation & Abgabe
- [ ] User Stories (vorhanden in Personas-PPTX) ins Lösungsdokument
- [ ] Designpattern-Begründung (Observer + Strategy)
- [ ] Branch-Dokumentation aus den MRs zusammenführen
- [ ] Retrospektive: 3 Hindernisse + je 1 Lösungsvorschlag (Praktiken/Zusammenarbeit)
- [ ] Abgabe: Ordner/Zip `Name1Name2LB-426`, alles in einem File, Moodle

## Offene Entscheidungen
- Wer übernimmt Blackjack, wer Roulette?
- Entscheid: Next.js/TypeScript ist mit der Lehrperson geklärt, GitHub ist erlaubt (laut Team)
