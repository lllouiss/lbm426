import { describe, expect, it } from "vitest";
import { colorName, describeBet } from "./bet-label";

describe("colorName", () => {
  it("benennt die Farben auf Deutsch", () => {
    expect(colorName("red")).toBe("Rot");
    expect(colorName("black")).toBe("Schwarz");
    expect(colorName("green")).toBe("Grün");
  });
});

describe("describeBet", () => {
  it("beschreibt einen Farbeinsatz mit der Farbe", () => {
    expect(describeBet({ type: "color", color: "red", amount: 10 })).toBe("Rot");
    expect(describeBet({ type: "color", color: "black", amount: 10 })).toBe(
      "Schwarz",
    );
  });

  it("beschreibt einen Nummerneinsatz mit der Nummer", () => {
    expect(describeBet({ type: "number", number: 17, amount: 5 })).toBe(
      "Nummer 17",
    );
    expect(describeBet({ type: "number", number: 0, amount: 5 })).toBe(
      "Nummer 0",
    );
  });
});
