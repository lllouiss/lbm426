import { describe, expect, it } from "vitest";
import { createDeck, shuffle } from "./cards";

describe("createDeck", () => {
  it("enthaelt 52 verschiedene Karten", () => {
    const deck = createDeck();

    const unique = new Set(deck.map((card) => `${card.rank}${card.suit}`));
    expect(deck).toHaveLength(52);
    expect(unique.size).toBe(52);
  });

  it("enthaelt jeden Rang viermal", () => {
    const aces = createDeck().filter((card) => card.rank === "A");

    expect(aces).toHaveLength(4);
  });
});

describe("shuffle", () => {
  it("behaelt alle Karten und laesst das Original unveraendert", () => {
    const deck = createDeck();
    const original = [...deck];

    const shuffled = shuffle(deck, () => 0.3);

    expect(deck).toEqual(original);
    expect(shuffled).toHaveLength(52);
    expect(new Set(shuffled)).toEqual(new Set(deck));
  });

  it("ist mit derselben Zufallsquelle reproduzierbar", () => {
    const deck = createDeck();

    expect(shuffle(deck, () => 0.7)).toEqual(shuffle(deck, () => 0.7));
  });

  it("veraendert die Reihenfolge", () => {
    const deck = createDeck();

    expect(shuffle(deck, () => 0)).not.toEqual(deck);
  });
});
