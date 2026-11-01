import { describe, expect, it, vi } from "vitest";
import { RevisionedSubject } from "./revisioned-subject";

/** Minimales Subject, das bei jeder Aenderung seinen Wert veroeffentlicht. */
class Counter extends RevisionedSubject<number> {
  private value = 0;

  increment(): void {
    this.value += 1;
    this.publish(this.value);
  }
}

describe("RevisionedSubject", () => {
  it("startet mit der Revision 0", () => {
    expect(new Counter().revision).toBe(0);
  });

  it("erhoeht die Revision bei jeder Veroeffentlichung", () => {
    const counter = new Counter();

    counter.increment();
    counter.increment();

    expect(counter.revision).toBe(2);
  });

  it("benachrichtigt alle Observer mit den veroeffentlichten Daten", () => {
    const counter = new Counter();
    const first = vi.fn();
    const second = vi.fn();
    counter.subscribe({ update: first });
    counter.subscribe({ update: second });

    counter.increment();

    expect(first).toHaveBeenCalledWith(1);
    expect(second).toHaveBeenCalledWith(1);
  });
});
