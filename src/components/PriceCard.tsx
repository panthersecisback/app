"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  YAxis,
} from "recharts";

interface PriceCardProps {
  metal: "gold" | "silver";
  price: number;
  change24h: number;
  history: { time: string; price: number }[];
}

export default function PriceCard({
  metal,
  price,
  change24h,
  history,
}: PriceCardProps) {
  const isUp = change24h >= 0;
  const isGold = metal === "gold";
  const accent = isGold ? "var(--gold)" : "var(--silver)";
  const accentSoft = isGold ? "rgba(212,175,55,0.25)" : "rgba(192,192,192,0.2)";

  return (
    <div
      className={`glass rounded-2xl p-5 md:p-6 relative overflow-hidden transition-all hover:border-[${accent}]/40 group`}
      style={{ borderColor: `${accent}33` }}
    >
      {/* Subtle metal glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
            {isGold ? "XAU / USD" : "XAG / USD"}
          </p>
          <h3
            className="font-serif text-2xl md:text-3xl font-bold"
            style={{ color: accent }}
          >
            {isGold ? "Gold" : "Silver"}
          </h3>
        </div>
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold ${
            isUp
              ? "bg-[var(--bull-green)]/20 text-[var(--bull-green)]"
              : "bg-[var(--bear-red)]/20 text-[var(--bear-red)]"
          }`}
        >
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {isUp ? "+" : ""}
          {change24h.toFixed(2)}%
        </div>
      </div>

      <div className="relative z-10 mb-4">
        <p className="text-3xl md:text-4xl font-bold tracking-tight tabular-nums">
          ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">per troy ounce</p>
      </div>

      {/* Sparkline */}
      <div className="h-16 -mx-2 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${metal}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis domain={["dataMin", "dataMax"]} hide />
            <Area
              type="monotone"
              dataKey="price"
              stroke={accent}
              strokeWidth={2}
              fill={`url(#grad-${metal})`}
              isAnimationActive={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
