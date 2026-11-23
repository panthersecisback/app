"use client";

import { useState, useEffect } from "react";
import { X, Bell, BellRing } from "lucide-react";
import { useAppStore, type Metal, type AlertCondition } from "@/lib/store";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AlertModal({ open, onClose }: AlertModalProps) {
  const { addAlert, alerts, removeAlert, prices } = useAppStore();
  const [metal, setMetal] = useState<Metal>("gold");
  const [condition, setCondition] = useState<AlertCondition>("above");
  const [target, setTarget] = useState("");

  // Request notification permission once
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(target);
    if (isNaN(value) || value <= 0) return;

    addAlert({ metal, condition, target: value });

    // Mock immediate check / demo notification
    if (typeof window !== "undefined" && Notification.permission === "granted") {
      // Just acknowledge creation for demo
      new Notification("BGM AU Price Alert Set", {
        body: `You'll be notified when ${metal === "gold" ? "Gold" : "Silver"} goes ${condition} $${value.toFixed(2)}`,
        icon: "/logo.png",
      });
    }

    setTarget("");
    onClose();
  };

  const currentPrice =
    metal === "gold" ? prices?.gold : prices?.silver;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md glass-strong rounded-2xl p-6 shadow-2xl border border-[var(--gold)]/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BellRing className="text-[var(--gold)]" size={22} />
            <h2 className="font-serif text-xl font-bold text-gold">
              Set Price Alert
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Metal */}
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Metal
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["gold", "silver"] as Metal[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetal(m)}
                  className={`py-2.5 rounded-xl font-medium transition-all ${
                    metal === m
                      ? m === "gold"
                        ? "bg-[var(--gold)] text-black"
                        : "bg-[var(--silver)] text-black"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/80"
                  }`}
                >
                  {m === "gold" ? "Gold (XAU)" : "Silver (XAG)"}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Condition
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["above", "below"] as AlertCondition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`py-2.5 rounded-xl font-medium capitalize transition-all ${
                    condition === c
                      ? "bg-[var(--bull-green)] text-white"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                  }`}
                >
                  Price goes {c}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              Target Price (USD)
              {currentPrice && (
                <span className="ml-2 text-xs text-[var(--text-muted)]">
                  Current: ${currentPrice.toFixed(2)}
                </span>
              )}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 2700.00"
              required
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--gold)] focus:outline-none text-lg tabular-nums"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[var(--gold)] text-black font-semibold hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2"
          >
            <Bell size={18} />
            Create Alert
          </button>
        </form>

        {/* Existing alerts */}
        {alerts.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Active Alerts
            </p>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-[var(--bg-elevated)]/50"
                >
                  <span>
                    <span
                      className={
                        a.metal === "gold" ? "text-gold" : "text-silver"
                      }
                    >
                      {a.metal === "gold" ? "Gold" : "Silver"}
                    </span>{" "}
                    {a.condition} ${a.target.toFixed(2)}
                    {a.triggered && (
                      <span className="ml-2 text-[10px] text-[var(--bull-green)]">
                        TRIGGERED
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => removeAlert(a.id)}
                    className="text-[var(--text-muted)] hover:text-[var(--bear-red)]"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
