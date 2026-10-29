import { useState } from "react";
import { useSubjectRevision } from "@/hooks/use-subject-revision";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";
import { RouletteTable } from "./roulette-table";

/**
 * Erzeugt den Tisch einmal pro Spielbesuch und meldet die Komponente als
 * Observer an, damit sie bei jeder Aenderung neu gerendert wird.
 */
export function useRouletteTable(
  wallet: Wallet,
  session: CasinoSession,
  spinner?: () => number,
): RouletteTable {
  const [table] = useState(() => new RouletteTable(wallet, session, spinner));
  useSubjectRevision(table);
  return table;
}
