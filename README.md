# BGM AU LTD — The Clash of Metals

Production-ready Progressive Web App for a premium bullion dealer.

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **Zustand** (state + persistence)
- **Lucide React** (icons)
- **Recharts** (sparklines)
- **PWA** (manifest + custom service worker)

## Design System

**The Clash of Metals** aesthetic derived from the official logo:

| Token        | Hex       | Role                  |
|--------------|-----------|-----------------------|
| Bull Green   | `#004225` | Primary / bullish     |
| Bear Red     | `#8B0000` | Danger / bearish      |
| Gold         | `#D4AF37` | Accent / premium      |
| Silver       | `#C0C0C0` | Secondary metal       |
| Background   | `#0a0a0a` | Dark mode default     |

Typography: **Playfair Display** (headers) + **Inter** (UI/data).

## Features

### Live Dashboard
- Real-time style Gold (XAU) & Silver (XAG) spot prices
- 24h % change + sparkline charts
- **The Clash Indicator** — Gold/Silver ratio gauge (Bull vs Bear)
- **AI News Analyzer** — macro headlines with sentiment & impact reasoning
- **Portfolio Shadow** — enter ounces held → live fiat valuation

### Bullion Store
- Grid catalog of physical gold & silver (bars + coins)
- Live pricing = spot × weight × (1 + premium)
- Stock status, Add to Cart, mock secure checkout drawer

### Price Alerts
- Floating / prominent “Set Alert” CTA
- Metal + Above/Below + Target value
- Browser Notification API (mock trigger on price poll)

### PWA
- `manifest.json` with logo icons
- Service worker for offline caching of shell + last prices
- Offline banner when network is unavailable
- Installable on mobile & desktop

## Getting Started

```bash
cd bgm-au
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

`GET /api/prices` returns:

```json
{
  "gold": 2685.42,
  "silver": 32.18,
  "goldChange24h": 0.35,
  "silverChange24h": -0.82,
  "goldHistory": [...],
  "silverHistory": [...],
  "ratio": 83.45,
  "lastUpdated": 1730820000000
}
```

Currently uses a high-quality simulated random walk so the app works without an external API key.  
Replace the logic in `src/app/api/prices/route.ts` with Metals-API / GoldAPI / your preferred provider when ready.

## Project Structure

```
src/
  app/
    api/prices/route.ts   # Price endpoint
    store/page.tsx        # Bullion e-commerce
    layout.tsx
    page.tsx              # Live Dashboard
  components/
    Header.tsx
    PriceCard.tsx
    ClashIndicator.tsx
    NewsAnalyzer.tsx
    AlertModal.tsx
    PortfolioShadow.tsx
    ProductGrid.tsx
    ServiceWorkerRegister.tsx
  lib/
    store.ts              # Zustand store
    mockData.ts           # News + products
public/
  logo.png
  manifest.json
  sw.js
```

## Notes

- Dark mode is default; light mode toggle is available in the header.
- All cart / alert / portfolio data persists in `localStorage` via Zustand.
- Checkout is intentionally mocked — wire to Stripe/Adyen + inventory for production.
- For real push notifications, pair the service worker with a push service (Web Push / FCM) and a backend that monitors prices.
