import type { Game } from "@/games/game";
import { canStartGame } from "@/games/game-selection";

interface GameMenuProps {
  games: readonly Game[];
  balance: number;
  onSelect: (gameId: string) => void;
}

export function GameMenu({ games, balance, onSelect }: GameMenuProps) {
  const startBlocked = !canStartGame(balance);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Spielauswahl</h2>
      {startBlocked && (
        <p role="status">
          Du hast keine Jetons. Wandle zuerst einen Betrag in Jetons um.
        </p>
      )}
      {games.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {games.map((game) => (
            <li
              key={game.id}
              className="flex items-center justify-between gap-6 rounded-lg border p-4"
            >
              <div>
                <h3 className="text-lg font-medium">{game.name}</h3>
                <p className="text-sm opacity-75">{game.description}</p>
              </div>
              <button
                type="button"
                disabled={startBlocked}
                onClick={() => onSelect(game.id)}
                className="rounded-full border px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                {game.name} spielen
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Zurzeit sind keine Spiele verfügbar.</p>
      )}
    </section>
  );
}
