"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Moon, Sun, ShoppingCart, Menu, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { Coins } from "lucide-react";


export default function Header() {
  const { theme, toggleTheme, cart, alerts } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const activeAlerts = alerts.filter((a) => !a.triggered).length;

  return (
    <Link
  href="/assay"
  className="flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
>
  <Bot className="h-3.5 w-3.5" />
  AI Assay
</Link>
    <header className="sticky top-0 z-50 glass border-b border-[var(--gold)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-[var(--gold)]/40 group-hover:ring-[var(--gold)] transition-all">
              <Image
                src="/logo.png"
                alt="BGM AU LTD"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-gold">
                BGM
              </span>
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-[var(--silver)] ml-1">
                AU LTD
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/store"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors"
            >
              Bullion Store
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-[var(--gold)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              href="/#alerts"
              className="relative p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-[var(--gold)]"
            >
              <Bell size={20} />
              {activeAlerts > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--bear-red)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </Link>

            <Link
              href="/store"
              className="relative p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] hover:text-[var(--gold)]"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--gold)] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-elevated)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--gold)]/10 pt-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--gold)]"
            >
              Dashboard
            </Link>
            <Link
              href="/store"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--gold)]"
            >
              Bullion Store
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
