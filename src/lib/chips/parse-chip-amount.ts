const WHOLE_NUMBER = /^\d+$/;

/** Liest einen Jeton-Betrag aus einem Eingabefeld; NaN bei ungueltiger Eingabe. */
export function parseChipAmount(text: string): number {
  const trimmed = text.trim();
  return WHOLE_NUMBER.test(trimmed) ? Number(trimmed) : Number.NaN;
}
