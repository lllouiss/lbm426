import { describe, expect, it } from "vitest";
import { createFinalBalance } from "./final-balance";

describe("createFinalBalance (Schlussbilanz, US-006)", () => {
  it("enthaelt Einzahlung und Endstand", () => {
    const balance = createFinalBalance(100, 140);

    expect(balance.deposited).toBe(100);
    expect(balance.finalBalance).toBe(140);
  });

  it("berechnet bei Gewinn eine positive Differenz", () => {
    expect(createFinalBalance(100, 140).difference).toBe(40);
  });

  it("berechnet bei Verlust eine negative Differenz", () => {
    expect(createFinalBalance(100, 30).difference).toBe(-70);
  });

  it("berechnet bei ausgeglichenem Spiel die Differenz 0", () => {
    expect(createFinalBalance(100, 100).difference).toBe(0);
  });

  it("berechnet die Differenz 0, wenn nichts eingezahlt wurde", () => {
    expect(createFinalBalance(0, 0)).toEqual({
      deposited: 0,
      finalBalance: 0,
      difference: 0,
    });
  });
});
