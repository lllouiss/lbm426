import type { Game } from "../game";
import { BlackjackGame } from "./blackjack-game";

/** Blackjack, angemeldet in registry.ts. */
export const blackjackGame: Game = {
  id: "blackjack",
  name: "Blackjack",
  description:
    "Schlage 1 bis 5 Computergegner, ohne über 21 zu kommen. Je mehr Gegner, desto höher die Auszahlung.",
  Component: BlackjackGame,
};
