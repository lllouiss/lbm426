<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Projekt-Kontext: LB 426 – Casino-Software (Blackjack & Roulette)

Gruppenprüfung (Partnerarbeit) der BBB, Modul 426 "Software mit agilen Methoden entwerfen". Die vollständige Aufgabenstellung liegt in `lb-document.pdf` im Projekt-Root. Die folgenden Regeln leiten sich direkt aus dem Bewertungsraster ab und sind für dieses Projekt bindend — sie gelten zusätzlich zu und mit höherer Priorität als generische Next.js-Konventionen.

### Funktionale Anforderung
- Nutzer wandelt beim Start einen frei wählbaren Betrag in Jetons um.
- Nutzer wählt danach eines von zwei Spielen: **Blackjack** und **Roulette**.
- Nach Spielabschluss kann zur Spielauswahl zurückgekehrt oder aufgehört werden.
- Einsätze richten sich nach den jeweiligen Spielregeln.
- Keine Persistenz nötig — State darf rein in-memory (Client- oder Server-State) gehalten werden, keine DB nötig.

### Architektur: Spiele müssen leicht erweiterbar sein
Jedes Spiel ist ein eigenständiges Modul unter `src/games/<spielname>/`, das ein gemeinsames `Game`-Interface implementiert (Strategy Pattern, siehe unten). Ein zentrales Register (`src/games/registry.ts`) meldet verfügbare Spiele an, sodass ein drittes Spiel künftig ergänzt werden kann, ohne bestehenden Code zu ändern (Open/Closed Principle). Kein Spiel darf Wissen über ein anderes Spiel enthalten.

### Pflicht-Designpatterns
1. **Observer Pattern** (Pflicht, Aufgabe 3-5): explizit als klassisches GoF-Pattern implementieren (eigene `Subject`/`Observer`-Typen mit `subscribe()`/`notify()`), nicht nur implizit über React-State/Hooks — die Prüfung verlangt ein erkennbares, korrekt implementiertes Pattern. Sinnvoller Einsatzort: `Wallet` (Jetons-Bestand) als Subject — mehrere UI-Teile (Kontostand-Anzeige, aktuelles Spiel, evtl. Verlauf) abonnieren Änderungen.
2. **Zweites Pattern** (Aufgabe 2-1 / 3-6): Empfehlung **Strategy Pattern** für die Spiele selbst — jedes Spiel kapselt seine Regeln/Ablauf hinter dem gemeinsamen `Game`-Interface, austauschbar zur Laufzeit über die Registry. Passt direkt zur Anforderung "neue Spiele einfach integrierbar". Die Begründung für die Wahl muss im Lösungsdokument stehen (Aufgabe 2-1) — falls das Team ein anderes Pattern bevorzugt, hier Bescheid geben, bevor Code entsteht.

### TDD — zwingend, kein Ausnahmefall
- Für **jede** Funktionalität zuerst Tests schreiben, committen und pushen — erst danach implementieren (Aufgabe 3-4, wörtlich "immer(!)"). Die Git-Historie muss das belegen: Test-Commit vor Implementierungs-Commit, pro Feature-Branch.
- Test-Framework: Vitest + React Testing Library. Muss vor dem ersten Feature eingerichtet werden (noch nicht im Projekt vorhanden).
- Spiel-Logik (Blackjack-Regeln, Roulette-Payouts, Wallet) so schreiben, dass sie ohne UI/DOM testbar ist — reine Funktionen/Klassen in z.B. `src/games/**/logic.ts`, `src/lib/**`, UI-Komponenten bleiben dünn.

### Branching / Git (Aufgabe 3-2, 3-3)
- Jedes Teammitglied arbeitet auf eigenen Branches, nie beide gemeinsam auf demselben.
- Ein Branch pro Feature; der Branch-Name enthält die User-Story-ID, z.B. `feature/US-3-blackjack-hit-stand`.
- Jeder Branch wird stichwortartig dokumentiert (Lösungsdokument oder MR-Beschreibung) und per Merge Request zurück in `main` gemerged.
- GitLab (git.bbbaden.ch): Projekt-Sichtbarkeit nur für Teammitglieder + Lehrperson (Maintainer-Rolle). "Enable 'Delete source branch' by default" in den Merge-Request-Settings deaktivieren.

### Code-Qualität
- SOLID einhalten (wird separat beurteilt, Aufgabe 4-1) — insbesondere Open/Closed bei der Spiele-Erweiterung.
- Keine Code Smells (Aufgabe 3-7): keine God-Components, keine Duplikation, sprechende Namen, kleine Funktionen/Komponenten.
- TypeScript strict, ESLint-Regeln des Projekts einhalten.

### User Stories (Aufgabe 1-1, 1-2)
Mindestens 6 User Stories, Format: `US-<n>: Als <Rolle> möchte ich <Ziel>, um <Nutzen>.` Jede mit eindeutiger ID — diese ID wird in Branch-Namen und Commit-Messages referenziert.

### Nicht-Code-Deliverables (gehören ins Lösungsdokument, nicht in dieses Repo)
- Begründung der Designpattern-Wahl (2-1)
- SOLID-Beurteilung der fertigen Software inkl. Verbesserungsvorschlägen bei Verletzungen (4-1)
- Retrospektive: 3 Hindernisse + je ein realisierbarer Lösungsvorschlag, fokussiert auf Praktiken/Zusammenarbeit, nicht auf das Produkt (5-1, 5-2)
