import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameMenu } from "./game-menu";
import { createFakeGame } from "@/test/fake-game";

const games = [
  createFakeGame("blackjack", "Blackjack"),
  createFakeGame("roulette", "Roulette"),
];

describe("GameMenu (US-002)", () => {
  it("zeigt die Ueberschrift «Spielauswahl»", () => {
    render(<GameMenu games={games} balance={100} onSelect={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Spielauswahl" }),
    ).toBeInTheDocument();
  });

  it("listet alle registrierten Spiele mit Beschreibung", () => {
    render(<GameMenu games={games} balance={100} onSelect={() => {}} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Blackjack" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Beschreibung von Roulette")).toBeInTheDocument();
  });

  it("ruft beim Klick onSelect mit der ID des Spiels auf", async () => {
    const onSelect = vi.fn();
    render(<GameMenu games={games} balance={100} onSelect={onSelect} />);

    await userEvent.click(
      screen.getByRole("button", { name: "Roulette spielen" }),
    );

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("roulette");
  });

  it("zeigt keinen Hinweis, solange Jetons vorhanden sind", () => {
    render(<GameMenu games={games} balance={100} onSelect={() => {}} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  describe("bei 0 Jetons", () => {
    it("blockiert den Start aller Spiele", async () => {
      const onSelect = vi.fn();
      render(<GameMenu games={games} balance={0} onSelect={onSelect} />);

      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        await userEvent.click(button);
        expect(button).toBeDisabled();
      }

      expect(onSelect).not.toHaveBeenCalled();
    });

    it("erklaert, warum kein Spiel gestartet werden kann", () => {
      render(<GameMenu games={games} balance={0} onSelect={() => {}} />);

      expect(screen.getByRole("status")).toHaveTextContent(/keine Jetons/i);
    });
  });

  it("zeigt einen Hinweis, wenn keine Spiele registriert sind", () => {
    render(<GameMenu games={[]} balance={100} onSelect={() => {}} />);

    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.getByText(/keine Spiele verfügbar/i)).toBeInTheDocument();
  });
});
