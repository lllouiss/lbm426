import { BaseSubject } from "../observer/subject";

function assertValidAmount(amount: number, label: string): void {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError(`${label} muss eine positive Zahl sein.`);
  }
}

/**
 * Jetons-Bestand des Spielers. Konkretes Subject des Observer-Patterns:
 * Nach jeder Aenderung wird der neue Stand an alle Observer gemeldet.
 */
export class Wallet extends BaseSubject<number> {
  private currentBalance: number;

  constructor(initialBalance = 0) {
    super();
    if (!Number.isFinite(initialBalance) || initialBalance < 0) {
      throw new RangeError("Der Anfangsbestand darf nicht negativ sein.");
    }
    this.currentBalance = initialBalance;
  }

  get balance(): number {
    return this.currentBalance;
  }

  /** Schreibt Jetons gut (z.B. beim Umwandeln eines Betrags). */
  deposit(amount: number): void {
    assertValidAmount(amount, "Der Betrag");
    this.change(amount);
  }

  /** Zieht einen Einsatz vom Bestand ab. */
  placeBet(amount: number): void {
    assertValidAmount(amount, "Der Einsatz");
    if (amount > this.currentBalance) {
      throw new RangeError("Der Einsatz uebersteigt das Guthaben.");
    }
    this.change(-amount);
  }

  /** Schreibt einen Gewinn gut. */
  payout(amount: number): void {
    assertValidAmount(amount, "Der Gewinn");
    this.change(amount);
  }

  private change(delta: number): void {
    this.currentBalance += delta;
    this.notify(this.currentBalance);
  }
}
