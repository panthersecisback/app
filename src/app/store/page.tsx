"use client";
import CurrentYear from "@/components/CurrentYear";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { useAppStore } from "@/lib/store";
import { ShoppingBag, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { PRODUCTS } from "@/lib/mockData";

export default function StorePage() {
  const { cart, removeFromCart, clearCart, prices } = useAppStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartItems = cart
    .map((c) => {
      const product = PRODUCTS.find((p) => p.id === c.productId);
      if (!product || !prices) return null;
      const unit =
        (product.metal === "gold" ? prices.gold : prices.silver) *
        product.weightOz *
        (1 + product.premiumPercent / 100);
      return { ...product, quantity: c.quantity, unit, line: unit * c.quantity };
    })
    .filter(Boolean) as (typeof PRODUCTS[0] & {
    quantity: number;
    unit: number;
    line: number;
  })[];

  const subtotal = cartItems.reduce((s, i) => s + i.line, 0);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)] mb-2">
              Physical Ownership
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gold">
              Bullion Store
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 max-w-xl">
              LBMA-accredited bars and sovereign coins. Prices update live with
              the spot market plus transparent premiums.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => setCheckoutOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--gold)] text-black font-semibold hover:bg-[var(--gold-light)] transition-colors"
            >
              <ShoppingBag size={18} />
              Cart ({cart.reduce((s, c) => s + c.quantity, 0)}) · $
              {subtotal.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </button>
          )}
        </div>

        <ProductGrid />
      </main>

      {/* Simple Checkout Drawer / Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCheckoutOpen(false)}
          />
          <div className="relative w-full max-w-md glass-strong h-full overflow-y-auto p-6 shadow-2xl border-l border-[var(--gold)]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-bold text-gold">
                Secure Checkout
              </h2>
              <button
                onClick={() => setCheckoutOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-10">
                Your cart is empty.
              </p>
            ) : (
              <>
                <ul className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 p-3 rounded-xl bg-[var(--bg-elevated)]/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {item.weight} · Qty {item.quantity}
                        </p>
                        <p className="text-sm text-gold mt-1 tabular-nums">
                          ${item.line.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[var(--text-muted)] hover:text-[var(--bear-red)] self-start"
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Shipping</span>
                    <span className="text-[var(--text-muted)]">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span>Total</span>
                    <span className="text-gold tabular-nums">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email for order confirmation"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--gold)] focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--gold)] focus:outline-none"
                  />
                  <textarea
                    placeholder="Shipping address"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-white/10 focus:border-[var(--gold)] focus:outline-none resize-none"
                  />
                  <button
                    onClick={() => {
                      alert(
                        "This is a demo checkout. In production this would connect to a secure payment processor (Stripe / Adyen) and inventory system."
                      );
                      clearCart();
                      setCheckoutOpen(false);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[var(--gold)] text-black font-semibold flex items-center justify-center gap-2 hover:bg-[var(--gold-light)] transition-colors"
                  >
                    <CreditCard size={18} />
                    Place Order (Demo)
                  </button>
                  <p className="text-[10px] text-center text-[var(--text-muted)]">
                    Mock checkout · No real payment processed
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-[var(--gold)]/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--text-muted)]">
          <p className="font-serif text-[var(--gold)] mb-1">BGM AU LTD</p>
         <p>The Clash of Metals · Premium Bullion · © <CurrentYear /></p>
        </div>
      </footer>
    </>
  );
}
