import type { Wallet } from "../wallet/wallet";
import { createFinalBalance, type FinalBalance } from "./final-balance";

/**
 * Ein Casino-Besuch: weiss, ob gerade eine Runde laeuft, und erlaubt das
 * Verlassen nur zwischen den Runden. Beim Verlassen werden die restlichen
 * Jetons ausbezahlt und die Schlussbilanz erstellt.
 */
export class CasinoSession {
  private roundInProgress = false;
  private result: FinalBalance | null = null;

  constructor(private readonly wallet: Wallet) {}

  get isRoundInProgress(): boolean {
    return this.roundInProgress;
  }

  get hasLeft(): boolean {
    return this.result !== null;
  }

  get canLeave(): boolean {
    return !this.roundInProgress && !this.hasLeft;
  }

  startRound(): void {
    if (this.hasLeft) {
      throw new Error("Das Casino wurde bereits verlassen.");
    }
    if (this.roundInProgress) {
      throw new Error("Es laeuft bereits eine Runde.");
    }
    this.roundInProgress = true;
  }

  finishRound(): void {
    if (!this.roundInProgress) {
      throw new Error("Es laeuft keine Runde.");
    }
    this.roundInProgress = false;
  }

  /**
   * Zahlt die restlichen Jetons aus und liefert die Schlussbilanz.
   * Mehrfaches Aufrufen liefert dieselbe Bilanz, ohne erneut auszuzahlen.
   */
  leave(): FinalBalance {
    if (this.result) {
      return this.result;
    }
    if (this.roundInProgress) {
      throw new Error("Waehrend einer laufenden Runde kann nicht aufgehoert werden.");
    }
    const paidOut = this.wallet.cashOut();
    this.result = createFinalBalance(this.wallet.totalDeposited, paidOut);
    return this.result;
  }
}
