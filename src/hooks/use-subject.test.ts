import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { BaseSubject } from "@/lib/observer/subject";
import { useSubject } from "./use-subject";

/** Minimales Subject mit einem Wert, der sich aendern laesst. */
class Temperature extends BaseSubject<number> {
  value = 20;

  set(value: number): void {
    this.value = value;
    this.notify(value);
  }
}

describe("useSubject", () => {
  it("liefert die aktuelle Momentaufnahme des Subjects", () => {
    const temperature = new Temperature();

    const { result } = renderHook(() =>
      useSubject(temperature, () => temperature.value),
    );

    expect(result.current).toBe(20);
  });

  it("rendert nach jeder Benachrichtigung mit der neuen Momentaufnahme", () => {
    const temperature = new Temperature();
    const { result } = renderHook(() =>
      useSubject(temperature, () => temperature.value),
    );

    act(() => temperature.set(25));
    expect(result.current).toBe(25);

    act(() => temperature.set(18));
    expect(result.current).toBe(18);
  });

  it("meldet sich als Observer an und beim Unmount wieder ab", () => {
    const temperature = new Temperature();
    const subscribe = vi.spyOn(temperature, "subscribe");
    const unsubscribe = vi.spyOn(temperature, "unsubscribe");

    const { unmount } = renderHook(() =>
      useSubject(temperature, () => temperature.value),
    );
    const [observer] = subscribe.mock.calls[0];
    unmount();

    expect(unsubscribe).toHaveBeenCalledWith(observer);
  });
});
