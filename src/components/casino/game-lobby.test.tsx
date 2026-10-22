import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameLobby } from "./game-lobby";
import type { Game, GameProps } from "@/games/game";
import { GameRegistry } from "@/games/game-registry";
import { CasinoSession } from "@/lib/casino/casino-session";
import { Wallet } from "@/lib/wallet/wallet";
import { createFakeGame } from "@/test/fake-game";

function renderLobby(balance: number, games: Game[]) {
  const wallet = new Wallet(balance);
  const session = new CasinoSession(wallet);
  render(
    <GameLobby
      registry={new GameRegistry(games)}
      wallet={wallet}
      session={session}
      balance={balance}
    />,
  );
  return { wallet, session };
}

const blackjack = createFakeGame("blackjack", "Blackjack");
const roulette = createFakeGame("roulette", "Roulette");

describe("GameLobby (US-002)", () => {
  it("zeigt zu Beginn die Spielauswahl mit allen Spielen", () => {
    renderLobby(100, [blackjack, roulette]);

    expect(
      screen.getByRole("heading", { name: "Spielauswahl" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("startet das gewaehlte Spiel anstelle der Auswahl", async () => {
    renderLobby(100, [blackjack, roulette]);

    await userEvent.click(
      screen.getByRole("button", { name: "Roulette spielen" }),
    );

    expect(screen.getByText("Roulette läuft")).toBeInTheDocument();
    expect(screen.queryByText("Blackjack läuft")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Spielauswahl" }),
    ).not.toBeInTheDocument();
  });

  it("uebergibt dem Spiel Wallet und Session", async () => {
    const SpyGame = vi.fn<(props: GameProps) => ReactNode>(() => (
      <p>Spion läuft</p>
    ));
    const spy: Game = { ...createFakeGame("spion", "Spion"), Component: SpyGame };
    const { wallet, session } = renderLobby(100, [spy]);

    await userEvent.click(screen.getByRole("button", { name: "Spion spielen" }));

    const props = SpyGame.mock.calls[0][0];
    expect(props.wallet).toBe(wallet);
    expect(props.session).toBe(session);
  });

  it("kehrt nach dem Spiel zur Auswahl zurueck", async () => {
    renderLobby(100, [blackjack, roulette]);

    await userEvent.click(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Spiel beenden" }));

    expect(
      screen.getByRole("heading", { name: "Spielauswahl" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Blackjack läuft")).not.toBeInTheDocument();
  });

  it("startet bei 0 Jetons kein Spiel", async () => {
    renderLobby(0, [blackjack]);

    await userEvent.click(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    );

    expect(screen.queryByText("Blackjack läuft")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Spielauswahl" }),
    ).toBeInTheDocument();
  });
});
