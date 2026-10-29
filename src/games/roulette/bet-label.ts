import type { RouletteBet } from "./bets";
import type { PocketColor } from "./wheel";

const COLOR_NAMES: Record<PocketColor, string> = {
  red: "Rot",
  black: "Schwarz",
  green: "Grün",
};

export function colorName(color: PocketColor): string {
  return COLOR_NAMES[color];
}

export function describeBet(bet: RouletteBet): string {
  return bet.type === "color" ? colorName(bet.color) : `Nummer ${bet.number}`;
}
