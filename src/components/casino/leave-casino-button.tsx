interface LeaveCasinoButtonProps {
  /** true waehrend einer laufenden Runde. */
  disabled: boolean;
  onLeave: () => void;
}

export function LeaveCasinoButton({ disabled, onLeave }: LeaveCasinoButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onLeave}
      className="rounded-full border px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
    >
      Aufhören
    </button>
  );
}
