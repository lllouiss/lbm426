import { useState, type SubmitEvent } from "react";
import { formatChips } from "@/lib/chips/format-chips";
import { MAX_OPPONENTS, MIN_OPPONENTS, payoutFactor } from "./rules";

const QUICK_BETS = [10, 50, 100];
const WHOLE_NUMBER = /^\d+$/;
const OPPONENT_OPTIONS = Array.from(
  { length: MAX_OPPONENTS - MIN_OPPONENTS + 1 },
  (_, index) => MIN_OPPONENTS + index,
);

interface BetFormProps {
  balance: number;
  onDeal: (bet: number, opponentCount: number) => void;
  onExit: () => void;
}

function parseBet(text: string): number {
  const trimmed = text.trim();
  return WHOLE_NUMBER.test(trimmed) ? Number(trimmed) : Number.NaN;
}

export function BetForm({ balance, onDeal, onExit }: BetFormProps) {
  const [bet, setBet] = useState("");
  const [opponentCount, setOpponentCount] = useState(MIN_OPPONENTS);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      onDeal(parseBet(bet), opponentCount);
    } catch (rejection) {
      if (!(rejection instanceof RangeError)) throw rejection;
      setError(rejection.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-rise mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl bg-black/35 p-6 text-white shadow-xl backdrop-blur"
    >
      <label className="flex flex-col gap-2 font-medium">
        Einsatz
        <input
          value={bet}
          onChange={(event) => setBet(event.target.value)}
          inputMode="numeric"
          placeholder="Anzahl Jetons"
          className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-amber-300 focus:outline-none"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        {[...QUICK_BETS, balance].map((amount, index) => (
          <button
            key={index}
            type="button"
            disabled={amount > balance || amount <= 0}
            aria-label={`Einsatz ${index === QUICK_BETS.length ? "Max" : amount}`}
            onClick={() => setBet(String(amount))}
            className="chip flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold transition hover:-translate-y-1 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            {index === QUICK_BETS.length ? "Max" : amount}
          </button>
        ))}
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-medium">Anzahl Gegner</legend>
        <div className="flex flex-wrap gap-2">
          {OPPONENT_OPTIONS.map((count) => (
            <label key={count} className="cursor-pointer">
              <input
                type="radio"
                name="opponents"
                checked={opponentCount === count}
                onChange={() => setOpponentCount(count)}
                aria-label={`${count} Gegner`}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 font-bold transition peer-checked:scale-110 peer-checked:border-amber-300 peer-checked:bg-amber-300 peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-white"
              >
                {count}
              </span>
            </label>
          ))}
        </div>
        <p
          key={opponentCount}
          aria-live="polite"
          className="animate-pop font-mono text-amber-200"
        >
          Auszahlung bei Sieg: {payoutFactor(opponentCount)}:1
        </p>
      </fieldset>
      {error && (
        <p role="alert" className="animate-shake rounded-lg bg-red-700 px-3 py-2">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-amber-300 px-6 py-3 font-bold text-black shadow-lg transition hover:scale-105 active:scale-95"
        >
          Karten austeilen
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-white/50 px-5 py-3 font-medium transition hover:bg-white/10"
        >
          Zurück zur Spielauswahl
        </button>
      </div>
      <p className="text-sm text-white/70">
        Verfügbar: {formatChips(balance)}
      </p>
    </form>
  );
}
