import { useState } from "react";
import { useSubjectRevision } from "@/hooks/use-subject-revision";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";
import { BlackjackTable } from "./blackjack-table";
import type { Card } from "./cards";

/**
 * Erzeugt den Tisch einmal pro Spielbesuch und meldet die Komponente als
 * Observer an, damit sie bei jeder Aenderung neu gerendert wird.
 */
export function useBlackjackTable(
  wallet: Wallet,
  session: CasinoSession,
  nextDeck?: () => Card[],
): BlackjackTable {
  const [table] = useState(() => new BlackjackTable(wallet, session, nextDeck));
  useSubjectRevision(table);
  return table;
}
