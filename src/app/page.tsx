
"use client";
import CurrentYear from "@/components/CurrentYear";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import PriceCard from "@/components/PriceCard";
import ClashIndicator from "@/components/ClashIndicator";
import NewsAnalyzer from "@/components/NewsAnalyzer";
import PortfolioShadow from "@/components/PortfolioShadow";
import AlertModal from "@/components/AlertModal";
import { useAppStore } from "@/lib/store";
import { Bell, WifiOff, Zap } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const {
    prices,
    setPrices,
    isOffline,
    setIsOffline,
    alerts,
    markAlertTriggered,
  } = useAppStore();
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setPrices(data);
      setIsOffline(false);
      setLoading(false);

      // Check alerts against new prices
      alerts.forEach((alert) => {
        if (alert.triggered) return;
        const current =
          alert.metal === "gold" ? data.gold : data.silver;
        const hit =
          (alert.condition === "above" && current >= alert.target) ||
          (alert.condition === "below" && current <= alert.target);
        if (hit) {
          markAlertTriggered(alert.id);
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("BGM AU Price Alert Triggered!", {
              body: `${alert.metal === "gold" ? "Gold" : "Silver"} is now ${alert.condition} $${alert.target.toFixed(2)} (Current: $${current.toFixed(2)})`,
              icon: "/logo.png",
              tag: alert.id,
            });
          }
        }
      });
    } catch {
      setIsOffline(true);
      setLoading(false);
      // Keep last known prices from persist
    }
  }, [setPrices, setIsOffline, alerts, markAlertTriggered]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 45000); // refresh ~45s
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Apply theme class on mount
  useEffect(() => {
    const theme = useAppStore.getState().theme;
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Offline banner */}
        {isOffline && (
          <div className="bg-[var(--bear-red)]/90 text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
            <WifiOff size={16} />
            Offline: Showing last known prices
          </div>
        )}

        {/* Hero - The Clash */}
        <section className="relative overflow-hidden border-b border-[var(--gold)]/15">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bull-green)]/10 via-transparent to-[var(--bear-red)]/10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-3">
                  The Clash of Metals
                </p>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  <span className="text-gold">Bull</span>
                  <span className="text-[var(--text-muted)] mx-2">vs</span>
                  <span className="text-[var(--bear-red)]">Bear</span>
                </h1>
                <p className="text-[var(--text-secondary)] max-w-md text-base md:text-lg leading-relaxed mb-6">
                  Live gold & silver markets. Physical bullion. Intelligent
                  alerts. Built for those who understand the eternal struggle
                  between strength and scarcity.
                </p>
                <button
                  onClick={() => setAlertOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--gold)] text-black font-semibold hover:bg-[var(--gold-light)] transition-all animate-pulse-gold"
                >
                  <Bell size={18} />
                  Set Price Alert
                </button>
              </div>
<Link
  href="/assay"
  className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-r from-[#004225]/40 to-transparent p-4 transition-colors hover:border-[#D4AF37]"
>
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40">
    <Bot className="h-5 w-5 text-[#D4AF37]" />
  </div>
  <div>
    <p className="font-[Playfair_Display] font-semibold text-white">Ask BGM Assay</p>
    <p className="text-xs text-[#C0C0C0]">Bullion knowledge assistant</p>
  </div>
</Link>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
                  <Image
                    src="/logo.png"
                    alt="BGM AU LTD – Bull vs Bear"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
          {/* Clash Indicator */}
          {prices && <ClashIndicator ratio={prices.ratio} />}

          {/* Price cards */}
          <div className="grid md:grid-cols-2 gap-5">
            {loading && !prices ? (
              <>
                <div className="glass rounded-2xl h-56 animate-pulse" />
                <div className="glass rounded-2xl h-56 animate-pulse" />
              </>
            ) : prices ? (
              <>
                <PriceCard
                  metal="gold"
                  price={prices.gold}
                  change24h={prices.goldChange24h}
                  history={prices.goldHistory}
                />
                <PriceCard
                  metal="silver"
                  price={prices.silver}
                  change24h={prices.silverChange24h}
                  history={prices.silverHistory}
                />
              </>
            ) : (
              <p className="text-[var(--text-muted)] col-span-2 text-center py-10">
                Unable to load prices. Check your connection.
              </p>
            )}
          </div>

          {/* Two column: News + Portfolio */}
          <div className="grid lg:grid-cols-2 gap-6">
            <NewsAnalyzer />
            <PortfolioShadow />
          </div>

          {/* Quick CTA */}
          <div className="glass rounded-2xl p-6 md:p-8 text-center border border-[var(--gold)]/20">
            <Zap className="mx-auto text-[var(--gold)] mb-3" size={28} />
            <h3 className="font-serif text-xl font-semibold mb-2">
              Ready to take physical ownership?
            </h3>
            <p className="text-[var(--text-secondary)] mb-5 max-w-lg mx-auto">
              Browse our certified gold and silver bars & coins. Live pricing,
              transparent premiums, secure checkout.
            </p>
            <a
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--gold)] text-[var(--gold)] font-semibold hover:bg-[var(--gold)] hover:text-black transition-all"
            >
              Enter the Bullion Store
            </a>
          </div>
        </section>
      </main>

      {/* Floating Alert Button (mobile-friendly) */}
      <button
        onClick={() => setAlertOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--gold)] text-black shadow-lg shadow-[var(--gold)]/30 flex items-center justify-center hover:scale-105 transition-transform animate-pulse-gold md:hidden"
        aria-label="Set Alert"
      >
        <Bell size={24} />
      </button>

      <AlertModal open={alertOpen} onClose={() => setAlertOpen(false)} />

      <footer className="border-t border-[var(--gold)]/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--text-muted)]">
          <p className="font-serif text-[var(--gold)] mb-1">BGM AU LTD</p>
          <p>The Clash of Metals · Premium Bullion · © <CurrentYear /></p>
        </div>
      </footer>
    </>
  );
}
