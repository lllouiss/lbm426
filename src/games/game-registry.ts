import type { Game } from "./game";

/**
 * Verwaltet die verfuegbaren Spiele. Neue Spiele werden nur angemeldet,
 * das Register selbst bleibt unveraendert (Open/Closed).
 */
export class GameRegistry {
  private readonly games = new Map<string, Game>();

  constructor(games: readonly Game[] = []) {
    games.forEach((game) => this.register(game));
  }

  /** Alle Spiele in der Reihenfolge der Anmeldung. */
  get all(): readonly Game[] {
    return [...this.games.values()];
  }

  register(game: Game): void {
    if (this.games.has(game.id)) {
      throw new Error(`Ein Spiel mit der ID "${game.id}" ist bereits registriert.`);
    }
    this.games.set(game.id, game);
  }

  get(id: string): Game {
    const game = this.games.get(id);
    if (!game) {
      throw new RangeError(`Unbekanntes Spiel: "${id}".`);
    }
    return game;
  }
}
