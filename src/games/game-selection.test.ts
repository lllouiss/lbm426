import { describe, expect, it } from "vitest";
import { canStartGame, selectGame } from "./game-selection";
import { GameRegistry } from "./game-registry";
import { createFakeGame } from "@/test/fake-game";

describe("Spielauswahl (US-002)", () => {
  const blackjack = createFakeGame("blackjack", "Blackjack");
  const roulette = createFakeGame("roulette", "Roulette");
  const registry = new GameRegistry([blackjack, roulette]);

  describe("canStartGame", () => {
    it("erlaubt den Start, solange Jetons vorhanden sind", () => {
      expect(canStartGame(1)).toBe(true);
      expect(canStartGame(250)).toBe(true);
    });

    it("blockiert den Start bei 0 Jetons", () => {
      expect(canStartGame(0)).toBe(false);
    });
  });

  describe("selectGame", () => {
    it("liefert das gewaehlte Spiel", () => {
      expect(selectGame(registry, "roulette", 100)).toBe(roulette);
    });

    it("weist eine unbekannte Spiel-ID ab", () => {
      expect(() => selectGame(registry, "poker", 100)).toThrow(RangeError);
    });

    it("weist eine leere Eingabe ab", () => {
      expect(() => selectGame(registry, "", 100)).toThrow(RangeError);
    });

    it("blockiert den Start bei 0 Jetons", () => {
      expect(() => selectGame(registry, "blackjack", 0)).toThrow(Error);
    });
  });
});
