/**
 * Observer-Pattern (GoF): Ein Observer wird vom Subject ueber Aenderungen informiert.
 */
export interface Observer<T> {
  update(data: T): void;
}

export interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}
