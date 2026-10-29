import { describe, expect, it } from "vitest";
import {
  MAX_OPPONENTS,
  MIN_OPPONENTS,
  payoutFactor,
  validateBet,
  validateOpponentCount,
} from "./rules";

describe("validateBet", () => {
  it("akzeptiert einen Einsatz bis zur Hoehe des Guthabens", () => {
    expect(() => validateBet(50, 100)).not.toThrow();
    expect(() => validateBet(100, 100)).not.toThrow();
  });

  it("lehnt einen Einsatz ueber dem Guthaben ab", () => {
    expect(() => validateBet(101, 100)).toThrow(RangeError);
  });

  it.each([0, -5, 2.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "lehnt den ungueltigen Einsatz %s ab",
    (bet) => {
      expect(() => validateBet(bet, 100)).toThrow(RangeError);
    },
  );
});

describe("validateOpponentCount", () => {
  it("erlaubt 1 bis 5 Gegner", () => {
    expect(MIN_OPPONENTS).toBe(1);
    expect(MAX_OPPONENTS).toBe(5);
    for (const count of [1, 2, 3, 4, 5]) {
      expect(() => validateOpponentCount(count)).not.toThrow();
    }
  });

  it.each([0, 6, -1, 2.5, Number.NaN])(
    "lehnt die Gegnerzahl %s ab",
    (count) => {
      expect(() => validateOpponentCount(count)).toThrow(RangeError);
    },
  );
});

describe("payoutFactor", () => {
  it("steigt mit der Gegnerzahl", () => {
    const factors = [1, 2, 3, 4, 5].map(payoutFactor);

    expect(factors).toEqual([...factors].sort((a, b) => a - b));
    expect(new Set(factors).size).toBe(5);
  });

  it("zahlt bei einem Gegner 2:1 inklusive Einsatz", () => {
    expect(payoutFactor(1)).toBe(2);
  });

  it("zahlt bei fuenf Gegnern 6:1 inklusive Einsatz", () => {
    expect(payoutFactor(5)).toBe(6);
  });

  it("lehnt eine ungueltige Gegnerzahl ab", () => {
    expect(() => payoutFactor(6)).toThrow(RangeError);
  });
});
