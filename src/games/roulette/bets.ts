import { assertValidNumber, colorOf } from "./wheel";

export type BetColor = "red" | "black";

export type RouletteBet =
  | { readonly type: "color"; readonly color: BetColor; readonly amount: number }
  | { readonly type: "number"; readonly number: number; readonly amount: number };

/** Gewinn pro Jeton Einsatz, ohne den Einsatz selbst (Farbe 1:1, Nummer 35:1). */
const PAYOUT_RATIO: Record<RouletteBet["type"], number> = {
  color: 1,
  number: 35,
};

const BET_COLORS: readonly string[] = ["red", "black"] satisfies BetColor[];

export function validateBet(bet: RouletteBet): void {
  if (!Number.isSafeInteger(bet.amount) || bet.amount <= 0) {
    throw new RangeError("Der Einsatz muss eine positive ganze Zahl sein.");
  }
  if (bet.type === "number") {
    assertValidNumber(bet.number);
  } else if (!BET_COLORS.includes(bet.color)) {
    throw new RangeError("Auf eine Farbe kann nur Rot oder Schwarz gesetzt werden.");
  }
}

function isHit(bet: RouletteBet, result: number): boolean {
  return bet.type === "number"
    ? bet.number === result
    : bet.color === colorOf(result);
}

/** Gutschrift inklusive Einsatz; 0, wenn der Einsatz verloren ist. */
export function betPayout(bet: RouletteBet, result: number): number {
  assertValidNumber(result);
  return isHit(bet, result) ? bet.amount * (PAYOUT_RATIO[bet.type] + 1) : 0;
}

export function totalStake(bets: readonly RouletteBet[]): number {
  return bets.reduce((sum, bet) => sum + bet.amount, 0);
}
