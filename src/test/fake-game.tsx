import type { Game, GameProps } from "@/games/game";

function FakeGameView({ name, onExit }: GameProps & { name: string }) {
  return (
    <div>
      <p>{name} läuft</p>
      <button type="button" onClick={onExit}>
        Spiel beenden
      </button>
    </div>
  );
}

/** Minimales Spiel fuer Tests: zeigt, dass es laeuft, und kann beendet werden. */
export function createFakeGame(id: string, name = id): Game {
  return {
    id,
    name,
    description: `Beschreibung von ${name}`,
    Component: (props) => <FakeGameView {...props} name={name} />,
  };
}
