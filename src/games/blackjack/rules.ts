export const MIN_OPPONENTS = 1;
export const MAX_OPPONENTS = 5;

export function validateBet(bet: number, balance: number): void {
  if (!Number.isSafeInteger(bet) || bet <= 0) {
    throw new RangeError("Der Einsatz muss eine positive ganze Zahl sein.");
  }
  if (bet > balance) {
    throw new RangeError("Der Einsatz uebersteigt das Guthaben.");
  }
}

export function validateOpponentCount(count: number): void {
  if (
    !Number.isInteger(count) ||
    count < MIN_OPPONENTS ||
    count > MAX_OPPONENTS
  ) {
    throw new RangeError(
      `Die Gegnerzahl muss zwischen ${MIN_OPPONENTS} und ${MAX_OPPONENTS} liegen.`,
    );
  }
}

/** Auszahlung inklusive Einsatz: pro Gegner ein Einsatz mehr Gewinn. */
export function payoutFactor(opponentCount: number): number {
  validateOpponentCount(opponentCount);
  return opponentCount + 1;
}
