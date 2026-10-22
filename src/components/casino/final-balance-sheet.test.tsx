import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FinalBalanceSheet } from "./final-balance-sheet";
import { createFinalBalance } from "@/lib/casino/final-balance";

function valueOf(label: string) {
  return screen.getByText(label).nextElementSibling;
}

describe("FinalBalanceSheet (US-006)", () => {
  it("zeigt die Ueberschrift «Schlussbilanz»", () => {
    render(<FinalBalanceSheet balance={createFinalBalance(100, 140)} />);

    expect(
      screen.getByRole("heading", { name: "Schlussbilanz" }),
    ).toBeInTheDocument();
  });

  it("zeigt Einzahlung und Endstand in Jetons", () => {
    render(<FinalBalanceSheet balance={createFinalBalance(100, 140)} />);

    expect(valueOf("Einzahlung")).toHaveTextContent("100 Jetons");
    expect(valueOf("Endstand")).toHaveTextContent("140 Jetons");
  });

  it("zeigt einen Gewinn mit Pluszeichen", () => {
    render(<FinalBalanceSheet balance={createFinalBalance(100, 140)} />);

    expect(valueOf("Differenz")).toHaveTextContent("+40 Jetons");
  });

  it("zeigt einen Verlust mit Minuszeichen", () => {
    render(<FinalBalanceSheet balance={createFinalBalance(100, 30)} />);

    expect(valueOf("Differenz")).toHaveTextContent("-70 Jetons");
  });

  it("zeigt eine ausgeglichene Bilanz ohne Vorzeichen", () => {
    render(<FinalBalanceSheet balance={createFinalBalance(100, 100)} />);

    expect(valueOf("Differenz")).toHaveTextContent(/^0 Jetons$/);
  });
});
