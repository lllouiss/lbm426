import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { BaseSubject } from "@/lib/observer/subject";
import { useSubjectRevision } from "./use-subject-revision";

/** Minimales Subject, das seine Aenderungen zaehlt. */
class Counter extends BaseSubject<number> {
  revision = 0;

  change(): void {
    this.revision += 1;
    this.notify(this.revision);
  }
}

describe("useSubjectRevision", () => {
  it("liefert den aktuellen Stand des Subjects", () => {
    const counter = new Counter();
    counter.change();

    const { result } = renderHook(() => useSubjectRevision(counter));

    expect(result.current).toBe(1);
  });

  it("rendert nach jeder Benachrichtigung mit dem neuen Stand", () => {
    const counter = new Counter();
    const { result } = renderHook(() => useSubjectRevision(counter));

    act(() => counter.change());
    expect(result.current).toBe(1);

    act(() => counter.change());
    expect(result.current).toBe(2);
  });

  it("meldet sich als Observer an und beim Unmount wieder ab", () => {
    const counter = new Counter();
    const subscribe = vi.spyOn(counter, "subscribe");
    const unsubscribe = vi.spyOn(counter, "unsubscribe");

    const { unmount } = renderHook(() => useSubjectRevision(counter));
    const [observer] = subscribe.mock.calls[0];
    unmount();

    expect(unsubscribe).toHaveBeenCalledWith(observer);
  });
});
