import type { Game } from "../game";
import { RouletteGame } from "./roulette-game";

/** Roulette, angemeldet in registry.ts. */
export const rouletteGame: Game = {
  id: "roulette",
  name: "Roulette",
  description:
    "Setze auf Rot, Schwarz oder einzelne Zahlen, auch auf mehrere Felder in derselben Runde. Farbe zahlt 1:1, eine Zahl 35:1.",
  Component: RouletteGame,
};
