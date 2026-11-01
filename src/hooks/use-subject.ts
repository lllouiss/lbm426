import { useCallback, useSyncExternalStore } from "react";
import type { Observer, Subject } from "@/lib/observer/observer";

/**
 * Meldet die Komponente als Observer am Subject an und liefert die aktuelle
 * Momentaufnahme. Bei jeder Benachrichtigung wird neu gerendert, beim
 * Unmount meldet sich die Komponente wieder ab.
 */
export function useSubject<T, S>(subject: Subject<T>, readSnapshot: () => S): S {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const observer: Observer<T> = { update: onChange };
      subject.subscribe(observer);
      return () => subject.unsubscribe(observer);
    },
    [subject],
  );

  return useSyncExternalStore(subscribe, readSnapshot, readSnapshot);
}
