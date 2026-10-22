import { describe, expect, it } from "vitest";
import { CasinoSession } from "./casino-session";
import { Wallet } from "../wallet/wallet";

describe("CasinoSession (US-006)", () => {
  describe("Casino verlassen", () => {
    it("ist ohne laufende Runde waehlbar", () => {
      expect(new CasinoSession(new Wallet(50)).canLeave).toBe(true);
    });

    it("zahlt die restlichen Jetons aus und leert das Wallet", () => {
      const wallet = new Wallet(80);
      const session = new CasinoSession(wallet);

      session.leave();

      expect(wallet.balance).toBe(0);
    });

    it("liefert die Bilanz mit Einzahlung, Endstand und Differenz", () => {
      const wallet = new Wallet();
      wallet.deposit(100);
      wallet.placeBet(50);
      wallet.payout(20);
      const session = new CasinoSession(wallet);

      expect(session.leave()).toEqual({
        deposited: 100,
        finalBalance: 70,
        difference: -30,
      });
    });

    it("beendet ohne Fehler, auch wenn keine Jetons vorhanden sind", () => {
      const session = new CasinoSession(new Wallet());

      expect(session.leave()).toEqual({
        deposited: 0,
        finalBalance: 0,
        difference: 0,
      });
    });

    it("markiert das Casino danach als verlassen", () => {
      const session = new CasinoSession(new Wallet(10));

      session.leave();

      expect(session.hasLeft).toBe(true);
      expect(session.canLeave).toBe(false);
    });

    it("stuerzt bei erneutem Verlassen nicht ab und liefert dieselbe Bilanz", () => {
      const session = new CasinoSession(new Wallet(60));

      const first = session.leave();
      const second = session.leave();

      expect(second).toEqual(first);
    });
  });

  describe("laufende Runde", () => {
    it("ist waehrend einer laufenden Runde nicht waehlbar", () => {
      const session = new CasinoSession(new Wallet(50));

      session.startRound();

      expect(session.isRoundInProgress).toBe(true);
      expect(session.canLeave).toBe(false);
    });

    it("lehnt das Verlassen waehrend einer Runde ab und zahlt nichts aus", () => {
      const wallet = new Wallet(50);
      const session = new CasinoSession(wallet);
      session.startRound();

      expect(() => session.leave()).toThrow(Error);
      expect(wallet.balance).toBe(50);
      expect(session.hasLeft).toBe(false);
    });

    it("ist nach Rundenende wieder waehlbar", () => {
      const session = new CasinoSession(new Wallet(50));
      session.startRound();

      session.finishRound();

      expect(session.isRoundInProgress).toBe(false);
      expect(session.canLeave).toBe(true);
    });

    it("lehnt eine zweite Runde ab, solange eine laeuft", () => {
      const session = new CasinoSession(new Wallet(50));
      session.startRound();

      expect(() => session.startRound()).toThrow(Error);
    });

    it("lehnt das Beenden einer Runde ab, wenn keine laeuft", () => {
      const session = new CasinoSession(new Wallet(50));

      expect(() => session.finishRound()).toThrow(Error);
    });

    it("lehnt eine neue Runde ab, nachdem das Casino verlassen wurde", () => {
      const session = new CasinoSession(new Wallet(50));
      session.leave();

      expect(() => session.startRound()).toThrow(Error);
    });
  });
});
