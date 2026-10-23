import { describe, expect, it } from "vitest";
import type { Game } from "./game";
import { GameRegistry } from "./game-registry";
import { createFakeGame } from "@/test/fake-game";

describe("GameRegistry (US-002)", () => {
  const blackjack = createFakeGame("blackjack", "Blackjack");
  const roulette = createFakeGame("roulette", "Roulette");

  describe("Spiele auflisten", () => {
    it("listet alle registrierten Spiele in der Reihenfolge der Anmeldung", () => {
      const registry = new GameRegistry([blackjack, roulette]);

      expect(registry.all).toEqual([blackjack, roulette]);
    });

    it("ist ohne angemeldete Spiele leer", () => {
      expect(new GameRegistry().all).toEqual([]);
    });

    it("nimmt ein weiteres Spiel ohne Aenderung am Register auf", () => {
      const registry = new GameRegistry([blackjack]);

      registry.register(roulette);

      expect(registry.all).toEqual([blackjack, roulette]);
    });

    it("laesst die Liste von aussen nicht veraendern", () => {
      const registry = new GameRegistry([blackjack]);

      (registry.all as Game[]).push(roulette);

      expect(registry.all).toEqual([blackjack]);
    });
  });

  describe("Spiel ueber die ID finden", () => {
    it("liefert das Spiel zur ID", () => {
      const registry = new GameRegistry([blackjack, roulette]);

      expect(registry.get("roulette")).toBe(roulette);
    });

    it("weist eine unbekannte ID ab", () => {
      const registry = new GameRegistry([blackjack]);

      expect(() => registry.get("poker")).toThrow(RangeError);
    });
  });

  describe("doppelte Anmeldung", () => {
    it("weist ein Spiel mit bereits vergebener ID ab", () => {
      const registry = new GameRegistry([blackjack]);

      expect(() =>
        registry.register(createFakeGame("blackjack", "Anderes Blackjack")),
      ).toThrow(Error);
    });

    it("behaelt bei einer doppelten ID das zuerst angemeldete Spiel", () => {
      const registry = new GameRegistry([blackjack]);

      expect(() => registry.register(createFakeGame("blackjack"))).toThrow();

      expect(registry.all).toEqual([blackjack]);
      expect(registry.get("blackjack")).toBe(blackjack);
    });
  });
});
