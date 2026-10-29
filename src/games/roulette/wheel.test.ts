import { describe, expect, it } from "vitest";
import { MAX_NUMBER, MIN_NUMBER, colorOf, spinWheel } from "./wheel";

const RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

describe("Zahlenkreis", () => {
  it("umfasst die Zahlen 0 bis 36", () => {
    expect(MIN_NUMBER).toBe(0);
    expect(MAX_NUMBER).toBe(36);
  });
});

describe("colorOf", () => {
  it("gibt der 0 die Farbe Gruen", () => {
    expect(colorOf(0)).toBe("green");
  });

  it.each(RED)("zaehlt die %s zu Rot", (number) => {
    expect(colorOf(number)).toBe("red");
  });

  it.each(BLACK)("zaehlt die %s zu Schwarz", (number) => {
    expect(colorOf(number)).toBe("black");
  });

  it.each([-1, 37, 2.5, Number.NaN])(
    "lehnt die ungueltige Zahl %s ab",
    (number) => {
      expect(() => colorOf(number)).toThrow(RangeError);
    },
  );
});

describe("spinWheel", () => {
  it("bildet die Zufallszahl gleichmaessig auf 0 bis 36 ab", () => {
    expect(spinWheel(() => 0)).toBe(0);
    expect(spinWheel(() => 0.5)).toBe(18);
    expect(spinWheel(() => 0.999999)).toBe(36);
  });

  it("liefert ohne eigene Zufallsquelle eine ganze Zahl von 0 bis 36", () => {
    for (let i = 0; i < 100; i++) {
      const number = spinWheel();
      expect(Number.isInteger(number)).toBe(true);
      expect(number).toBeGreaterThanOrEqual(0);
      expect(number).toBeLessThanOrEqual(36);
    }
  });
});
