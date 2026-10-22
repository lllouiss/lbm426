import { describe, expect, it, vi } from "vitest";
import { Wallet } from "./wallet";
import type { Observer } from "../observer/observer";

function createObserver() {
  const update = vi.fn<(balance: number) => void>();
  const observer: Observer<number> = { update };
  return { observer, update };
}

describe("Wallet", () => {
  describe("Anfangsbestand", () => {
    it("startet standardmaessig mit 0 Jetons", () => {
      expect(new Wallet().balance).toBe(0);
    });

    it("startet mit dem uebergebenen Anfangsbestand", () => {
      expect(new Wallet(100).balance).toBe(100);
    });

    it("lehnt einen negativen Anfangsbestand ab", () => {
      expect(() => new Wallet(-1)).toThrow(RangeError);
    });
  });

  describe("deposit (Gutschrift)", () => {
    it("erhoeht den Bestand", () => {
      const wallet = new Wallet(10);

      wallet.deposit(40);

      expect(wallet.balance).toBe(50);
    });

    it.each([0, -5, Number.NaN, Number.POSITIVE_INFINITY])(
      "lehnt den ungueltigen Betrag %s ab und laesst den Bestand unveraendert",
      (amount) => {
        const wallet = new Wallet(10);

        expect(() => wallet.deposit(amount)).toThrow(RangeError);
        expect(wallet.balance).toBe(10);
      },
    );
  });

  describe("placeBet (Einsatz)", () => {
    it("verringert den Bestand um den Einsatz", () => {
      const wallet = new Wallet(100);

      wallet.placeBet(30);

      expect(wallet.balance).toBe(70);
    });

    it("erlaubt einen Einsatz in Hoehe des gesamten Bestands", () => {
      const wallet = new Wallet(100);

      wallet.placeBet(100);

      expect(wallet.balance).toBe(0);
    });

    it("lehnt einen Einsatz ueber dem Guthaben ab", () => {
      const wallet = new Wallet(50);

      expect(() => wallet.placeBet(51)).toThrow(RangeError);
      expect(wallet.balance).toBe(50);
    });

    it.each([0, -5, Number.NaN])(
      "lehnt den ungueltigen Einsatz %s ab",
      (amount) => {
        const wallet = new Wallet(50);

        expect(() => wallet.placeBet(amount)).toThrow(RangeError);
        expect(wallet.balance).toBe(50);
      },
    );
  });

  describe("payout (Auszahlung eines Gewinns)", () => {
    it("erhoeht den Bestand um den Gewinn", () => {
      const wallet = new Wallet(20);

      wallet.payout(80);

      expect(wallet.balance).toBe(100);
    });

    it.each([0, -5, Number.NaN])(
      "lehnt den ungueltigen Gewinn %s ab",
      (amount) => {
        const wallet = new Wallet(20);

        expect(() => wallet.payout(amount)).toThrow(RangeError);
        expect(wallet.balance).toBe(20);
      },
    );
  });

  describe("Observer (US-005)", () => {
    it("meldet den neuen Stand nach einer Gutschrift", () => {
      const wallet = new Wallet(10);
      const { observer, update } = createObserver();
      wallet.subscribe(observer);

      wallet.deposit(5);

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(15);
    });

    it("meldet den neuen Stand nach einem Einsatz (Verlust)", () => {
      const wallet = new Wallet(100);
      const { observer, update } = createObserver();
      wallet.subscribe(observer);

      wallet.placeBet(40);

      expect(update).toHaveBeenCalledWith(60);
    });

    it("meldet den neuen Stand nach einem Gewinn", () => {
      const wallet = new Wallet(100);
      const { observer, update } = createObserver();
      wallet.subscribe(observer);

      wallet.placeBet(40);
      wallet.payout(80);

      expect(update).toHaveBeenNthCalledWith(1, 60);
      expect(update).toHaveBeenNthCalledWith(2, 140);
    });

    it("benachrichtigt mehrere Observer gleichzeitig", () => {
      const wallet = new Wallet(0);
      const anzeige = createObserver();
      const spiel = createObserver();
      wallet.subscribe(anzeige.observer);
      wallet.subscribe(spiel.observer);

      wallet.deposit(25);

      expect(anzeige.update).toHaveBeenCalledWith(25);
      expect(spiel.update).toHaveBeenCalledWith(25);
    });

    it("benachrichtigt nach dem Abmelden nicht mehr", () => {
      const wallet = new Wallet(0);
      const { observer, update } = createObserver();
      wallet.subscribe(observer);
      wallet.unsubscribe(observer);

      wallet.deposit(10);

      expect(update).not.toHaveBeenCalled();
    });

    it("benachrichtigt nicht, wenn eine Operation abgelehnt wird", () => {
      const wallet = new Wallet(10);
      const { observer, update } = createObserver();
      wallet.subscribe(observer);

      expect(() => wallet.placeBet(999)).toThrow(RangeError);
      expect(() => wallet.deposit(-1)).toThrow(RangeError);

      expect(update).not.toHaveBeenCalled();
    });

    it("erlaubt neue Observer ohne Aenderung am Wallet (Open/Closed)", () => {
      const wallet = new Wallet(0);
      const verlauf: number[] = [];
      wallet.subscribe({ update: (balance) => verlauf.push(balance) });

      wallet.deposit(10);
      wallet.deposit(5);

      expect(verlauf).toEqual([10, 15]);
    });
  });
});
