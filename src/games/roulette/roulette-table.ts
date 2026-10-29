import { BaseSubject } from "@/lib/observer/subject";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";
import type { RouletteBet } from "./bets";
import { RouletteRound } from "./round";
import { spinWheel } from "./wheel";

/**
 * Verbindet eine Roulette-Runde mit Wallet und Casino-Session: sammelt die
 * Einsaetze, bucht sie beim Drehen ab und schreibt die Gewinne gut.
 * Als Subject informiert er die UI bei jeder Aenderung (Observer-Pattern).
 */
export class RouletteTable extends BaseSubject<RouletteRound> {
  private current: RouletteRound;
  private changes = 0;

  constructor(
    private readonly wallet: Wallet,
    private readonly session: CasinoSession,
    private readonly spinner: () => number = spinWheel,
  ) {
    super();
    this.current = new RouletteRound(wallet.balance);
  }

  get round(): RouletteRound {
    return this.current;
  }

  /** Zaehlt die Aenderungen; dient der UI als Momentaufnahme. */
  get revision(): number {
    return this.changes;
  }

  placeBet(bet: RouletteBet): void {
    this.current.placeBet(bet);
    this.publish();
  }

  removeBet(index: number): void {
    this.current.removeBet(index);
    this.publish();
  }

  /** Dreht das Rad; ohne Einsatz bleibt alles unveraendert. */
  spin(): number {
    const result = this.current.spin(this.spinner);
    this.book(this.current);
    this.publish();
    return result;
  }

  /** Raeumt die gedrehte Runde ab, damit neu gesetzt werden kann. */
  newRound(): void {
    if (this.current.phase === "betting") {
      throw new Error("Die Runde laeuft noch.");
    }
    this.current = new RouletteRound(this.wallet.balance);
    this.publish();
  }

  private book(round: RouletteRound): void {
    this.session.startRound();
    this.wallet.placeBet(round.totalStake);
    if (round.payout > 0) {
      this.wallet.payout(round.payout);
    }
    this.session.finishRound();
  }

  private publish(): void {
    this.changes += 1;
    this.notify(this.current);
  }
}
