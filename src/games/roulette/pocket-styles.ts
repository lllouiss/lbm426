import type { PocketColor } from "./wheel";

/** Hintergrundfarbe eines Roulette-Feldes, gleich im Einsatzfeld und im Ergebnis. */
export const POCKET_STYLES: Record<PocketColor, string> = {
  red: "bg-red-600",
  black: "bg-neutral-900",
  green: "bg-emerald-600",
};
