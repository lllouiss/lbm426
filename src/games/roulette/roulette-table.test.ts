import { describe, expect, it, vi } from "vitest";
import { CasinoSession } from "@/lib/casino/casino-session";
import { Wallet } from "@/lib/wallet/wallet";
import type { RouletteBet } from "./bets";
import { RouletteTable } from "./roulette-table";

const red = (amount: number): RouletteBet => ({ type: "color", color: "red", amount });
const black = (amount: number): RouletteBet => ({ type: "color", color: "black", amount });
const straight = (number: number, amount: number): RouletteBet => ({
  type: "number",
  number,
  amount,
});

function createTable(landsOn: number, balance = 100) {
  const wallet = new Wallet(balance);
  const session = new CasinoSession(wallet);
  const table = new RouletteTable(wallet, session, () => landsOn);
  return { wallet, session, table };
}

describe("RouletteTable: Einsaetze setzen", () => {
  it("startet mit einer leeren Runde in der Setzphase", () => {
    const { table } = createTable(7);

    expect(table.round.phase).toBe("betting");
    expect(table.round.bets).toEqual([]);
  });

  it("nimmt Einsaetze an, bucht aber erst beim Drehen ab", () => {
    const { wallet, session, table } = createTable(7);

    table.placeBet(red(10));
    table.placeBet(straight(17, 5));

    expect(table.round.bets).toEqual([red(10), straight(17, 5)]);
    expect(table.round.totalStake).toBe(15);
    expect(wallet.balance).toBe(100);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("lehnt Einsaetze ueber dem Guthaben ab", () => {
    const { table } = createTable(7, 20);
    table.placeBet(red(15));

    expect(() => table.placeBet(black(6))).toThrow(RangeError);
    expect(table.round.bets).toEqual([red(15)]);
  });

  it("entfernt einen Einsatz wieder", () => {
    const { table } = createTable(7);
    table.placeBet(red(10));
    table.placeBet(black(20));

    table.removeBet(0);

    expect(table.round.bets).toEqual([black(20)]);
  });
});

describe("RouletteTable: Drehen", () => {
  it("dreht nicht ohne Einsatz und veraendert nichts", () => {
    const { wallet, session, table } = createTable(7);

    expect(() => table.spin()).toThrow(Error);
    expect(wallet.balance).toBe(100);
    expect(session.isRoundInProgress).toBe(false);
    expect(table.round.phase).toBe("betting");
  });

  it("bucht alle Einsaetze ab und schreibt die Gewinne gut", () => {
    const { wallet, table } = createTable(17);
    table.placeBet(red(10));
    table.placeBet(straight(17, 5));

    const result = table.spin();

    // 100 - 15 Einsatz + 180 fuer die Nummer 17; Rot verliert (17 ist schwarz)
    expect(result).toBe(17);
    expect(table.round.result).toBe(17);
    expect(wallet.balance).toBe(265);
  });

  it("behaelt bei einem Fehlschlag alle Einsaetze ein", () => {
    const { wallet, table } = createTable(2);
    table.placeBet(red(10));
    table.placeBet(straight(17, 5));

    table.spin();

    expect(wallet.balance).toBe(85);
  });

  it("laesst bei der 0 alle Farbeinsaetze verlieren", () => {
    const { wallet, table } = createTable(0);
    table.placeBet(red(10));
    table.placeBet(black(10));

    table.spin();

    expect(wallet.balance).toBe(80);
  });

  it("meldet die Buchung als laufende Runde und beendet sie danach", () => {
    const { wallet, session, table } = createTable(7);
    const duringBooking: boolean[] = [];
    wallet.subscribe({ update: () => duringBooking.push(session.isRoundInProgress) });
    table.placeBet(red(10));

    table.spin();

    expect(duringBooking.length).toBeGreaterThan(0);
    expect(duringBooking.every(Boolean)).toBe(true);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("nimmt nach dem Dreh keine Einsaetze mehr an", () => {
    const { table } = createTable(7);
    table.placeBet(red(10));
    table.spin();

    expect(() => table.placeBet(black(10))).toThrow(Error);
    expect(() => table.spin()).toThrow(Error);
  });

  it("dreht ohne eigene Zufallsquelle eine Zahl von 0 bis 36", () => {
    const wallet = new Wallet(100);
    const table = new RouletteTable(wallet, new CasinoSession(wallet));
    table.placeBet(red(10));

    const result = table.spin();

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(36);
  });
});

describe("RouletteTable: neue Runde", () => {
  it("startet nach dem Dreh eine leere Runde mit dem neuen Guthaben", () => {
    const { table } = createTable(2);
    table.placeBet(red(60));
    table.spin();

    table.newRound();

    expect(table.round.phase).toBe("betting");
    expect(table.round.bets).toEqual([]);
    expect(() => table.placeBet(red(41))).toThrow(RangeError);
  });

  it("startet keine neue Runde, solange noch gesetzt wird", () => {
    const { table } = createTable(7);
    table.placeBet(red(10));

    expect(() => table.newRound()).toThrow(Error);
    expect(table.round.bets).toEqual([red(10)]);
  });
});

describe("RouletteTable: Observer", () => {
  it("benachrichtigt bei jeder Aenderung und zaehlt die Revision hoch", () => {
    const { table } = createTable(7);
    const update = vi.fn();
    table.subscribe({ update });

    table.placeBet(red(10));
    table.removeBet(0);
    table.placeBet(black(10));
    table.spin();
    table.newRound();

    expect(update).toHaveBeenCalledTimes(5);
    expect(table.revision).toBe(5);
  });

  it("benachrichtigt nicht, wenn ein Einsatz abgelehnt wird", () => {
    const { table } = createTable(7);
    const update = vi.fn();
    table.subscribe({ update });

    expect(() => table.placeBet(red(0))).toThrow(RangeError);

    expect(update).not.toHaveBeenCalled();
    expect(table.revision).toBe(0);
  });
});
