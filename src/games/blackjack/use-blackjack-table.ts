import { useCallback, useState, useSyncExternalStore } from "react";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Observer } from "@/lib/observer/observer";
import type { Wallet } from "@/lib/wallet/wallet";
import { BlackjackTable } from "./blackjack-table";
import type { Card } from "./cards";
import type { BlackjackRound } from "./round";

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
  const subscribe = useCallback(
    (onChange: () => void) => {
      const observer: Observer<BlackjackRound | null> = { update: onChange };
      table.subscribe(observer);
      return () => table.unsubscribe(observer);
    },
    [table],
  );
  const readRevision = () => table.revision;

  useSyncExternalStore(subscribe, readRevision, readRevision);
  return table;
}
