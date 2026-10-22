import type { Game } from "./game";
import type { GameRegistry } from "./game-registry";

/** Ohne Jetons kann kein Spiel gestartet werden. */
export function canStartGame(balance: number): boolean {
  return balance > 0;
}

/**
 * Waehlt ein Spiel aus dem Register. Unbekannte IDs und ein Start ohne
 * Jetons werden abgewiesen.
 */
export function selectGame(
  registry: GameRegistry,
  gameId: string,
  balance: number,
): Game {
  const game = registry.get(gameId);
  if (!canStartGame(balance)) {
    throw new Error("Ohne Jetons kann kein Spiel gestartet werden.");
  }
  return game;
}
