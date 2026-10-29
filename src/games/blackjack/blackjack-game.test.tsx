import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CasinoSession } from "@/lib/casino/casino-session";
import { Wallet } from "@/lib/wallet/wallet";
import type { Card, Rank } from "./cards";
import { BlackjackGame } from "./blackjack-game";
import { blackjackGame } from "./index";

const deckOf = (...ranks: Rank[]): Card[] =>
  ranks.map((rank) => ({ rank, suit: "spades" }));

function renderGame(deck: Rank[], balance = 100) {
  const wallet = new Wallet(balance);
  const session = new CasinoSession(wallet);
  const onExit = vi.fn();
  render(
    <BlackjackGame
      wallet={wallet}
      session={session}
      onExit={onExit}
      createDeck={() => deckOf(...deck)}
    />,
  );
  return { wallet, session, onExit };
}

async function deal(bet: string, opponents = 1) {
  const betInput = screen.getByRole("textbox", { name: "Einsatz" });
  await userEvent.clear(betInput);
  await userEvent.type(betInput, bet);
  await userEvent.click(
    screen.getByRole("radio", {
      name: opponents === 1 ? "1 Gegner" : `${opponents} Gegner`,
    }),
  );
  await userEvent.click(
    screen.getByRole("button", { name: "Karten austeilen" }),
  );
}

describe("BlackjackGame: Spielregistrierung", () => {
  it("beschreibt das Spiel fuer die Registry", () => {
    expect(blackjackGame.id).toBe("blackjack");
    expect(blackjackGame.name).toBe("Blackjack");
    expect(blackjackGame.description).not.toBe("");
    expect(blackjackGame.Component).toBeTypeOf("function");
  });
});

describe("BlackjackGame: Einsatz und Gegnerzahl", () => {
  it("zeigt zuerst Einsatz, Gegnerzahl und Auszahlung", () => {
    renderGame(["10", "9", "10", "7"]);

    expect(screen.getByRole("heading", { name: "Blackjack" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Einsatz" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByText("Auszahlung bei Sieg: 2:1")).toBeInTheDocument();
  });

  it("zeigt den hoeheren Auszahlungsfaktor bei mehr Gegnern", async () => {
    renderGame(["10", "9", "10", "7"]);

    await userEvent.click(screen.getByRole("radio", { name: "4 Gegner" }));

    expect(screen.getByText("Auszahlung bei Sieg: 5:1")).toBeInTheDocument();
  });

  it("uebernimmt den Einsatz per Schnellwahl", async () => {
    renderGame(["10", "9", "10", "7"]);

    await userEvent.click(screen.getByRole("button", { name: "Einsatz 50" }));

    expect(screen.getByRole("textbox", { name: "Einsatz" })).toHaveValue("50");
  });

  it("lehnt einen Einsatz ueber dem Guthaben mit Hinweis ab", async () => {
    const { wallet } = renderGame(["10", "9", "10", "7"], 20);

    await deal("50");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Der Einsatz uebersteigt das Guthaben.",
    );
    expect(wallet.balance).toBe(20);
  });

  it.each(["", "abc", "0", "-5", "2.5"])(
    "lehnt den ungueltigen Einsatz '%s' ab",
    async (bet) => {
      const { wallet } = renderGame(["10", "9", "10", "7"]);

      await deal(bet);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(wallet.balance).toBe(100);
    },
  );

  it("kehrt auf Wunsch zur Spielauswahl zurueck", async () => {
    const { onExit } = renderGame(["10", "9", "10", "7"]);

    await userEvent.click(
      screen.getByRole("button", { name: "Zurück zur Spielauswahl" }),
    );

    expect(onExit).toHaveBeenCalledOnce();
  });
});

describe("BlackjackGame: laufende Runde", () => {
  it("zeigt die eigene Hand mit Wert und Hit/Stand", async () => {
    renderGame(["10", "9", "10", "7"]);

    await deal("10");

    const hand = screen.getByRole("region", { name: "Deine Hand" });
    expect(within(hand).getAllByRole("img")).toHaveLength(2);
    expect(within(hand).getByText("Wert 19")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stand" })).toBeInTheDocument();
  });

  it("zeigt die zweite Karte der Gegner verdeckt und ihren Wert nicht", async () => {
    renderGame(["10", "9", "10", "7"]);

    await deal("10");

    const opponent = screen.getByRole("region", { name: "Gegner 1" });
    expect(
      within(opponent).getByRole("img", { name: "Pik 10" }),
    ).toBeInTheDocument();
    expect(
      within(opponent).getByRole("img", { name: "Verdeckte Karte" }),
    ).toBeInTheDocument();
    expect(within(opponent).queryByText(/Wert/)).not.toBeInTheDocument();
  });

  it("zeigt den abgebuchten Einsatz und blockiert den Ausgang bis zum Ende", async () => {
    const { wallet } = renderGame(["10", "9", "10", "7"]);

    await deal("30");

    expect(wallet.balance).toBe(70);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Zurück zur Spielauswahl" }),
    ).not.toBeInTheDocument();
  });

  it("gibt bei Hit eine weitere Karte", async () => {
    renderGame(["2", "3", "10", "7", "4"]);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Hit" }));

    const hand = screen.getByRole("region", { name: "Deine Hand" });
    expect(within(hand).getAllByRole("img")).toHaveLength(3);
    expect(within(hand).getByText("Wert 9")).toBeInTheDocument();
  });
});

describe("BlackjackGame: Rundenende", () => {
  it("zeigt Sieg, Auszahlung und deckt die Gegnerkarten auf", async () => {
    const { wallet } = renderGame(["10", "9", "10", "7"]);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    expect(screen.getByRole("status")).toHaveTextContent(/Gewonnen/);
    expect(screen.getByRole("status")).toHaveTextContent("20 Jetons");
    expect(wallet.balance).toBe(110);
    const opponent = screen.getByRole("region", { name: "Gegner 1" });
    expect(within(opponent).getByText("Wert 17")).toBeInTheDocument();
    expect(
      within(opponent).queryByRole("img", { name: "Verdeckte Karte" }),
    ).not.toBeInTheDocument();
  });

  it("zeigt eine Niederlage", async () => {
    const { wallet } = renderGame(["10", "8", "10", "9"]);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    expect(screen.getByRole("status")).toHaveTextContent(/Verloren/);
    expect(wallet.balance).toBe(90);
  });

  it("zeigt einen Gleichstand", async () => {
    const { wallet } = renderGame(["10", "8", "10", "8"]);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    expect(screen.getByRole("status")).toHaveTextContent(/Unentschieden/);
    expect(wallet.balance).toBe(100);
  });

  it("zeigt bei ueber 21 sofort die Niederlage ohne Stand", async () => {
    renderGame(["K", "Q", "2", "3", "5"]);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Hit" }));

    expect(screen.getByRole("status")).toHaveTextContent(/Verloren/);
    expect(
      within(screen.getByRole("region", { name: "Deine Hand" })).getByText(
        "Überkauft",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hit" })).not.toBeInTheDocument();
  });

  it("startet nach 'Nochmal spielen' wieder mit der Einsatzwahl", async () => {
    const { session } = renderGame(["10", "8", "10", "9"]);
    await deal("10");
    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    await userEvent.click(screen.getByRole("button", { name: "Nochmal spielen" }));

    expect(screen.getByRole("textbox", { name: "Einsatz" })).toBeInTheDocument();
    expect(session.isRoundInProgress).toBe(false);
  });

  it("kehrt nach Rundenende zur Spielauswahl zurueck", async () => {
    const { onExit } = renderGame(["10", "8", "10", "9"]);
    await deal("10");
    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Zurück zur Spielauswahl" }),
    );

    expect(onExit).toHaveBeenCalledOnce();
  });

  it("bietet bei zu wenig Guthaben kein weiteres Spiel an", async () => {
    renderGame(["10", "8", "10", "9"], 10);
    await deal("10");

    await userEvent.click(screen.getByRole("button", { name: "Stand" }));

    expect(
      screen.getByRole("button", { name: "Nochmal spielen" }),
    ).toBeDisabled();
  });
});
