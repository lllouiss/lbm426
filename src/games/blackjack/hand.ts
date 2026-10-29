import type { Card, Rank } from "./cards";

export const BLACKJACK = 21;
const ACE_BONUS = 10;

const FACE_CARDS: readonly Rank[] = ["J", "Q", "K"];

function cardValue(rank: Rank): number {
  if (rank === "A") return 1;
  if (FACE_CARDS.includes(rank)) return 10;
  return Number(rank);
}

/** Bester Handwert: ein Ass zaehlt 11, solange die Hand nicht ueber 21 geht. */
export function handValue(hand: readonly Card[]): number {
  const hardTotal = hand.reduce((sum, card) => sum + cardValue(card.rank), 0);
  const hasAce = hand.some((card) => card.rank === "A");
  return hasAce && hardTotal + ACE_BONUS <= BLACKJACK
    ? hardTotal + ACE_BONUS
    : hardTotal;
}

export function isBust(hand: readonly Card[]): boolean {
  return handValue(hand) > BLACKJACK;
}
