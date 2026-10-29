import { useId } from "react";
import { formatChips } from "@/lib/chips/format-chips";
import type { RouletteBet } from "./bets";
import { describeBet } from "./bet-label";

interface BetSummaryProps {
  bets: readonly RouletteBet[];
  totalStake: number;
  onRemove: (index: number) => void;
  onSpin: () => void;
}

/** Uebersicht aller Einsaetze vor dem Dreh. */
export function BetSummary({ bets, totalStake, onRemove, onSpin }: BetSummaryProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col gap-3 rounded-2xl bg-black/35 p-4 text-white shadow-xl backdrop-blur sm:p-6"
    >
      <h3 id={headingId} className="text-lg font-semibold">
        Deine Einsätze
      </h3>
      {bets.length === 0 ? (
        <p className="text-white/70">Noch keine Einsätze gesetzt.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {bets.map((bet, index) => (
            <li
              key={index}
              className="animate-pop flex items-center justify-between gap-4 rounded-lg bg-white/10 px-3 py-2"
            >
              <span>{`${describeBet(bet)}: ${formatChips(bet.amount)}`}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-full border border-white/40 px-3 py-1 text-sm transition hover:bg-white/10"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="font-mono text-amber-200">{`Gesamteinsatz: ${formatChips(totalStake)}`}</p>
      <button
        type="button"
        disabled={bets.length === 0}
        onClick={onSpin}
        className="rounded-full bg-amber-300 px-6 py-3 text-lg font-bold text-black shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        Drehen
      </button>
    </section>
  );
}
