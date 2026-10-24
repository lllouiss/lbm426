import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { BalanceDisplay } from "./balance-display";
import { Wallet } from "@/lib/wallet/wallet";

describe("BalanceDisplay (US-005)", () => {
  it("zeigt den Jeton-Stand an", () => {
    render(<BalanceDisplay wallet={new Wallet(150)} />);

    expect(screen.getByText("Guthaben: 150 Jetons")).toBeInTheDocument();
  });

  it("zeigt den neuen Stand nach Verlust und Gewinn sofort an", () => {
    const wallet = new Wallet(150);
    render(<BalanceDisplay wallet={wallet} />);

    act(() => wallet.placeBet(50));
    expect(screen.getByText("Guthaben: 100 Jetons")).toBeInTheDocument();

    act(() => wallet.payout(80));
    expect(screen.getByText("Guthaben: 180 Jetons")).toBeInTheDocument();
  });

  it("zeigt in mehreren Anzeigen denselben Stand", () => {
    const wallet = new Wallet();
    render(
      <>
        <BalanceDisplay wallet={wallet} />
        <BalanceDisplay wallet={wallet} />
      </>,
    );

    act(() => wallet.deposit(75));

    expect(screen.getAllByText("Guthaben: 75 Jetons")).toHaveLength(2);
  });
});
