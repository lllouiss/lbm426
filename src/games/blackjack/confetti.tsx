const PIECE_COUNT = 24;
const COLORS = ["#fcd34d", "#f87171", "#60a5fa", "#34d399", "#f472b6"];

/** Konfetti-Regen fuer einen Sieg; rein dekorativ. */
export function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: PIECE_COUNT }, (_, index) => (
        <span
          key={index}
          className="animate-confetti absolute -top-4 h-3 w-2 rounded-sm"
          style={{
            left: `${(index * 100) / PIECE_COUNT + 2}%`,
            backgroundColor: COLORS[index % COLORS.length],
            animationDelay: `${(index % 8) * 120}ms`,
            animationDuration: `${1800 + (index % 5) * 300}ms`,
          }}
        />
      ))}
    </div>
  );
}
