export const MIN_NUMBER = 0;
export const MAX_NUMBER = 36;

export type PocketColor = "red" | "black" | "green";

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);

export function assertValidNumber(number: number): void {
  if (!Number.isInteger(number) || number < MIN_NUMBER || number > MAX_NUMBER) {
    throw new RangeError(
      `Die Zahl muss zwischen ${MIN_NUMBER} und ${MAX_NUMBER} liegen.`,
    );
  }
}

export function colorOf(number: number): PocketColor {
  assertValidNumber(number);
  if (number === 0) return "green";
  return RED_NUMBERS.has(number) ? "red" : "black";
}

/** Dreht das Rad; die Zufallsquelle ist austauschbar. */
export function spinWheel(random: () => number = Math.random): number {
  return MIN_NUMBER + Math.floor(random() * (MAX_NUMBER - MIN_NUMBER + 1));
}
