import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Metal = "gold" | "silver";
export type AlertCondition = "above" | "below";

export interface PriceAlert {
  id: string;
  metal: Metal;
  condition: AlertCondition;
  target: number;
  createdAt: number;
  triggered?: boolean;
}

export interface PortfolioHolding {
  metal: Metal;
  ounces: number;
}

export interface PriceData {
  gold: number;
  silver: number;
  goldChange24h: number;
  silverChange24h: number;
  goldHistory: { time: string; price: number }[];
  silverHistory: { time: string; price: number }[];
  lastUpdated: number;
  ratio: number;
}

interface AppState {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;

  // Prices
  prices: PriceData | null;
  setPrices: (prices: PriceData) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;

  // Alerts
  alerts: PriceAlert[];
  addAlert: (alert: Omit<PriceAlert, "id" | "createdAt">) => void;
  removeAlert: (id: string) => void;
  markAlertTriggered: (id: string) => void;

  // Portfolio Shadow
  portfolio: PortfolioHolding[];
  setHolding: (metal: Metal, ounces: number) => void;

  // Cart (simple mock)
  cart: { productId: string; quantity: number }[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("light", next === "light");
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),

      prices: null,
      setPrices: (prices) => set({ prices }),
      isOffline: false,
      setIsOffline: (isOffline) => set({ isOffline }),

      alerts: [],
      addAlert: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            {
              ...alert,
              id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: Date.now(),
            },
          ],
        })),
      removeAlert: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      markAlertTriggered: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) =>
            a.id === id ? { ...a, triggered: true } : a
          ),
        })),

      portfolio: [
        { metal: "gold", ounces: 0 },
        { metal: "silver", ounces: 0 },
      ],
      setHolding: (metal, ounces) =>
        set((s) => ({
          portfolio: s.portfolio.map((h) =>
            h.metal === metal ? { ...h, ounces: Math.max(0, ounces) } : h
          ),
        })),

      cart: [],
      addToCart: (productId) =>
        set((s) => {
          const existing = s.cart.find((c) => c.productId === productId);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === productId
                  ? { ...c, quantity: c.quantity + 1 }
                  : c
              ),
            };
          }
          return { cart: [...s.cart, { productId, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((s) => ({
          cart: s.cart.filter((c) => c.productId !== productId),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "bgm-au-storage",
      partialize: (state) => ({
        theme: state.theme,
        alerts: state.alerts,
        portfolio: state.portfolio,
        cart: state.cart,
        prices: state.prices, // cache last prices for offline
      }),
    }
  )
);
