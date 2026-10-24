import { useState } from "react";
import type { Game } from "@/games/game";
import type { GameRegistry } from "@/games/game-registry";
import { selectGame } from "@/games/game-selection";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";
import { GameMenu } from "./game-menu";

interface GameLobbyProps {
  registry: GameRegistry;
  wallet: Wallet;
  session: CasinoSession;
}

/** Zeigt die Spielauswahl oder das gewaehlte Spiel. */
export function GameLobby({ registry, wallet, session }: GameLobbyProps) {
  const balance = useWalletBalance(wallet);
  const [activeGame, setActiveGame] = useState<Game | null>(null);

  if (activeGame) {
    return (
      <activeGame.Component
        wallet={wallet}
        session={session}
        onExit={() => setActiveGame(null)}
      />
    );
  }

  return (
    <GameMenu
      games={registry.all}
      balance={balance}
      onSelect={(gameId) => setActiveGame(selectGame(registry, gameId, balance))}
    />
  );
}
