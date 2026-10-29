import { blackjackGame } from "./blackjack";
import { GameRegistry } from "./game-registry";
import { rouletteGame } from "./roulette";

/**
 * Zentrales Register aller Spiele im Casino. Ein neues Spiel wird nur hier
 * angemeldet; Menue und Casino muessen dafuer nicht angepasst werden.
 */
export const gameRegistry = new GameRegistry([
  blackjackGame,
  rouletteGame,
]);
