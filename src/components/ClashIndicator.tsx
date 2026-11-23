"use client";

interface ClashIndicatorProps {
  ratio: number;
}

export default function ClashIndicator({ ratio }: ClashIndicatorProps) {
  // Historical Gold/Silver ratio average ~60-70. 
  // Lower ratio → Silver outperforming (Bear side stronger relative)
  // Higher ratio → Gold outperforming (Bull side)
  // We map typical range 50–90 into a 0–100 visual.
  const clamped = Math.min(Math.max(ratio, 45), 95);
  const position = ((clamped - 45) / 50) * 100; // 0 = silver (left? wait design)

  // Design: Bull (Gold strong / high ratio) on LEFT (green), Bear (Silver strong / low ratio) on RIGHT (red)
  // When ratio high → needle left (bull), ratio low → needle right (bear)
  const needlePos = 100 - position; // invert so high ratio = left

  const lean =
    ratio >= 70
      ? "Bull is dominating — Gold outperforming Silver"
      : ratio <= 55
        ? "Bear is rising — Silver outperforming Gold"
        : "The clash is balanced";

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg font-semibold text-gold">
          The Clash Indicator
        </h3>
        <span className="text-sm tabular-nums text-[var(--text-secondary)]">
          G/S Ratio: <strong className="text-[var(--text-primary)]">{ratio.toFixed(2)}</strong>
        </span>
      </div>

      {/* Meter track */}
      <div className="relative h-4 rounded-full overflow-hidden clash-meter mb-3">
        {/* Needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-lg transition-all duration-700 ease-out"
          style={{ left: `calc(${needlePos}% - 2px)` }}
        />
        {/* Glow on needle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white/40 blur-sm transition-all duration-700"
          style={{ left: `calc(${needlePos}% - 6px)` }}
        />
      </div>

      <div className="flex justify-between text-xs font-medium mb-2">
        <span className="text-[var(--bull-green)] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[var(--bull-green)]" />
          Bull (Gold)
        </span>
        <span className="text-[var(--bear-red)] flex items-center gap-1">
          Bear (Silver)
          <span className="w-2 h-2 rounded-full bg-[var(--bear-red)]" />
        </span>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mt-1">{lean}</p>
    </div>
  );
}
