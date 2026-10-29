import type { Card, Rank, Suit } from "./cards";

const SUIT_NAMES: Record<Suit, string> = {
  spades: "Pik",
  hearts: "Herz",
  diamonds: "Karo",
  clubs: "Kreuz",
};

const RANK_NAMES: Partial<Record<Rank, string>> = {
  A: "Ass",
  J: "Bube",
  Q: "Dame",
  K: "König",
};

/** Beschriftung fuer Screenreader, z.B. "Herz König". */
export function describeCard(card: Card): string {
  return `${SUIT_NAMES[card.suit]} ${RANK_NAMES[card.rank] ?? card.rank}`;
}
