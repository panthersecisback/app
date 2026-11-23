"use client";

import { MOCK_NEWS } from "@/lib/mockData";
import { Newspaper, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function NewsAnalyzer() {
  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Newspaper className="text-[var(--gold)]" size={22} />
        <h3 className="font-serif text-lg font-semibold text-gold">
          AI News Analyzer
        </h3>
        <span className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
          Live Insights
        </span>
      </div>

      <div className="space-y-4">
        {MOCK_NEWS.map((item) => (
          <article
            key={item.id}
            className="p-4 rounded-xl bg-[var(--bg-elevated)]/60 border border-white/5 hover:border-[var(--gold)]/20 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-medium text-sm leading-snug text-[var(--text-primary)]">
                {item.headline}
              </h4>
              <SentimentBadge sentiment={item.sentiment} />
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-2">
              {item.source} · {item.publishedAt} · Focus: {item.metalFocus}
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              <span className="text-[var(--gold)] font-medium">
                How this affects {item.metalFocus === "Both" ? "metals" : item.metalFocus}:
              </span>{" "}
              {item.impact}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function SentimentBadge({
  sentiment,
}: {
  sentiment: "Bullish" | "Bearish" | "Neutral";
}) {
  const config = {
    Bullish: {
      icon: TrendingUp,
      className: "bg-[var(--bull-green)]/20 text-[var(--bull-green)]",
    },
    Bearish: {
      icon: TrendingDown,
      className: "bg-[var(--bear-red)]/20 text-[var(--bear-red)]",
    },
    Neutral: {
      icon: Minus,
      className: "bg-[var(--text-muted)]/20 text-[var(--text-muted)]",
    },
  }[sentiment];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.className}`}
    >
      <Icon size={12} />
      {sentiment}
    </span>
  );
}
