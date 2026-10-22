/** Schlussbilanz beim Verlassen des Casinos. */
export interface FinalBalance {
  deposited: number;
  finalBalance: number;
  difference: number;
}

export function createFinalBalance(
  deposited: number,
  finalBalance: number,
): FinalBalance {
  return { deposited, finalBalance, difference: finalBalance - deposited };
}
