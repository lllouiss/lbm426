import { BaseSubject } from "./subject";

/**
 * Subject, das seine Veroeffentlichungen zaehlt. Die Revision dient React als
 * Momentaufnahme, wenn sich ein Objekt nur intern aendert (z.B. ein Spieltisch).
 */
export class RevisionedSubject<T> extends BaseSubject<T> {
  private changes = 0;

  get revision(): number {
    return this.changes;
  }

  /** Erhoeht die Revision und benachrichtigt alle Observer. */
  protected publish(data: T): void {
    this.changes += 1;
    this.notify(data);
  }
}
