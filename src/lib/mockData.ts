export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  impact: string;
  metalFocus: "Gold" | "Silver" | "Both";
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    headline: "Federal Reserve signals slower pace of rate cuts amid sticky inflation",
    source: "Reuters",
    publishedAt: "2h ago",
    sentiment: "Bearish",
    impact:
      "Higher-for-longer rates strengthen the USD and raise opportunity cost of holding non-yielding gold, typically pressuring bullion prices.",
    metalFocus: "Gold",
  },
  {
    id: "n2",
    headline: "Industrial demand for silver surges as solar and EV sectors expand capacity",
    source: "Bloomberg",
    publishedAt: "4h ago",
    sentiment: "Bullish",
    impact:
      "Strong physical offtake from green energy and electronics tightens the silver market balance, supporting higher spot prices.",
    metalFocus: "Silver",
  },
  {
    id: "n3",
    headline: "Geopolitical tensions in key mining regions raise supply disruption risks",
    source: "Financial Times",
    publishedAt: "6h ago",
    sentiment: "Bullish",
    impact:
      "Potential supply shocks for both gold and silver mines act as a classic safe-haven and scarcity premium driver for precious metals.",
    metalFocus: "Both",
  },
];

export interface Product {
  id: string;
  name: string;
  metal: "gold" | "silver";
  weight: string;
  weightOz: number;
  purity: string;
  premiumPercent: number; // over spot
  stock: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "au-1oz",
    name: "1 oz Gold Bar",
    metal: "gold",
    weight: "1 oz",
    weightOz: 1,
    purity: "999.9",
    premiumPercent: 3.2,
    stock: "In Stock",
    image: "/logo.png",
    description: "LBMA Good Delivery accredited 1 troy ounce fine gold bar.",
  },
  {
    id: "au-10oz",
    name: "10 oz Gold Bar",
    metal: "gold",
    weight: "10 oz",
    weightOz: 10,
    purity: "999.9",
    premiumPercent: 2.4,
    stock: "In Stock",
    image: "/logo.png",
    description: "Investment-grade 10 troy ounce gold bar with assay certificate.",
  },
  {
    id: "au-1kg",
    name: "1 kg Gold Bar",
    metal: "gold",
    weight: "1 kg",
    weightOz: 32.15,
    purity: "999.9",
    premiumPercent: 1.8,
    stock: "Low Stock",
    image: "/logo.png",
    description: "Kilobar of fine gold. Ideal for larger portfolio allocations.",
  },
  {
    id: "ag-1oz",
    name: "1 oz Silver Round",
    metal: "silver",
    weight: "1 oz",
    weightOz: 1,
    purity: "999.0",
    premiumPercent: 12.5,
    stock: "In Stock",
    image: "/logo.png",
    description: "Beautiful .999 fine silver round, perfect for stacking.",
  },
  {
    id: "ag-10oz",
    name: "10 oz Silver Bar",
    metal: "silver",
    weight: "10 oz",
    weightOz: 10,
    purity: "999.0",
    premiumPercent: 8.0,
    stock: "In Stock",
    image: "/logo.png",
    description: "Ten ounce silver bar with low premium over spot.",
  },
  {
    id: "ag-1kg",
    name: "1 kg Silver Bar",
    metal: "silver",
    weight: "1 kg",
    weightOz: 32.15,
    purity: "999.0",
    premiumPercent: 5.5,
    stock: "In Stock",
    image: "/logo.png",
    description: "Kilogram silver bar – efficient way to accumulate physical silver.",
  },
  {
    id: "au-maple",
    name: "Canadian Maple Leaf 1 oz Gold",
    metal: "gold",
    weight: "1 oz",
    weightOz: 1,
    purity: "999.9",
    premiumPercent: 4.8,
    stock: "In Stock",
    image: "/logo.png",
    description: "Iconic Royal Canadian Mint gold coin, highly liquid worldwide.",
  },
  {
    id: "ag-phil",
    name: "American Silver Eagle 1 oz",
    metal: "silver",
    weight: "1 oz",
    weightOz: 1,
    purity: "999.0",
    premiumPercent: 18.0,
    stock: "Low Stock",
    image: "/logo.png",
    description: "Official U.S. Mint silver bullion coin – collector and investor favourite.",
  },
];
