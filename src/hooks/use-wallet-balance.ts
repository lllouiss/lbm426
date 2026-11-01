import type { Wallet } from "@/lib/wallet/wallet";
import { useSubject } from "./use-subject";

/**
 * Meldet die Komponente als Observer am Wallet an. Sie wird bei jeder
 * Aenderung des Jeton-Stands neu gerendert, ohne das Wallet abzufragen.
 */
export function useWalletBalance(wallet: Wallet): number {
  return useSubject(wallet, () => wallet.balance);
}
