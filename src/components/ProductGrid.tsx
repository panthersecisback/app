"use client";

import { PRODUCTS, type Product } from "@/lib/mockData";
import { useAppStore } from "@/lib/store";
import { ShoppingCart, Package } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductGrid() {
  const { prices, addToCart } = useAppStore();
  const [filter, setFilter] = useState<"all" | "gold" | "silver">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.metal === filter),
    [filter]
  );

  const getLivePrice = (product: Product) => {
    if (!prices) return null;
    const spot = product.metal === "gold" ? prices.gold : prices.silver;
    return spot * product.weightOz * (1 + product.premiumPercent / 100);
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "gold", "silver"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
              filter === f
                ? f === "gold"
                  ? "bg-[var(--gold)] text-black"
                  : f === "silver"
                    ? "bg-[var(--silver)] text-black"
                    : "bg-white text-black"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]/80"
            }`}
          >
            {f === "all" ? "All Bullion" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const livePrice = getLivePrice(product);
          const stockColor =
            product.stock === "In Stock"
              ? "text-[var(--bull-green)]"
              : product.stock === "Low Stock"
                ? "text-[var(--gold)]"
                : "text-[var(--bear-red)]";

          return (
            <div
              key={product.id}
              className="glass rounded-2xl overflow-hidden flex flex-col group hover:border-[var(--gold)]/30 transition-all"
            >
              <div className="relative h-40 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-dark)] flex items-center justify-center">
                <div className="relative w-24 h-24 opacity-90 group-hover:scale-105 transition-transform">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span
                  className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 ${stockColor}`}
                >
                  {product.stock}
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider ${
                      product.metal === "gold" ? "text-gold" : "text-silver"
                    }`}
                  >
                    {product.metal}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {product.purity} · {product.weight}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-[var(--text-primary)] mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-auto">
                  <p className="text-xl font-bold tabular-nums text-gold mb-3">
                    {livePrice
                      ? `$${livePrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : "—"}
                  </p>
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === "Out of Stock"}
                    className="w-full py-2.5 rounded-xl bg-[var(--gold)] text-black text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[var(--gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
