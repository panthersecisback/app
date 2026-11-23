"use client";

import { useAppStore } from "@/lib/store";
import { Wallet } from "lucide-react";

export default function PortfolioShadow() {
  const { portfolio, setHolding, prices } = useAppStore();

  const goldHolding = portfolio.find((h) => h.metal === "gold")?.ounces ?? 0;
  const silverHolding = portfolio.find((h) => h.metal === "silver")?.ounces ?? 0;

  const goldValue = prices ? goldHolding * prices.gold : 0;
  const silverValue = prices ? silverHolding * prices.silver : 0;
  const total = goldValue + silverValue;

  return (
    <div className="glass rounded-2xl p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Wallet className="text-[var(--gold)]" size={22} />
        <h3 className="font-serif text-lg font-semibold text-gold">
          Portfolio Shadow
        </h3>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-4">
        Enter the ounces you hold. Live value updates with the market.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1.5">
            Gold (oz)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={goldHolding || ""}
            onChange={(e) =>
              setHolding("gold", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--gold)] focus:outline-none tabular-nums"
            placeholder="0.00"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            ≈ ${goldValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1.5">
            Silver (oz)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={silverHolding || ""}
            onChange={(e) =>
              setHolding("silver", parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--silver)] focus:outline-none tabular-nums"
            placeholder="0.00"
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            ≈ ${silverValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-[var(--text-muted)] mb-1">
          Estimated Net Worth (Spot)
        </p>
        <p className="text-2xl md:text-3xl font-bold tabular-nums text-gold">
          $
          {total.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
}
