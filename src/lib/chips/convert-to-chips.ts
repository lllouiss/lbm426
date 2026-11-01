import type { Wallet } from "../wallet/wallet";
import { parseChipAmount } from "./parse-chip-amount";

function parseAmount(input: number | string): number {
  return typeof input === "string" ? parseChipAmount(input) : input;
}

/**
 * Wandelt einen frei gewaehlten Betrag im Verhaeltnis 1:1 in Jetons um
 * und schreibt sie dem Wallet gut. Erlaubt sind nur positive ganze Zahlen.
 * @returns die gutgeschriebenen Jetons
 */
export function convertToChips(wallet: Wallet, input: number | string): number {
  const amount = parseAmount(input);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new RangeError("Der Betrag muss eine positive ganze Zahl sein.");
  }
  wallet.deposit(amount);
  return amount;
}
