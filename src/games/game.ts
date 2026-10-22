import type { ComponentType } from "react";
import type { CasinoSession } from "@/lib/casino/casino-session";
import type { Wallet } from "@/lib/wallet/wallet";

/** Was jedes Spiel vom Casino erhaelt. */
export interface GameProps {
  wallet: Wallet;
  /** Spiele melden laufende Runden ueber startRound()/finishRound(). */
  session: CasinoSession;
  /** Kehrt nach dem Spiel zur Spielauswahl zurueck. */
  onExit: () => void;
}

/**
 * Strategy-Pattern: Jedes Spiel kapselt seine Regeln und seinen Ablauf
 * hinter dieser Schnittstelle. Das Casino kennt nur das Interface, nie ein
 * konkretes Spiel.
 */
export interface Game {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly Component: ComponentType<GameProps>;
}
