import { describe, expect, it } from "vitest";
import { parseChipAmount } from "./parse-chip-amount";

describe("parseChipAmount", () => {
  it("liest eine ganze Zahl aus einem Eingabefeld", () => {
    expect(parseChipAmount("120")).toBe(120);
  });

  it("ignoriert Leerzeichen um die Zahl", () => {
    expect(parseChipAmount("  80 ")).toBe(80);
  });

  it("liest auch 0 ein; ob 0 erlaubt ist, entscheidet die Spiellogik", () => {
    expect(parseChipAmount("0")).toBe(0);
  });

  it.each(["", "   ", "abc", "12abc", "-5", "2.5", "1e3"])(
    "liefert NaN fuer die ungueltige Eingabe '%s'",
    (text) => {
      expect(parseChipAmount(text)).toBeNaN();
    },
  );
});
