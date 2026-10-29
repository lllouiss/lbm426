import type { Card } from "./cards";
import { CardView } from "./card-view";
import { handValue, isBust } from "./hand";

const FIRST_DEAL_DELAY_MS = 140;
const DRAW_DELAY_MS = 450;

interface HandViewProps {
  title: string;
  cards: readonly Card[];
  /** Verdeckt die zweite Karte (Gegner waehrend der Runde). */
  hideSecondCard?: boolean;
  showValue?: boolean;
  highlight?: "win" | "loss" | null;
}

function dealDelay(index: number): number {
  return index < 2 ? index * FIRST_DEAL_DELAY_MS : DRAW_DELAY_MS * (index - 1);
}

export function HandView({
  title,
  cards,
  hideSecondCard = false,
  showValue = true,
  highlight = null,
}: HandViewProps) {
  const glow =
    highlight === "win"
      ? "animate-glow ring-2 ring-amber-300"
      : highlight === "loss"
        ? "opacity-70 grayscale-[40%]"
        : "";

  return (
    <section
      aria-label={title}
      className={`flex flex-col items-center gap-3 rounded-2xl p-3 transition ${glow}`}
    >
      <h3 className="text-sm font-semibold tracking-widest text-emerald-100 uppercase">
        {title}
      </h3>
      <div className="flex -space-x-6">
        {cards.map((card, index) => (
          <CardView
            key={`${index}-${card.rank}-${card.suit}`}
            card={card}
            faceDown={hideSecondCard && index === 1}
            delayMs={dealDelay(index)}
          />
        ))}
      </div>
      {showValue && (
        <div className="flex items-center gap-2">
          <span
            key={handValue(cards)}
            className="animate-pop rounded-full bg-black/40 px-3 py-1 font-mono text-sm text-white"
          >
            Wert {handValue(cards)}
          </span>
          {isBust(cards) && (
            <span className="animate-pop rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
              Überkauft
            </span>
          )}
        </div>
      )}
    </section>
  );
}
