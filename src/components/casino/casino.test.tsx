import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Casino } from "./casino";
import { GameRegistry } from "@/games/game-registry";
import { createFakeGame } from "@/test/fake-game";

function renderCasino() {
  render(
    <Casino registry={new GameRegistry([createFakeGame("blackjack", "Blackjack")])} />,
  );
}

async function depositChips(amount: string) {
  await userEvent.type(screen.getByRole("textbox", { name: "Betrag" }), amount);
  await userEvent.click(
    screen.getByRole("button", { name: "In Jetons umwandeln" }),
  );
}

describe("Casino (US-001)", () => {
  it("startet mit 0 Jetons, Einzahlung und gesperrter Spielauswahl", () => {
    renderCasino();

    expect(screen.getByRole("heading", { name: "Casino" })).toBeInTheDocument();
    expect(screen.getByText("Guthaben: 0 Jetons")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Betrag" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    ).toBeDisabled();
  });

  it("gibt nach dem Umwandeln eines Betrags die Spiele frei", async () => {
    renderCasino();

    await depositChips("200");

    expect(screen.getByText("Guthaben: 200 Jetons")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    ).toBeEnabled();
  });

  it("lehnt einen ungueltigen Betrag ab und laesst die Spiele gesperrt", async () => {
    renderCasino();

    await depositChips("0");

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Guthaben: 0 Jetons")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    ).toBeDisabled();
  });

  it("zeigt den Kontostand auch waehrend eines Spiels", async () => {
    renderCasino();
    await depositChips("100");

    await userEvent.click(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    );

    expect(screen.getByText("Blackjack läuft")).toBeInTheDocument();
    expect(screen.getByText("Guthaben: 100 Jetons")).toBeInTheDocument();
  });

  it("blendet die Einzahlung waehrend eines Spiels aus und danach wieder ein", async () => {
    renderCasino();
    await depositChips("100");

    await userEvent.click(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    );
    expect(
      screen.queryByRole("textbox", { name: "Betrag" }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Spiel beenden" }));
    expect(screen.getByRole("textbox", { name: "Betrag" })).toBeInTheDocument();
  });
});
