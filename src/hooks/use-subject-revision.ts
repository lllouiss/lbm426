import type { Subject } from "@/lib/observer/observer";
import { useSubject } from "./use-subject";

/** Ein Subject, das seine Aenderungen zaehlt (Momentaufnahme fuer React). */
type WithRevision<T> = Subject<T> & { readonly revision: number };

/**
 * Meldet die Komponente als Observer am Subject an. Sie wird bei jeder
 * Benachrichtigung neu gerendert und beim Unmount wieder abgemeldet.
 */
export function useSubjectRevision<T>(subject: WithRevision<T>): number {
  return useSubject(subject, () => subject.revision);
}
