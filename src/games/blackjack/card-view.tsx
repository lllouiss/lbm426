import type { Card, Suit } from "./cards";
import { describeCard } from "./card-label";

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const RED_SUITS: readonly Suit[] = ["hearts", "diamonds"];

interface CardViewProps {
  card: Card;
  faceDown?: boolean;
  /** Verzoegerung der Austeil-Animation in Millisekunden. */
  delayMs?: number;
}

/** Eine Spielkarte: fliegt beim Austeilen ein und dreht sich beim Aufdecken. */
export function CardView({ card, faceDown = false, delayMs = 0 }: CardViewProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const color = RED_SUITS.includes(card.suit) ? "text-red-600" : "text-slate-900";

  return (
    <div
      role="img"
      aria-label={faceDown ? "Verdeckte Karte" : describeCard(card)}
      className="animate-deal-in h-28 w-20 [perspective:600px] sm:h-36 sm:w-24"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div
        aria-hidden="true"
        className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]"
        style={{ transform: faceDown ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/10 [backface-visibility:hidden] ${color}`}
        >
          <span className="text-lg leading-none font-bold">
            {card.rank}
            <br />
            {symbol}
          </span>
          <span className="self-center text-4xl sm:text-5xl">{symbol}</span>
          <span className="rotate-180 self-end text-lg leading-none font-bold">
            {card.rank}
            <br />
            {symbol}
          </span>
        </div>
        <div className="card-back absolute inset-0 rounded-xl shadow-lg ring-2 ring-white/80 [backface-visibility:hidden] [transform:rotateY(180deg)]" />
      </div>
    </div>
  );
}
