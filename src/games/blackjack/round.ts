import type { Card } from "./cards";
import { handValue, isBust } from "./hand";
import { payoutFactor, validateBet, validateOpponentCount } from "./rules";

export type RoundPhase = "playing" | "finished";
export type RoundOutcome = "win" | "push" | "loss";

const OPPONENT_STAND_VALUE = 17;
const CARDS_PER_HAND = 2;

interface RoundSetup {
  bet: number;
  opponentCount: number;
  /** Stapel von oben nach unten; wird nicht veraendert. */
  deck: readonly Card[];
}

/** Eine Blackjack-Runde: Spieler gegen 1 bis 5 Computergegner. */
export class BlackjackRound {
  private readonly bet: number;
  private readonly deck: Card[];
  private readonly player: Card[];
  private readonly opponents: Card[][];
  private currentPhase: RoundPhase = "playing";
  private currentOutcome: RoundOutcome | null = null;

  constructor({ bet, opponentCount, deck }: RoundSetup) {
    validateBet(bet, Number.MAX_SAFE_INTEGER);
    validateOpponentCount(opponentCount);
    this.bet = bet;
    this.deck = [...deck];
    this.player = this.dealHand();
    this.opponents = Array.from({ length: opponentCount }, () =>
      this.dealHand(),
    );
  }

  get phase(): RoundPhase {
    return this.currentPhase;
  }

  get outcome(): RoundOutcome | null {
    return this.currentOutcome;
  }

  get playerHand(): readonly Card[] {
    return this.player;
  }

  get opponentHands(): readonly (readonly Card[])[] {
    return this.opponents;
  }

  /** Gesamte Gutschrift inklusive Einsatz (0 bei Verlust). */
  get payout(): number {
    if (this.currentOutcome === "win") {
      return this.bet * payoutFactor(this.opponents.length);
    }
    return this.currentOutcome === "push" ? this.bet : 0;
  }

  hit(): void {
    this.assertPlaying();
    this.player.push(this.drawCard());
    if (isBust(this.player)) {
      this.finish("loss");
    }
  }

  stand(): void {
    this.assertPlaying();
    this.opponents.forEach((hand) => this.playOpponent(hand));
    this.finish(this.compareWithOpponents());
  }

  private playOpponent(hand: Card[]): void {
    while (handValue(hand) < OPPONENT_STAND_VALUE) {
      hand.push(this.drawCard());
    }
  }

  private compareWithOpponents(): RoundOutcome {
    const playerValue = handValue(this.player);
    const best = Math.max(
      0,
      ...this.opponents.filter((h) => !isBust(h)).map(handValue),
    );
    if (playerValue > best) return "win";
    return playerValue === best ? "push" : "loss";
  }

  private dealHand(): Card[] {
    return Array.from({ length: CARDS_PER_HAND }, () => this.drawCard());
  }

  private drawCard(): Card {
    const card = this.deck.shift();
    if (!card) {
      throw new Error("Der Kartenstapel ist leer.");
    }
    return card;
  }

  private finish(outcome: RoundOutcome): void {
    this.currentPhase = "finished";
    this.currentOutcome = outcome;
  }

  private assertPlaying(): void {
    if (this.currentPhase !== "playing") {
      throw new Error("Die Runde ist bereits beendet.");
    }
  }
}
