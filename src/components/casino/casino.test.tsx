import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Casino } from "./casino";
import type { Game } from "@/games/game";
import { GameRegistry } from "@/games/game-registry";
import { createFakeGame } from "@/test/fake-game";

/** Testspiel, das 50 Jetons einsetzt, verliert und zur Auswahl zurueckkehrt. */
const losingGame: Game = {
  ...createFakeGame("verlust", "Verlust"),
  Component: ({ wallet, onExit }) => (
    <button
      type="button"
      onClick={() => {
        wallet.placeBet(50);
        onExit();
      }}
    >
      50 Jetons verlieren
    </button>
  ),
};

function renderCasino() {
  render(
    <Casino
      registry={
        new GameRegistry([createFakeGame("blackjack", "Blackjack"), losingGame])
      }
    />,
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

describe("Casino verlassen (US-006)", () => {
  function leaveCasino() {
    return userEvent.click(screen.getByRole("button", { name: "Aufhören" }));
  }

  function valueOf(label: string) {
    return screen.getByText(label).nextElementSibling;
  }

  it("bietet im Hauptmenue «Aufhören» an", () => {
    renderCasino();

    expect(screen.getByRole("button", { name: "Aufhören" })).toBeEnabled();
  });

  it("zeigt nach «Aufhören» die Schlussbilanz mit Einzahlung, Endstand und Differenz", async () => {
    renderCasino();
    await depositChips("200");
    await userEvent.click(screen.getByRole("button", { name: "Verlust spielen" }));
    await userEvent.click(
      screen.getByRole("button", { name: "50 Jetons verlieren" }),
    );

    await leaveCasino();

    expect(
      screen.getByRole("heading", { name: "Schlussbilanz" }),
    ).toBeInTheDocument();
    expect(valueOf("Einzahlung")).toHaveTextContent("200 Jetons");
    expect(valueOf("Endstand")).toHaveTextContent("150 Jetons");
    expect(valueOf("Differenz")).toHaveTextContent("-50 Jetons");
  });

  it("zahlt die restlichen Jetons aus", async () => {
    renderCasino();
    await depositChips("120");

    await leaveCasino();

    expect(screen.getByText(/restlichen Jetons wurden ausbezahlt/)).toBeInTheDocument();
    expect(screen.getByText("Guthaben: 0 Jetons")).toBeInTheDocument();
  });

  it("beendet den Besuch: Spielauswahl, Einzahlung und «Aufhören» verschwinden", async () => {
    renderCasino();
    await depositChips("120");

    await leaveCasino();

    expect(
      screen.queryByRole("heading", { name: "Spielauswahl" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Betrag" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Aufhören" }),
    ).not.toBeInTheDocument();
  });

  it("stuerzt auch ohne Einzahlung nicht ab", async () => {
    renderCasino();

    await leaveCasino();

    expect(valueOf("Einzahlung")).toHaveTextContent("0 Jetons");
    expect(valueOf("Differenz")).toHaveTextContent("0 Jetons");
  });

  it("ist waehrend eines Spiels nicht waehlbar", async () => {
    renderCasino();
    await depositChips("100");

    await userEvent.click(
      screen.getByRole("button", { name: "Blackjack spielen" }),
    );

    expect(
      screen.queryByRole("button", { name: "Aufhören" }),
    ).not.toBeInTheDocument();
  });
});
