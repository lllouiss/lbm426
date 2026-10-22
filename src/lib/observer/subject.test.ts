import { describe, expect, it, vi } from "vitest";
import { BaseSubject } from "./subject";
import type { Observer } from "./observer";

function createObserver<T>() {
  const update = vi.fn<(data: T) => void>();
  const observer: Observer<T> = { update };
  return { observer, update };
}

describe("BaseSubject (Observer-Pattern)", () => {
  it("benachrichtigt einen angemeldeten Observer mit den Daten", () => {
    const subject = new BaseSubject<number>();
    const { observer, update } = createObserver<number>();
    subject.subscribe(observer);

    subject.notify(42);

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(42);
  });

  it("benachrichtigt mehrere Observer gleichzeitig", () => {
    const subject = new BaseSubject<string>();
    const first = createObserver<string>();
    const second = createObserver<string>();
    subject.subscribe(first.observer);
    subject.subscribe(second.observer);

    subject.notify("hallo");

    expect(first.update).toHaveBeenCalledWith("hallo");
    expect(second.update).toHaveBeenCalledWith("hallo");
  });

  it("benachrichtigt einen abgemeldeten Observer nicht mehr", () => {
    const subject = new BaseSubject<number>();
    const { observer, update } = createObserver<number>();
    subject.subscribe(observer);
    subject.unsubscribe(observer);

    subject.notify(1);

    expect(update).not.toHaveBeenCalled();
  });

  it("meldet denselben Observer bei doppeltem subscribe nur einmal an", () => {
    const subject = new BaseSubject<number>();
    const { observer, update } = createObserver<number>();
    subject.subscribe(observer);
    subject.subscribe(observer);

    subject.notify(7);

    expect(update).toHaveBeenCalledTimes(1);
  });

  it("wirft keinen Fehler, wenn niemand angemeldet ist", () => {
    const subject = new BaseSubject<number>();

    expect(() => subject.notify(1)).not.toThrow();
  });

  it("wirft keinen Fehler beim Abmelden eines unbekannten Observers", () => {
    const subject = new BaseSubject<number>();
    const { observer } = createObserver<number>();

    expect(() => subject.unsubscribe(observer)).not.toThrow();
  });

  it("beeinflusst die anderen Observer nicht, wenn sich einer waehrend notify abmeldet", () => {
    const subject = new BaseSubject<number>();
    const second = createObserver<number>();
    const selfRemoving: Observer<number> = {
      update: () => subject.unsubscribe(selfRemoving),
    };
    subject.subscribe(selfRemoving);
    subject.subscribe(second.observer);

    subject.notify(5);

    expect(second.update).toHaveBeenCalledWith(5);
  });
});
