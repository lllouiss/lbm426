import {
  betPayout,
  totalStake as sumStakes,
  validateBet,
  type RouletteBet,
} from "./bets";
import { assertValidNumber, spinWheel } from "./wheel";

export type RoulettePhase = "betting" | "finished";

/** Eine Roulette-Runde: beliebig viele Einsaetze setzen, dann einmal drehen. */
export class RouletteRound {
  private readonly placed: RouletteBet[] = [];
  private winningNumber: number | null = null;

  /** balance: verfuegbare Jetons; die Summe aller Einsaetze darf sie nicht uebersteigen. */
  constructor(private readonly balance: number) {
    if (!Number.isFinite(balance) || balance < 0) {
      throw new RangeError("Das Guthaben darf nicht negativ sein.");
    }
  }

  get phase(): RoulettePhase {
    return this.winningNumber === null ? "betting" : "finished";
  }

  get result(): number | null {
    return this.winningNumber;
  }

  get bets(): readonly RouletteBet[] {
    return [...this.placed];
  }

  get totalStake(): number {
    return sumStakes(this.placed);
  }

  /** Gesamte Gutschrift inklusive Einsaetze (0 vor dem Dreh). */
  get payout(): number {
    const result = this.winningNumber;
    if (result === null) return 0;
    return this.placed.reduce((sum, bet) => sum + betPayout(bet, result), 0);
  }

  placeBet(bet: RouletteBet): void {
    this.assertBetting();
    validateBet(bet);
    if (this.totalStake + bet.amount > this.balance) {
      throw new RangeError("Die Einsaetze uebersteigen das Guthaben.");
    }
    this.placed.push(bet);
  }

  removeBet(index: number): void {
    this.assertBetting();
    if (!Number.isInteger(index) || index < 0 || index >= this.placed.length) {
      throw new RangeError("Diesen Einsatz gibt es nicht.");
    }
    this.placed.splice(index, 1);
  }

  /** Dreht das Rad, beendet die Runde und liefert die gezogene Zahl. */
  spin(spinner: () => number = spinWheel): number {
    this.assertBetting();
    if (this.placed.length === 0) {
      throw new Error("Ohne Einsatz kann nicht gedreht werden.");
    }
    const number = spinner();
    assertValidNumber(number);
    this.winningNumber = number;
    return number;
  }

  private assertBetting(): void {
    if (this.phase !== "betting") {
      throw new Error("Die Runde ist bereits beendet.");
    }
  }
}
