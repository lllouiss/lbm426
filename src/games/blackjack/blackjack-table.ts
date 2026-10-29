import { BaseSubject } from "@/lib/observer/subject";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";
import { createDeck, shuffle, type Card } from "./cards";
import { BlackjackRound } from "./round";
import { validateBet } from "./rules";

const freshShuffledDeck = () => shuffle(createDeck());

/**
 * Verbindet eine Blackjack-Runde mit Wallet und Casino-Session: bucht den
 * Einsatz ab, meldet die laufende Runde und schreibt den Gewinn gut.
 * Als Subject informiert er die UI bei jeder Aenderung (Observer-Pattern).
 */
export class BlackjackTable extends BaseSubject<BlackjackRound | null> {
  private current: BlackjackRound | null = null;
  private changes = 0;

  constructor(
    private readonly wallet: Wallet,
    private readonly session: CasinoSession,
    private readonly nextDeck: () => Card[] = freshShuffledDeck,
  ) {
    super();
  }

  get round(): BlackjackRound | null {
    return this.current;
  }

  /** Zaehlt die Aenderungen; dient der UI als Momentaufnahme. */
  get revision(): number {
    return this.changes;
  }

  /** Teilt aus; bei ungueltiger Eingabe bleibt alles unveraendert. */
  deal(bet: number, opponentCount: number): void {
    if (this.current) {
      throw new Error("Es ist bereits eine Runde aktiv.");
    }
    validateBet(bet, this.wallet.balance);
    const round = new BlackjackRound({
      bet,
      opponentCount,
      deck: this.nextDeck(),
    });
    this.session.startRound();
    this.wallet.placeBet(bet);
    this.current = round;
    this.publish();
  }

  hit(): void {
    this.activeRound().hit();
    this.settleIfFinished();
  }

  stand(): void {
    this.activeRound().stand();
    this.settleIfFinished();
  }

  /** Raeumt die beendete Runde ab, damit neu eingesetzt werden kann. */
  reset(): void {
    if (this.current?.phase === "playing") {
      throw new Error("Die Runde laeuft noch.");
    }
    this.current = null;
    this.publish();
  }

  private activeRound(): BlackjackRound {
    if (!this.current) {
      throw new Error("Es laeuft keine Runde.");
    }
    return this.current;
  }

  private settleIfFinished(): void {
    const round = this.activeRound();
    if (round.phase === "finished") {
      if (round.payout > 0) {
        this.wallet.payout(round.payout);
      }
      this.session.finishRound();
    }
    this.publish();
  }

  private publish(): void {
    this.changes += 1;
    this.notify(this.current);
  }
}
