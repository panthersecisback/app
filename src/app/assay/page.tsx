"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins, Send, Sparkles, Bot, ShieldCheck } from "lucide-react";

type Msg = { id: string; role: "user" | "bot"; text: string };

// ── Bullion-only knowledge base ─────────────────────────────────────────────
const KB: { match: RegExp; answer: string }[] = [
  {
    match: /\b(what is|explain|define).{0,30}(gold|bullion|au)\b/i,
    answer:
      "Gold (symbol **Au**, atomic number 79) is a dense, malleable precious metal. In bullion form it trades as bars and coins, purity expressed in fineness (e.g. 999.9). It's the classic store of value and safe-haven asset.",
  },
  {
    match: /\b(what is|explain|define).{0,30}(silver|ag)\b/i,
    answer:
      "Silver (symbol **Ag**, atomic number 47) is a precious metal with the highest electrical conductivity of any element. Bullion silver trades in bars and coins, usually 999+ fineness. It's more volatile than gold and also an industrial metal.",
  },
  {
    match: /\b(troy ounce|oz t|what is an ounce)\b/i,
    answer:
      "A **troy ounce** is the standard bullion weight — 31.1035 grams, heavier than the common avoirdupois ounce (28.35 g). Almost all gold/silver spot prices are quoted per troy ounce.",
  },
  {
    match: /\b(purity|fineness|karat|carat|999|995|916)\b/i,
    answer:
      "Purity (**fineness**) is the metal content. 999.9 = 99.99% pure (four nines). Gold bars are usually 999 or 999.9; jewellery uses karats (24k = 99.9%, 22k = 91.6%). Silver bullion is typically 999 or 999.9. 'Karat' (K) is gold purity; 'carat' (C) is gemstone weight.",
  },
  {
    match: /\b(premium|premiums|over spot)\b/i,
    answer:
      "The **premium** is the amount above live spot you pay for a physical bar or coin. It covers fabrication, distribution, and dealer margin. Small bars/coins carry higher premium (%) than large bars. Always compare premium % when buying.",
  },
  {
    match: /\b(spot price|spot)\b/i,
    answer:
      "The **spot price** is the current market price for immediate delivery of one troy ounce of the metal, quoted in a currency (usually USD). Physical bullion = spot × weight × (1 + premium).",
  },
  {
    match: /\b(gold.?silver ratio|gsr|ratio)\b/i,
    answer:
      "The **Gold/Silver Ratio (GSR)** = gold price ÷ silver price. It tells you how many ounces of silver buy one ounce of gold. A high ratio (>80) historically favours buying silver; a low ratio (<50) favours gold. Our **Clash Indicator** visualises this live.",
  },
  {
    match: /\b(should i buy|invest|good time|advice|recommend)\b/i,
    answer:
      "I can't give financial advice — but I can share frameworks. Bullion is often used for diversification and hedging. Consider your time horizon, storage, premiums, and buy in tranches to smooth volatility. Consult a licensed adviser for personal decisions.",
  },
  {
    match: /\b(coin|coins|krugerrand|maple|eagle|sovereign|nugget|britannia)\b/i,
    answer:
      "Popular **gold coins**: Krugerrand, Canadian Maple Leaf, American Eagle/Buffalo, Australian Nugget, UK Britannia. **Silver coins**: American Eagle, Canadian Maple, Britannia, Philharmonic. Government-minted coins carry legal-tender status and are often easier to resell than bars.",
  },
  {
    match: /\b(bar|bars|ingot)\b/i,
    answer:
      "Bullion **bars** range from 1 g to 400 oz (London Good Delivery). Common retail sizes: 1 oz, 10 oz, 100 g, 1 kg. Larger bars have lower per-ounce premiums but are harder to sell in small portions. Bars are usually 999+ fineness with an assay certificate.",
  },
  {
    match: /\b(storage|store|vault|safe)\b/i,
    answer:
      "Storage options: home safe (insure it), bank safe-deposit box, or specialist bullion vaults (allocated or unallocated). Allocated storage keeps your specific bars segregated. Factor insurance and fees into total cost.",
  },
  {
    match: /\b(tax|taxes|gst|vat|cgt)\b/i,
    answer:
      "Tax treatment varies by country — in many jurisdictions investment-grade gold/silver bullion is GST/VAT exempt but capital gains may apply. In Australia, certain precious metals are GST-free. Always check local rules or ask a tax professional.",
  },
  {
    match: /\b(spread|bid.?ask)\b/i,
    answer:
      "The **spread** is the difference between buy (ask) and sell (bid) price. Tighter spreads mean better liquidity. Physical bullion also has a dealer buy-back spread — ask your dealer's buy-back policy before purchasing.",
  },
  {
    match: /\b(clash|indicator)\b/i,
    answer:
      "Our **Clash Indicator** shows the live Gold/Silver ratio as a Bull (silver-favoured) vs Bear (gold-favoured) gauge. It's a sentiment tool — not a guarantee. Use it alongside fundamentals and your own research.",
  },
  {
    match: /\b(safe haven|hedge|inflation|volatility)\b/i,
    answer:
      "Bullion is often treated as a **safe-haven** asset and inflation hedge, though it can be volatile short-term. Gold tends to shine in risk-off markets; silver is more cyclical due to industrial demand. Neither is risk-free.",
  },
  {
    match: /\b(how (do|can) i (buy|sell)|where to buy|buy back)\b/i,
    answer:
      "To buy: choose a reputable dealer, verify purity, compare premiums, and request assay certificates for bars. To sell, dealers often buy back at spot minus a small spread — check policies. Store securely and keep purchase records.",
  },
  {
    match: /\b(ounce|weight|gram|kg|tola)\b/i,
    answer:
      "Common weights: 1 troy oz ≈ 31.10 g; 1 kg ≈ 32.15 troy oz; 100 g ≈ 3.22 troy oz. Indian markets use the **tola** (11.66 g). Always confirm whether a quote is per troy ounce or per gram.",
  },
  {
    match: /\b(hello|hi|hey|help|what can you do|who are you)\b/i,
    answer:
      "Hi — I'm **BGM Assay**, your bullion guide. I only answer questions about gold & silver bullion: purity, premiums, weights, coins, bars, storage, the gold/silver ratio, and how our tools work.",
  },
];

const FALLBACK =
  "I'm a specialised bullion assistant, so I can only help with gold and silver bullion topics — purity, premiums, weights, coins, bars, storage, spot price, the gold/silver ratio, and how to use this app.";

function answerFor(q: string): string {
  for (const row of KB) if (row.match.test(q)) return row.answer;
  return FALLBACK;
}

const SUGGESTIONS = [
  "What is the gold/silver ratio?",
  "Explain purity and fineness",
  "What are bullion premiums?",
  "Gold bars vs coins?",
  "What is a troy ounce?",
];

export default function AssayPage() {
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Welcome to **BGM Assay** 🪙 — I answer questions about gold & silver bullion only. What would you like to know?",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: answerFor(trimmed) }]);
      setTyping(false);
    }, 650);
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-white">
      {/* Page header — matches Store pattern */}
      <div className="border-b border-[#D4AF37]/20 bg-gradient-to-r from-[#004225] to-[#0a0a0a]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-5">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/30 text-[#D4AF37] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40">
            <Coins className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div className="flex-1">
            <h1 className="font-[Playfair_Display] text-xl font-bold text-white">BGM Assay</h1>
            <p className="flex items-center gap-1.5 text-xs text-[#C0C0C0]">
              <Sparkles className="h-3 w-3 text-[#D4AF37]" /> Bullion knowledge assistant
            </p>
          </div>
          <span className="hidden items-center gap-1 rounded-full border border-[#004225] bg-[#004225]/20 px-3 py-1 text-[11px] text-[#7dd3a0] sm:flex">
            <ShieldCheck className="h-3 w-3" /> Bullion topics only
          </span>
        </div>
      </div>

      {/* Conversation area */}
      <div ref={scrollRef} className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        {msgs.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "bot" && (
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40">
                <Bot className="h-4 w-4 text-[#D4AF37]" />
              </div>
            )}
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#004225] text-white"
                  : "rounded-bl-sm border border-[#D4AF37]/20 bg-[#141414] text-[#E5E5E5]"
              }`}
              dangerouslySetInnerHTML={{
                __html: m.text.replace(/\*\*(.+?)\*\*/g, "<strong class='text-[#D4AF37]'>$1</strong>"),
              }}
            />
          </div>
        ))}
        {typing && (
          <div className="flex gap-3">
            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40">
              <Bot className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-[#D4AF37]/20 bg-[#141414] px-4 py-3">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37] [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D4AF37]" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions + composer pinned to bottom */}
      <div className="border-t border-[#D4AF37]/20 bg-[#0a0a0a]">
        <div className="mx-auto w-full max-w-3xl px-4 py-3">
          {msgs.length <= 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-[#C0C0C0] transition-colors hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gold or silver bullion…"
              className="flex-1 rounded-full bg-[#141414] px-4 py-3 text-sm text-white placeholder-[#666] outline-none ring-1 ring-[#D4AF37]/20 focus:ring-[#D4AF37]/60"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#0a0a0a] transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}