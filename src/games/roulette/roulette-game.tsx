import { useWalletBalance } from "@/hooks/use-wallet-balance";
import type { GameProps } from "../game";
import { BetBoard } from "./bet-board";
import { BetSummary } from "./bet-summary";
import { SpinResult } from "./spin-result";
import { useRouletteTable } from "./use-roulette-table";

interface RouletteGameProps extends GameProps {
  /** Liefert die gezogene Zahl; Standard ist ein zufaelliger Dreh. */
  spinner?: () => number;
}

export function RouletteGame({ wallet, session, onExit, spinner }: RouletteGameProps) {
  const table = useRouletteTable(wallet, session, spinner);
  const balance = useWalletBalance(wallet);
  const round = table.round;

  return (
    <section className="felt flex flex-col gap-6 rounded-3xl p-4 shadow-2xl sm:p-8">
      <h2 className="text-center text-3xl font-bold tracking-wide text-white">
        Roulette
      </h2>
      {round.result === null ? (
        <>
          <BetBoard balance={balance} onBet={(bet) => table.placeBet(bet)} />
          <BetSummary
            bets={round.bets}
            totalStake={round.totalStake}
            onRemove={(index) => table.removeBet(index)}
            onSpin={() => table.spin()}
          />
          <button
            type="button"
            onClick={onExit}
            className="self-center rounded-full border border-white/50 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Zurück zur Spielauswahl
          </button>
        </>
      ) : (
        <SpinResult
          result={round.result}
          totalStake={round.totalStake}
          payout={round.payout}
          canPlayAgain={balance > 0}
          onPlayAgain={() => table.newRound()}
          onExit={onExit}
        />
      )}
    </section>
  );
}
