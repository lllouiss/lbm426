import { useState } from "react";
import type { GameRegistry } from "@/games/game-registry";
import { CasinoSession } from "@/lib/casino/casino-session";
import type { FinalBalance } from "@/lib/casino/final-balance";
import { Wallet } from "@/lib/wallet/wallet";
import { BalanceDisplay } from "./balance-display";
import { DepositForm } from "./deposit-form";
import { FinalBalanceSheet } from "./final-balance-sheet";
import { GameLobby } from "./game-lobby";
import { LeaveCasinoButton } from "./leave-casino-button";

/** Ein neuer Casino-Besuch: leeres Wallet und die zugehoerige Session. */
function openCasino() {
  const wallet = new Wallet();
  return { wallet, session: new CasinoSession(wallet) };
}

interface CasinoProps {
  registry: GameRegistry;
}

export function Casino({ registry }: CasinoProps) {
  const [{ wallet, session }] = useState(openCasino);
  const [finalBalance, setFinalBalance] = useState<FinalBalance | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">Casino</h1>
        <BalanceDisplay wallet={wallet} />
      </header>
      <main className="flex flex-col gap-10">
        {finalBalance ? (
          <section className="flex flex-col gap-4">
            <FinalBalanceSheet balance={finalBalance} />
            <p>Deine restlichen Jetons wurden ausbezahlt. Danke für deinen Besuch!</p>
          </section>
        ) : (
          <GameLobby registry={registry} wallet={wallet} session={session}>
            <DepositForm wallet={wallet} />
            <LeaveCasinoButton
              disabled={!session.canLeave}
              onLeave={() => setFinalBalance(session.leave())}
            />
          </GameLobby>
        )}
      </main>
    </div>
  );
}
