import { describe, expect, it } from "vitest";
import { gameRegistry } from "./registry";

describe("gameRegistry", () => {
  it("meldet Blackjack und Roulette im Casino an", () => {
    expect(gameRegistry.all.map((game) => game.id)).toEqual([
      "blackjack",
      "roulette",
    ]);
  });
});
