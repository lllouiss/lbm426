import { formatChips } from "@/lib/chips/format-chips";
import { Confetti } from "./confetti";
import type { RoundOutcome } from "./round";

interface RoundResultProps {
  outcome: RoundOutcome;
  bet: number;
  payout: number;
  canPlayAgain: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

const HEADLINES: Record<RoundOutcome, string> = {
  win: "Gewonnen!",
  push: "Unentschieden",
  loss: "Verloren",
};

const STYLES: Record<RoundOutcome, string> = {
  win: "bg-emerald-600",
  push: "bg-slate-600",
  loss: "bg-red-700",
};

function describePayout(outcome: RoundOutcome, bet: number, payout: number) {
  if (outcome === "win") return `Auszahlung: ${formatChips(payout)}`;
  if (outcome === "push") return `Einsatz zurück: ${formatChips(bet)}`;
  return `${formatChips(bet)} Einsatz verloren`;
}

export function RoundResult({
  outcome,
  bet,
  payout,
  canPlayAgain,
  onPlayAgain,
  onExit,
}: RoundResultProps) {
  return (
    <div className="relative flex flex-col items-center gap-4">
      {outcome === "win" && <Confetti />}
      <p
        role="status"
        className={`animate-pop rounded-2xl px-8 py-4 text-center text-xl font-bold text-white shadow-2xl ${STYLES[outcome]}`}
      >
        {HEADLINES[outcome]} {describePayout(outcome, bet, payout)}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={!canPlayAgain}
          onClick={onPlayAgain}
          className="rounded-full bg-amber-300 px-6 py-3 font-bold text-black shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          Nochmal spielen
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-white/50 px-5 py-3 font-medium text-white transition hover:bg-white/10"
        >
          Zurück zur Spielauswahl
        </button>
      </div>
    </div>
  );
}
