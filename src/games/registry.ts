import { GameRegistry } from "./game-registry";

/**
 * Zentrales Register aller Spiele im Casino. Ein neues Spiel wird nur hier
 * angemeldet; Menue und Casino muessen dafuer nicht angepasst werden.
 */
export const gameRegistry = new GameRegistry([
  // US-003: Blackjack, US-004: Roulette
]);
