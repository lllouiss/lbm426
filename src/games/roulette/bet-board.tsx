import { useState } from "react";
import { formatChips } from "@/lib/chips/format-chips";
import { parseChipAmount } from "@/lib/chips/parse-chip-amount";
import type { BetColor, RouletteBet } from "./bets";
import { colorName } from "./bet-label";
import { MAX_NUMBER, colorOf, type PocketColor } from "./wheel";

const NUMBERS = Array.from({ length: MAX_NUMBER }, (_, index) => index + 1);
const BET_COLORS: BetColor[] = ["red", "black"];

const FIELD_STYLES: Record<PocketColor, string> = {
  red: "bg-red-600",
  black: "bg-neutral-900",
  green: "bg-emerald-600",
};

const FIELD_BUTTON =
  "rounded-md border border-white/40 font-bold text-white shadow transition hover:-translate-y-0.5 hover:ring-2 hover:ring-amber-300 active:scale-95";

interface BetBoardProps {
  balance: number;
  onBet: (bet: RouletteBet) => void;
}

export function BetBoard({ balance, onBet }: BetBoardProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  function place(createBet: (amount: number) => RouletteBet) {
    try {
      onBet(createBet(parseChipAmount(amount)));
      setError(null);
    } catch (rejection) {
      if (!(rejection instanceof RangeError)) throw rejection;
      setError(rejection.message);
    }
  }

  function numberField(number: number) {
    return (
      <button
        key={number}
        type="button"
        aria-label={`Nummer ${number}`}
        onClick={() => place((chips) => ({ type: "number", number, amount: chips }))}
        className={`${FIELD_BUTTON} ${FIELD_STYLES[colorOf(number)]} h-10`}
      >
        {number}
      </button>
    );
  }

  return (
    <div className="animate-rise flex flex-col gap-4 rounded-2xl bg-black/35 p-4 text-white shadow-xl backdrop-blur sm:p-6">
      <label className="flex flex-col gap-2 font-medium">
        Einsatz
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="numeric"
          placeholder="Jetons pro Feld"
          className="rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-amber-300 focus:outline-none"
        />
      </label>
      <p className="text-sm text-white/70">
        Wähle danach ein Feld. Verfügbar: {formatChips(balance)}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {BET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => place((chips) => ({ type: "color", color, amount: chips }))}
            className={`${FIELD_BUTTON} ${FIELD_STYLES[color]} py-3 text-lg`}
          >
            {colorName(color)}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
        <div className="col-span-6 grid sm:col-span-12">{numberField(0)}</div>
        {NUMBERS.map(numberField)}
      </div>
      {error && (
        <p role="alert" className="animate-shake rounded-lg bg-red-700 px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
