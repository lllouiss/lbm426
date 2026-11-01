import { useState } from "react";

/**
 * Fuehrt eine Benutzer-Aktion aus und merkt sich die Meldung, falls die
 * Eingabe abgelehnt wird (RangeError). Andere Fehler werden weitergereicht.
 */
export function useInputError() {
  const [error, setError] = useState<string | null>(null);

  function attempt(action: () => void): void {
    try {
      action();
      setError(null);
    } catch (rejection) {
      if (!(rejection instanceof RangeError)) throw rejection;
      setError(rejection.message);
    }
  }

  return { error, attempt };
}
