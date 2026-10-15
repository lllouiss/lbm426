import type { Observer, Subject } from "./observer";

/**
 * Wiederverwendbare Basisklasse fuer Subjects.
 * Konkrete Subjects (z.B. Wallet) erben von ihr und rufen bei einer
 * Aenderung notify() auf.
 */
export class BaseSubject<T> implements Subject<T> {
  private readonly observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    // Kopie, damit sich Observer waehrend der Benachrichtigung abmelden duerfen.
    for (const observer of [...this.observers]) {
      observer.update(data);
    }
  }
}
