import { describe, expect, it } from "vitest";
import type { RouletteBet } from "./bets";
import { RouletteRound } from "./round";

const red = (amount: number): RouletteBet => ({ type: "color", color: "red", amount });
const black = (amount: number): RouletteBet => ({ type: "color", color: "black", amount });
const straight = (number: number, amount: number): RouletteBet => ({
  type: "number",
  number,
  amount,
});

/** Liefert immer dieselbe Zahl, damit das Ergebnis im Test feststeht. */
const landsOn = (number: number) => () => number;

describe("RouletteRound: Einsaetze setzen", () => {
  it("startet ohne Einsaetze in der Setzphase", () => {
    const round = new RouletteRound(100);

    expect(round.phase).toBe("betting");
    expect(round.bets).toEqual([]);
    expect(round.totalStake).toBe(0);
    expect(round.result).toBeNull();
    expect(round.payout).toBe(0);
  });

  it("kombiniert Farb- und Nummerneinsaetze in derselben Runde", () => {
    const round = new RouletteRound(100);

    round.placeBet(red(10));
    round.placeBet(straight(17, 5));
    round.placeBet(black(20));

    expect(round.bets).toEqual([red(10), straight(17, 5), black(20)]);
  });

  it("zeigt vor dem Dreh die Summe aller Einsaetze (Uebersicht)", () => {
    const round = new RouletteRound(100);

    round.placeBet(red(10));
    round.placeBet(straight(17, 5));

    expect(round.totalStake).toBe(15);
  });

  it("erlaubt Einsaetze bis zur Hoehe des Guthabens", () => {
    const round = new RouletteRound(30);

    round.placeBet(red(10));
    round.placeBet(straight(3, 20));

    expect(round.totalStake).toBe(30);
  });

  it("lehnt einen Einsatz ab, wenn die Summe das Guthaben uebersteigt", () => {
    const round = new RouletteRound(30);
    round.placeBet(red(20));

    expect(() => round.placeBet(black(11))).toThrow(RangeError);
    expect(round.bets).toEqual([red(20)]);
  });

  it("lehnt einen ungueltigen Einsatz ab", () => {
    const round = new RouletteRound(100);

    expect(() => round.placeBet(red(0))).toThrow(RangeError);
    expect(() => round.placeBet(straight(37, 5))).toThrow(RangeError);
    expect(round.bets).toEqual([]);
  });

  it("entfernt einen gesetzten Einsatz wieder", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));
    round.placeBet(straight(17, 5));

    round.removeBet(0);

    expect(round.bets).toEqual([straight(17, 5)]);
    expect(round.totalStake).toBe(5);
  });

  it("lehnt das Entfernen eines unbekannten Einsatzes ab", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));

    expect(() => round.removeBet(1)).toThrow(RangeError);
    expect(() => round.removeBet(-1)).toThrow(RangeError);
  });

  it("laesst die Liste der Einsaetze von aussen nicht veraendern", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));

    (round.bets as RouletteBet[]).push(black(50));

    expect(round.bets).toEqual([red(10)]);
  });

  it("lehnt ein ungueltiges Guthaben ab", () => {
    expect(() => new RouletteRound(-1)).toThrow(RangeError);
    expect(() => new RouletteRound(Number.NaN)).toThrow(RangeError);
  });
});

describe("RouletteRound: Drehen", () => {
  it("dreht nicht ohne Einsatz", () => {
    const round = new RouletteRound(100);

    expect(() => round.spin(landsOn(7))).toThrow(Error);
    expect(round.phase).toBe("betting");
  });

  it("beendet die Runde mit dem Ergebnis des Drehs", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));

    const result = round.spin(landsOn(7));

    expect(result).toBe(7);
    expect(round.result).toBe(7);
    expect(round.phase).toBe("finished");
  });

  it("zahlt alle gewinnenden Einsaetze inklusive Einsatz aus", () => {
    const round = new RouletteRound(100);
    round.placeBet(black(10));
    round.placeBet(straight(17, 5));
    round.placeBet(red(20));

    round.spin(landsOn(17));

    // Schwarz 10 -> 20, Nummer 17 mit 5 -> 180, Rot verliert
    expect(round.payout).toBe(200);
  });

  it("zahlt nichts aus, wenn kein Einsatz trifft", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));
    round.placeBet(straight(5, 5));

    round.spin(landsOn(2));

    expect(round.payout).toBe(0);
  });

  it("laesst bei der 0 alle Farbeinsaetze verlieren", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));
    round.placeBet(black(10));

    round.spin(landsOn(0));

    expect(round.payout).toBe(0);
  });

  it("zahlt bei der 0 einen Nummerneinsatz auf die 0 aus", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));
    round.placeBet(straight(0, 5));

    round.spin(landsOn(0));

    expect(round.payout).toBe(180);
  });

  it("dreht ohne eigene Zufallsquelle eine Zahl von 0 bis 36", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));

    const result = round.spin();

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(36);
  });

  it("lehnt ein ungueltiges Ergebnis ab und bleibt in der Setzphase", () => {
    const round = new RouletteRound(100);
    round.placeBet(red(10));

    expect(() => round.spin(landsOn(37))).toThrow(RangeError);
    expect(round.phase).toBe("betting");
    expect(round.result).toBeNull();
  });
});

describe("RouletteRound: nach dem Dreh", () => {
  function finishedRound() {
    const round = new RouletteRound(100);
    round.placeBet(red(10));
    round.spin(landsOn(1));
    return round;
  }

  it("nimmt keine weiteren Einsaetze an", () => {
    expect(() => finishedRound().placeBet(black(10))).toThrow(Error);
  });

  it("laesst keine Einsaetze mehr entfernen", () => {
    expect(() => finishedRound().removeBet(0)).toThrow(Error);
  });

  it("dreht kein zweites Mal", () => {
    expect(() => finishedRound().spin(landsOn(2))).toThrow(Error);
  });
});
