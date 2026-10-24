import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { formatChips } from "@/lib/chips/format-chips";
import type { Wallet } from "@/lib/wallet/wallet";

interface BalanceDisplayProps {
  wallet: Wallet;
}

export function BalanceDisplay({ wallet }: BalanceDisplayProps) {
  const balance = useWalletBalance(wallet);

  return (
    <p aria-live="polite" className="font-mono text-lg">
      Guthaben: {formatChips(balance)}
    </p>
  );
}
