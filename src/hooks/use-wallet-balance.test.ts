import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useWalletBalance } from "./use-wallet-balance";
import { Wallet } from "@/lib/wallet/wallet";

describe("useWalletBalance (US-005)", () => {
  it("liefert den aktuellen Stand des Wallets", () => {
    const { result } = renderHook(() => useWalletBalance(new Wallet(80)));

    expect(result.current).toBe(80);
  });

  it("liefert nach jedem Gewinn und Verlust sofort den neuen Stand", () => {
    const wallet = new Wallet(100);
    const { result } = renderHook(() => useWalletBalance(wallet));

    act(() => wallet.placeBet(30));
    expect(result.current).toBe(70);

    act(() => wallet.payout(60));
    expect(result.current).toBe(130);

    act(() => wallet.deposit(20));
    expect(result.current).toBe(150);
  });

  it("meldet sich als Observer am Wallet an und beim Unmount wieder ab", () => {
    const wallet = new Wallet(50);
    const subscribe = vi.spyOn(wallet, "subscribe");
    const unsubscribe = vi.spyOn(wallet, "unsubscribe");

    const { unmount } = renderHook(() => useWalletBalance(wallet));
    const [observer] = subscribe.mock.calls[0];
    unmount();

    expect(unsubscribe).toHaveBeenCalledWith(observer);
  });

  it("erlaubt mehrere Beobachter am selben Wallet", () => {
    const wallet = new Wallet(10);
    const first = renderHook(() => useWalletBalance(wallet));
    const second = renderHook(() => useWalletBalance(wallet));

    act(() => wallet.deposit(40));

    expect(first.result.current).toBe(50);
    expect(second.result.current).toBe(50);
  });
});
