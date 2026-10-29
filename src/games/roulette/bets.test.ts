import { describe, expect, it } from "vitest";
import {
  betPayout,
  totalStake,
  validateBet,
  type RouletteBet,
} from "./bets";

const red = (amount: number): RouletteBet => ({ type: "color", color: "red", amount });
const black = (amount: number): RouletteBet => ({ type: "color", color: "black", amount });
const straight = (number: number, amount: number): RouletteBet => ({
  type: "number",
  number,
  amount,
});

describe("validateBet", () => {
  it("akzeptiert Farbeinsaetze auf Rot und Schwarz", () => {
    expect(() => validateBet(red(10))).not.toThrow();
    expect(() => validateBet(black(10))).not.toThrow();
  });

  it("akzeptiert Nummerneinsaetze auf 0 bis 36", () => {
    expect(() => validateBet(straight(0, 5))).not.toThrow();
    expect(() => validateBet(straight(36, 5))).not.toThrow();
  });

  it.each([0, -5, 2.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lehnt den ungueltigen Betrag %s ab",
    (amount) => {
      expect(() => validateBet(red(amount))).toThrow(RangeError);
      expect(() => validateBet(straight(7, amount))).toThrow(RangeError);
    },
  );

  it.each([-1, 37, 2.5])("lehnt die ungueltige Nummer %s ab", (number) => {
    expect(() => validateBet(straight(number, 5))).toThrow(RangeError);
  });

  it("lehnt einen Farbeinsatz auf Gruen ab", () => {
    const green = { type: "color", color: "green", amount: 5 } as unknown as RouletteBet;

    expect(() => validateBet(green)).toThrow(RangeError);
  });
});

describe("betPayout (Gutschrift inklusive Einsatz)", () => {
  describe("Farbeinsatz zahlt 1:1", () => {
    it("zahlt bei einem Treffer den doppelten Einsatz aus", () => {
      expect(betPayout(red(10), 1)).toBe(20);
      expect(betPayout(black(10), 2)).toBe(20);
    });

    it("zahlt bei der falschen Farbe nichts aus", () => {
      expect(betPayout(red(10), 2)).toBe(0);
      expect(betPayout(black(10), 1)).toBe(0);
    });

    it("verliert bei der 0", () => {
      expect(betPayout(red(10), 0)).toBe(0);
      expect(betPayout(black(10), 0)).toBe(0);
    });
  });

  describe("Nummerneinsatz zahlt 35:1", () => {
    it("zahlt bei einem Treffer das 36-Fache des Einsatzes aus", () => {
      expect(betPayout(straight(17, 10), 17)).toBe(360);
    });

    it("zahlt auch auf die 0 aus, wenn sie getroffen wird", () => {
      expect(betPayout(straight(0, 10), 0)).toBe(360);
    });

    it("zahlt bei einer anderen Zahl nichts aus", () => {
      expect(betPayout(straight(17, 10), 18)).toBe(0);
    });
  });

  it("lehnt ein ungueltiges Ergebnis ab", () => {
    expect(() => betPayout(red(10), 37)).toThrow(RangeError);
  });
});

describe("totalStake", () => {
  it("summiert alle Einsaetze einer Runde", () => {
    expect(totalStake([red(10), straight(17, 5), black(20)])).toBe(35);
  });

  it("ist ohne Einsaetze 0", () => {
    expect(totalStake([])).toBe(0);
  });
});
