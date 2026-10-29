import { useCallback, useSyncExternalStore } from "react";
import type { Observer, Subject } from "@/lib/observer/observer";

/** Ein Subject, das seine Aenderungen zaehlt (Momentaufnahme fuer React). */
interface RevisionedSubject<T> extends Subject<T> {
  readonly revision: number;
}

/**
 * Meldet die Komponente als Observer am Subject an. Sie wird bei jeder
 * Benachrichtigung neu gerendert und beim Unmount wieder abgemeldet.
 */
export function useSubjectRevision<T>(subject: RevisionedSubject<T>): number {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const observer: Observer<T> = { update: onChange };
      subject.subscribe(observer);
      return () => subject.unsubscribe(observer);
    },
    [subject],
  );
  const readRevision = () => subject.revision;

  return useSyncExternalStore(subscribe, readRevision, readRevision);
}
