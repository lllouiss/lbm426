import { describe, expect, it } from "vitest";
import { formatChips } from "./format-chips";

describe("formatChips (US-005)", () => {
  it("zeigt einen Betrag mit der Einheit Jetons", () => {
    expect(formatChips(120)).toBe("120 Jetons");
  });

  it("zeigt auch einen leeren Bestand an", () => {
    expect(formatChips(0)).toBe("0 Jetons");
  });

  it("zeigt negative Betraege mit Minuszeichen", () => {
    expect(formatChips(-30)).toBe("-30 Jetons");
  });
});
