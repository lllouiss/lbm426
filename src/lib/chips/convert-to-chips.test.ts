import { describe, expect, it, vi } from "vitest";
import { convertToChips } from "./convert-to-chips";
import { Wallet } from "../wallet/wallet";

describe("convertToChips (US-001)", () => {
  describe("gueltiger Betrag", () => {
    it("schreibt den Betrag als Jetons im Verhaeltnis 1:1 gut", () => {
      const wallet = new Wallet();

      convertToChips(wallet, 250);

      expect(wallet.balance).toBe(250);
    });

    it("gibt die gutgeschriebenen Jetons zurueck", () => {
      expect(convertToChips(new Wallet(), 100)).toBe(100);
    });

    it("addiert zu einem bestehenden Bestand", () => {
      const wallet = new Wallet(50);

      convertToChips(wallet, 25);

      expect(wallet.balance).toBe(75);
    });

    it("akzeptiert einen Betrag als Text aus einem Eingabefeld", () => {
      const wallet = new Wallet();

      convertToChips(wallet, "120");

      expect(wallet.balance).toBe(120);
    });

    it("ignoriert Leerzeichen um einen Text-Betrag", () => {
      const wallet = new Wallet();

      convertToChips(wallet, "  80 ");

      expect(wallet.balance).toBe(80);
    });

    it("benachrichtigt die Observer des Wallets (US-005)", () => {
      const wallet = new Wallet();
      const update = vi.fn();
      wallet.subscribe({ update });

      convertToChips(wallet, 40);

      expect(update).toHaveBeenCalledWith(40);
    });
  });

  describe("ungueltiger Betrag", () => {
    it.each([
      ["null", 0],
      ["negativ", -10],
      ["NaN", Number.NaN],
      ["unendlich", Number.POSITIVE_INFINITY],
      ["Kommazahl", 10.5],
      ["leerer Text", ""],
      ["Leerzeichen", "   "],
      ["Text", "abc"],
      ["Text mit Zahl", "12abc"],
      ["negativer Text", "-5"],
      ["Kommazahl als Text", "10.5"],
      ["Exponentialschreibweise", "1e3"],
      ["zu grosse Zahl", Number.MAX_SAFE_INTEGER + 1],
      ["zu grosse Zahl als Text", "99999999999999999999"],
    ])("lehnt %s ab und laesst den Bestand unveraendert", (_label, amount) => {
      const wallet = new Wallet(10);

      expect(() => convertToChips(wallet, amount)).toThrow(RangeError);
      expect(wallet.balance).toBe(10);
    });

    it("benachrichtigt die Observer nicht", () => {
      const wallet = new Wallet();
      const update = vi.fn();
      wallet.subscribe({ update });

      expect(() => convertToChips(wallet, "abc")).toThrow(RangeError);

      expect(update).not.toHaveBeenCalled();
    });
  });
});
