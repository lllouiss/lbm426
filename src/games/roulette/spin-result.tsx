import { formatChips } from "@/lib/chips/format-chips";
import { colorName } from "./bet-label";
import { colorOf, type PocketColor } from "./wheel";

const BALL_STYLES: Record<PocketColor, string> = {
  red: "bg-red-600",
  black: "bg-neutral-900",
  green: "bg-emerald-600",
};

interface SpinResultProps {
  result: number;
  totalStake: number;
  payout: number;
  canPlayAgain: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

function describePayout(totalStake: number, payout: number): string {
  return payout > 0
    ? `Auszahlung: ${formatChips(payout)}`
    : `${formatChips(totalStake)} Einsatz verloren`;
}

export function SpinResult({
  result,
  totalStake,
  payout,
  canPlayAgain,
  onPlayAgain,
  onExit,
}: SpinResultProps) {
  const color = colorOf(result);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        aria-hidden="true"
        className={`animate-pop flex h-24 w-24 items-center justify-center rounded-full border-4 border-white text-4xl font-bold text-white shadow-2xl ${BALL_STYLES[color]}`}
      >
        {result}
      </div>
      <p
        role="status"
        className={`animate-pop rounded-2xl px-8 py-4 text-center text-xl font-bold text-white shadow-2xl ${payout > 0 ? "bg-emerald-600" : "bg-red-700"}`}
      >
        {`Die Kugel liegt auf ${result} (${colorName(color)}). ${describePayout(totalStake, payout)}`}
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
