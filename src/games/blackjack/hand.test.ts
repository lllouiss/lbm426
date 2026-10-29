import { describe, expect, it } from "vitest";
import type { Card, Rank } from "./cards";
import { handValue, isBust } from "./hand";

const hand = (...ranks: Rank[]): Card[] =>
  ranks.map((rank) => ({ rank, suit: "spades" }));

describe("handValue", () => {
  it("zaehlt Zahlenkarten mit ihrem Wert", () => {
    expect(handValue(hand("2", "9"))).toBe(11);
  });

  it.each(["10", "J", "Q", "K"] as Rank[])("zaehlt %s als 10", (rank) => {
    expect(handValue(hand(rank))).toBe(10);
  });

  it("zaehlt ein Ass als 11, solange die Hand nicht ueber 21 geht", () => {
    expect(handValue(hand("A", "6"))).toBe(17);
  });

  it("zaehlt ein Ass als 1, wenn 11 die Hand ueber 21 bringen wuerde", () => {
    expect(handValue(hand("A", "6", "K"))).toBe(17);
  });

  it("wertet mehrere Asse so, dass die Hand moeglichst nah an 21 liegt", () => {
    expect(handValue(hand("A", "A"))).toBe(12);
    expect(handValue(hand("A", "A", "9"))).toBe(21);
  });

  it("ergibt 21 fuer Ass und Koenig", () => {
    expect(handValue(hand("A", "K"))).toBe(21);
  });

  it("ergibt 0 fuer eine leere Hand", () => {
    expect(handValue([])).toBe(0);
  });
});

describe("isBust", () => {
  it("ist bei 21 nicht bust", () => {
    expect(isBust(hand("K", "Q", "A"))).toBe(false);
  });

  it("ist bei ueber 21 bust", () => {
    expect(isBust(hand("K", "Q", "2"))).toBe(true);
  });

  it("ist mit Ass, das als 1 zaehlt, nicht bust", () => {
    expect(isBust(hand("A", "K", "9"))).toBe(false);
  });
});
