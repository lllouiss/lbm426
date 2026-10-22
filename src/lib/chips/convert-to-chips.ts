import type { Wallet } from "../wallet/wallet";

const WHOLE_NUMBER = /^\d+$/;

function parseAmount(input: number | string): number {
  return typeof input === "string" ? parseTextAmount(input) : input;
}

function parseTextAmount(text: string): number {
  const trimmed = text.trim();
  return WHOLE_NUMBER.test(trimmed) ? Number(trimmed) : Number.NaN;
}

/**
 * Wandelt einen frei gewaehlten Betrag im Verhaeltnis 1:1 in Jetons um
 * und schreibt sie dem Wallet gut. Erlaubt sind nur positive ganze Zahlen.
 * @returns die gutgeschriebenen Jetons
 */
export function convertToChips(wallet: Wallet, input: number | string): number {
  const amount = parseAmount(input);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new RangeError("Der Betrag muss eine positive ganze Zahl sein.");
  }
  wallet.deposit(amount);
  return amount;
}
