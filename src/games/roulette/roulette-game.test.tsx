import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CasinoSession } from "@/lib/casino/casino-session";
import { Wallet } from "@/lib/wallet/wallet";
import { RouletteGame } from "./roulette-game";
import { rouletteGame } from "./index";

function renderGame(landsOn: number, balance = 100) {
  const wallet = new Wallet(balance);
  const session = new CasinoSession(wallet);
  const onExit = vi.fn();
  render(
    <RouletteGame
      wallet={wallet}
      session={session}
      onExit={onExit}
      spinner={() => landsOn}
    />,
  );
  return { wallet, session, onExit };
}

async function bet(amount: string, field: string) {
  const input = screen.getByRole("textbox", { name: "Einsatz" });
  await userEvent.clear(input);
  if (amount) await userEvent.type(input, amount);
  await userEvent.click(screen.getByRole("button", { name: field }));
}

const summary = () => screen.getByRole("region", { name: "Deine Einsätze" });

describe("RouletteGame: Spielregistrierung", () => {
  it("beschreibt das Spiel fuer die Registry", () => {
    expect(rouletteGame.id).toBe("roulette");
    expect(rouletteGame.name).toBe("Roulette");
    expect(rouletteGame.description).not.toBe("");
    expect(rouletteGame.Component).toBeTypeOf("function");
  });
});

describe("RouletteGame: Einsaetze setzen", () => {
  it("zeigt Einsatzfeld, beide Farben und alle Nummern von 0 bis 36", () => {
    renderGame(7);

    expect(screen.getByRole("heading", { name: "Roulette" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Einsatz" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rot" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Schwarz" })).toBeInTheDocument();
    for (let number = 0; number <= 36; number++) {
      expect(
        screen.getByRole("button", { name: `Nummer ${number}` }),
      ).toBeInTheDocument();
    }
  });

  it("zeigt vor dem ersten Einsatz eine leere Uebersicht", () => {
    renderGame(7);

    expect(within(summary()).getByText("Noch keine Einsätze gesetzt.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Drehen" })).toBeDisabled();
  });

  it("kombiniert Farb- und Nummerneinsaetze in der Uebersicht", async () => {
    renderGame(7);

    await bet("10", "Rot");
    await bet("5", "Nummer 17");

    const items = within(summary()).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Rot: 10 Jetons");
    expect(items[1]).toHaveTextContent("Nummer 17: 5 Jetons");
    expect(within(summary()).getByText("Gesamteinsatz: 15 Jetons")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Drehen" })).toBeEnabled();
  });

  it("bucht beim Setzen noch nichts ab", async () => {
    const { wallet } = renderGame(7);

    await bet("10", "Rot");

    expect(wallet.balance).toBe(100);
  });

  it("entfernt einen Einsatz aus der Uebersicht", async () => {
    renderGame(7);
    await bet("10", "Rot");
    await bet("5", "Nummer 17");

    const [first] = within(summary()).getAllByRole("listitem");
    await userEvent.click(within(first).getByRole("button", { name: "Entfernen" }));

    const items = within(summary()).getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent("Nummer 17: 5 Jetons");
  });

  it("lehnt Einsaetze ueber dem Guthaben mit Hinweis ab", async () => {
    renderGame(7, 20);
    await bet("15", "Rot");

    await bet("6", "Schwarz");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Die Einsaetze uebersteigen das Guthaben.",
    );
    expect(within(summary()).getAllByRole("listitem")).toHaveLength(1);
  });

  it.each(["", "abc", "0", "-5", "2.5"])(
    "lehnt den ungueltigen Einsatz '%s' ab",
    async (amount) => {
      renderGame(7);

      await bet(amount, "Rot");

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(within(summary()).queryAllByRole("listitem")).toHaveLength(0);
    },
  );

  it("blendet den Hinweis beim naechsten gueltigen Einsatz aus", async () => {
    renderGame(7);
    await bet("abc", "Rot");

    await bet("10", "Rot");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("kehrt auf Wunsch zur Spielauswahl zurueck", async () => {
    const { onExit } = renderGame(7);

    await userEvent.click(
      screen.getByRole("button", { name: "Zurück zur Spielauswahl" }),
    );

    expect(onExit).toHaveBeenCalledOnce();
  });
});

describe("RouletteGame: Drehen", () => {
  it("zeigt Zahl, Farbe und Auszahlung und bucht ab", async () => {
    const { wallet } = renderGame(17);
    await bet("10", "Rot");
    await bet("5", "Nummer 17");

    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("17 (Schwarz)");
    expect(result).toHaveTextContent("Auszahlung: 180 Jetons");
    expect(wallet.balance).toBe(265);
  });

  it("meldet einen Verlust, wenn kein Einsatz trifft", async () => {
    const { wallet } = renderGame(0);
    await bet("10", "Rot");
    await bet("10", "Schwarz");

    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    const result = screen.getByRole("status");
    expect(result).toHaveTextContent("0 (Grün)");
    expect(result).toHaveTextContent("20 Jetons Einsatz verloren");
    expect(wallet.balance).toBe(80);
  });

  it("nimmt nach dem Dreh keine Einsaetze mehr an", async () => {
    renderGame(7);
    await bet("10", "Rot");

    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    expect(screen.queryByRole("button", { name: "Rot" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Drehen" })).not.toBeInTheDocument();
  });

  it("startet mit «Nochmal spielen» eine neue, leere Runde", async () => {
    renderGame(7);
    await bet("10", "Rot");
    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    await userEvent.click(screen.getByRole("button", { name: "Nochmal spielen" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(within(summary()).getByText("Noch keine Einsätze gesetzt.")).toBeInTheDocument();
  });

  it("sperrt «Nochmal spielen», wenn keine Jetons mehr da sind", async () => {
    renderGame(2, 10);
    await bet("10", "Rot");

    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    expect(screen.getByRole("button", { name: "Nochmal spielen" })).toBeDisabled();
  });

  it("kehrt nach dem Dreh zur Spielauswahl zurueck", async () => {
    const { onExit } = renderGame(7);
    await bet("10", "Rot");
    await userEvent.click(screen.getByRole("button", { name: "Drehen" }));

    await userEvent.click(
      screen.getByRole("button", { name: "Zurück zur Spielauswahl" }),
    );

    expect(onExit).toHaveBeenCalledOnce();
  });
});
