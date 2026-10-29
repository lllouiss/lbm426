import { describe, expect, it, vi } from "vitest";
import { CasinoSession } from "@/lib/casino/casino-session";
import { Wallet } from "@/lib/wallet/wallet";
import type { Card, Rank } from "./cards";
import { BlackjackTable } from "./blackjack-table";

const deckOf = (...ranks: Rank[]): Card[] =>
  ranks.map((rank) => ({ rank, suit: "clubs" }));

/** Spieler 10+9, Gegner 10+7: der Spieler gewinnt beim Stand. */
const WINNING_DECK: Rank[] = ["10", "9", "10", "7"];
const LOSING_DECK: Rank[] = ["10", "8", "10", "9"];
const PUSH_DECK: Rank[] = ["10", "8", "10", "8"];

function createTable(deck: Rank[], balance = 100) {
  const wallet = new Wallet(balance);
  const session = new CasinoSession(wallet);
  const table = new BlackjackTable(wallet, session, () => deckOf(...deck));
  return { wallet, session, table };
}

describe("BlackjackTable: Austeilen", () => {
  it("hat zu Beginn keine Runde", () => {
    expect(createTable(WINNING_DECK).table.round).toBeNull();
  });

  it("bucht den Einsatz ab und markiert die Runde in der Session", () => {
    const { wallet, session, table } = createTable(WINNING_DECK);

    table.deal(30, 1);

    expect(wallet.balance).toBe(70);
    expect(session.isRoundInProgress).toBe(true);
    expect(table.round?.phase).toBe("playing");
  });

  it("lehnt einen Einsatz ueber dem Guthaben ohne Nebenwirkung ab", () => {
    const { wallet, session, table } = createTable(WINNING_DECK, 20);

    expect(() => table.deal(21, 1)).toThrow(RangeError);

    expect(wallet.balance).toBe(20);
    expect(session.isRoundInProgress).toBe(false);
    expect(table.round).toBeNull();
  });

  it("lehnt eine ungueltige Gegnerzahl ohne Nebenwirkung ab", () => {
    const { wallet, session, table } = createTable(WINNING_DECK);

    expect(() => table.deal(10, 6)).toThrow(RangeError);

    expect(wallet.balance).toBe(100);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("erlaubt kein neues Austeilen waehrend einer laufenden Runde", () => {
    const { table } = createTable(WINNING_DECK);
    table.deal(10, 1);

    expect(() => table.deal(10, 1)).toThrow();
  });
});

describe("BlackjackTable: Rundenende", () => {
  it("schreibt bei einem Sieg den Gewinn inklusive Einsatz gut", () => {
    const { wallet, session, table } = createTable(WINNING_DECK);
    table.deal(10, 1);

    table.stand();

    expect(wallet.balance).toBe(110);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("gibt bei Gleichstand den Einsatz zurueck", () => {
    const { wallet, table } = createTable(PUSH_DECK);
    table.deal(10, 1);

    table.stand();

    expect(wallet.balance).toBe(100);
  });

  it("behaelt den Einsatz bei einer Niederlage ein", () => {
    const { wallet, session, table } = createTable(LOSING_DECK);
    table.deal(10, 1);

    table.stand();

    expect(wallet.balance).toBe(90);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("beendet die Runde sofort, wenn der Spieler bust geht", () => {
    const { wallet, session, table } = createTable(["K", "Q", "2", "3", "5"]);
    table.deal(10, 1);

    table.hit();

    expect(table.round?.outcome).toBe("loss");
    expect(wallet.balance).toBe(90);
    expect(session.isRoundInProgress).toBe(false);
  });

  it("beendet die Runde direkt beim Austeilen, wenn die Runde dann schon entschieden ist", () => {
    const { table } = createTable(WINNING_DECK);

    table.deal(10, 1);

    expect(table.round?.phase).toBe("playing");
  });

  it("schreibt nach einem Hit ohne Bust noch nichts gut", () => {
    const { wallet, table } = createTable(["2", "3", "4", "5", "6"]);
    table.deal(10, 1);

    table.hit();

    expect(wallet.balance).toBe(90);
    expect(table.round?.phase).toBe("playing");
  });
});

describe("BlackjackTable: neue Runde", () => {
  it("erlaubt nach Rundenende ein neues Austeilen", () => {
    const { wallet, table } = createTable(LOSING_DECK);
    table.deal(10, 1);
    table.stand();

    table.reset();
    expect(table.round).toBeNull();
    table.deal(10, 1);

    expect(wallet.balance).toBe(80);
  });

  it("verwirft eine laufende Runde nicht beim Zuruecksetzen", () => {
    const { table } = createTable(WINNING_DECK);
    table.deal(10, 1);

    expect(() => table.reset()).toThrow();
  });
});

describe("BlackjackTable als Subject (Observer-Pattern)", () => {
  it("benachrichtigt Observer bei Austeilen, Hit, Stand und Reset", () => {
    const { table } = createTable(["2", "3", "4", "5", "6", "7", "8"]);
    const update = vi.fn();
    table.subscribe({ update });

    table.deal(10, 1);
    table.hit();
    table.stand();
    table.reset();

    expect(update).toHaveBeenCalledTimes(4);
  });

  it("erhoeht die Revision bei jeder Aenderung", () => {
    const { table } = createTable(WINNING_DECK);
    const before = table.revision;

    table.deal(10, 1);

    expect(table.revision).toBeGreaterThan(before);
  });

  it("benachrichtigt abgemeldete Observer nicht mehr", () => {
    const { table } = createTable(WINNING_DECK);
    const observer = { update: vi.fn() };
    table.subscribe(observer);
    table.unsubscribe(observer);

    table.deal(10, 1);

    expect(observer.update).not.toHaveBeenCalled();
  });

  it("mischt standardmaessig einen vollen Stapel", () => {
    const wallet = new Wallet(100);
    const table = new BlackjackTable(wallet, new CasinoSession(wallet));

    table.deal(10, 2);

    expect(table.round?.playerHand).toHaveLength(2);
    expect(table.round?.opponentHands).toHaveLength(2);
  });
});
