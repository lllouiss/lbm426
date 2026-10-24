import { useCallback, useSyncExternalStore } from "react";
import type { Observer } from "@/lib/observer/observer";
import type { Wallet } from "@/lib/wallet/wallet";

/**
 * Meldet die Komponente als Observer am Wallet an. Sie wird bei jeder
 * Aenderung des Jeton-Stands neu gerendert, ohne das Wallet abzufragen.
 */
export function useWalletBalance(wallet: Wallet): number {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const observer: Observer<number> = { update: onChange };
      wallet.subscribe(observer);
      return () => wallet.unsubscribe(observer);
    },
    [wallet],
  );
  const readBalance = () => wallet.balance;

  return useSyncExternalStore(subscribe, readBalance, readBalance);
}
