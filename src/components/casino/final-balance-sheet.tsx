import type { FinalBalance } from "@/lib/casino/final-balance";
import { formatChips } from "@/lib/chips/format-chips";

function formatDifference(amount: number): string {
  return amount > 0 ? `+${formatChips(amount)}` : formatChips(amount);
}

interface FinalBalanceSheetProps {
  balance: FinalBalance;
}

export function FinalBalanceSheet({ balance }: FinalBalanceSheetProps) {
  const rows = [
    { label: "Einzahlung", value: formatChips(balance.deposited) },
    { label: "Endstand", value: formatChips(balance.finalBalance) },
    { label: "Differenz", value: formatDifference(balance.difference) },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Schlussbilanz</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
        {rows.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt>{label}</dt>
            <dd className="text-right font-mono">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
