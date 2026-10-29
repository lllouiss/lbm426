import { useWalletBalance } from "@/hooks/use-wallet-balance";
import type { GameProps } from "../game";
import { BetForm } from "./bet-form";
import type { Card } from "./cards";
import { HandView } from "./hand-view";
import { RoundResult } from "./round-result";
import type { BlackjackRound } from "./round";
import { useBlackjackTable } from "./use-blackjack-table";

interface BlackjackGameProps extends GameProps {
  /** Liefert pro Runde den Stapel; Standard ist ein frisch gemischtes Deck. */
  createDeck?: () => Card[];
}

type Highlight = "win" | "loss" | null;

function playerHighlight(round: BlackjackRound): Highlight {
  if (round.phase === "playing" || round.outcome === "push") return null;
  return round.outcome === "win" ? "win" : "loss";
}

export function BlackjackGame({
  wallet,
  session,
  onExit,
  createDeck,
}: BlackjackGameProps) {
  const table = useBlackjackTable(wallet, session, createDeck);
  const balance = useWalletBalance(wallet);
  const round = table.round;
  const finished = round?.phase === "finished";

  return (
    <section className="felt flex flex-col gap-6 rounded-3xl p-4 shadow-2xl sm:p-8">
      <h2 className="text-center text-3xl font-bold tracking-wide text-white">
        Blackjack
      </h2>
      {!round ? (
        <BetForm
          balance={balance}
          onDeal={(bet, opponents) => table.deal(bet, opponents)}
          onExit={onExit}
        />
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-4">
            {round.opponentHands.map((hand, index) => (
              <HandView
                key={index}
                title={`Gegner ${index + 1}`}
                cards={hand}
                hideSecondCard={!finished}
                showValue={finished}
              />
            ))}
          </div>
          <HandView
            title="Deine Hand"
            cards={round.playerHand}
            highlight={playerHighlight(round)}
          />
          {finished && round.outcome ? (
            <RoundResult
              outcome={round.outcome}
              bet={round.bet}
              payout={round.payout}
              canPlayAgain={balance > 0}
              onPlayAgain={() => table.reset()}
              onExit={onExit}
            />
          ) : (
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => table.hit()}
                className="rounded-full bg-emerald-400 px-8 py-3 text-lg font-bold text-black shadow-lg transition hover:scale-105 active:scale-95"
              >
                Hit
              </button>
              <button
                type="button"
                onClick={() => table.stand()}
                className="rounded-full bg-rose-400 px-8 py-3 text-lg font-bold text-black shadow-lg transition hover:scale-105 active:scale-95"
              >
                Stand
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
