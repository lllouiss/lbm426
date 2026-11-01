import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useInputError } from "./use-input-error";

function rejectInput(): never {
  throw new RangeError("Der Betrag muss eine positive ganze Zahl sein.");
}

describe("useInputError", () => {
  it("hat zu Beginn keine Fehlermeldung", () => {
    const { result } = renderHook(() => useInputError());

    expect(result.current.error).toBeNull();
  });

  it("fuehrt eine gueltige Aktion aus", () => {
    const { result } = renderHook(() => useInputError());
    let executed = false;

    act(() => result.current.attempt(() => (executed = true)));

    expect(executed).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("merkt sich die Meldung, wenn die Eingabe abgelehnt wird", () => {
    const { result } = renderHook(() => useInputError());

    act(() => result.current.attempt(rejectInput));

    expect(result.current.error).toBe(
      "Der Betrag muss eine positive ganze Zahl sein.",
    );
  });

  it("entfernt die Meldung nach einer gueltigen Aktion", () => {
    const { result } = renderHook(() => useInputError());
    act(() => result.current.attempt(rejectInput));

    act(() => result.current.attempt(() => {}));

    expect(result.current.error).toBeNull();
  });

  it("reicht andere Fehler weiter", () => {
    const { result } = renderHook(() => useInputError());

    expect(() =>
      act(() =>
        result.current.attempt(() => {
          throw new Error("Programmfehler");
        }),
      ),
    ).toThrow("Programmfehler");
  });
});
