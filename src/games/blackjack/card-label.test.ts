import { describe, expect, it } from "vitest";
import { describeCard } from "./card-label";

describe("describeCard", () => {
  it("benennt Farbe und Rang auf Deutsch", () => {
    expect(describeCard({ rank: "A", suit: "spades" })).toBe("Pik Ass");
    expect(describeCard({ rank: "K", suit: "hearts" })).toBe("Herz König");
    expect(describeCard({ rank: "Q", suit: "diamonds" })).toBe("Karo Dame");
    expect(describeCard({ rank: "J", suit: "clubs" })).toBe("Kreuz Bube");
    expect(describeCard({ rank: "7", suit: "hearts" })).toBe("Herz 7");
  });
});
