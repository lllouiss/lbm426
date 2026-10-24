"use client";

import { gameRegistry } from "@/games/registry";
import { Casino } from "./casino";

/** Client-Einstieg der Seite: das Casino mit allen angemeldeten Spielen. */
export function CasinoApp() {
  return <Casino registry={gameRegistry} />;
}
