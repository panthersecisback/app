"use client";

import { useEffect, useState } from "react";

const ASCII_LOGO = [
  "  _       __     __                             ",
  " | |     / /__  / /________  ____ ___  ___      ",
  " | | /| / / _ \\/ / ___/ __ \\/ __ `__ \\/ _ \\     ",
  " | |/ |/ /  __/ / /__/ /_/ / / / / / /  __/     ",
  " |__/|__/\\___/_/\\___/\\____/_/ /_/ /_/\\___/      ",
  "                                                ",
  "              T O   B G M   A I                 ",
];

export default function BootSequence({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<"ascii" | "binary" | "done">("ascii");
  const [lines, setLines] = useState(0);

  useEffect(() => {
    // 1. Type out the ASCII lines one by one
    if (lines < ASCII_LOGO.length) {
      const timeout = setTimeout(() => {
        setLines((prev) => prev + 1);
      }, 150); // Speed of line printing
      return () => clearTimeout(timeout);
    } 
    // 2. Once ASCII is done, switch to binary rain
    else if (stage === "ascii") {
      const timeout = setTimeout(() => {
        setStage("binary");
      }, 600); // Pause before binary starts
      return () => clearTimeout(timeout);
    }
    // 3. Then finish and show the app
    else if (stage === "binary") {
      const timeout = setTimeout(() => {
        setStage("done");
      }, 1800); // How long the binary rain lasts
      return () => clearTimeout(timeout);
    }
  }, [lines, stage]);

  // If done, render the actual page
  if (stage === "done") {
    return <>{children}</>;
  }

  // Otherwise, render the boot screen
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] text-[#D4AF37] font-mono overflow-hidden">
      
      {/* ASCII Stage */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${stage === "ascii" ? "opacity-100" : "opacity-0"}`}>
        <div className="text-left whitespace-pre text-xs sm:text-sm md:text-base leading-tight drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
          {ASCII_LOGO.slice(0, lines).map((line, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">
              {line}
            </div>
          ))}
          {/* Blinking Cursor */}
          {lines < ASCII_LOGO.length && (
            <span className="inline-block w-2 h-4 bg-[#D4AF37] animate-pulse ml-1 align-middle" />
          )}
        </div>
      </div>

      {/* Binary Rain Stage */}
      {stage === "binary" && (
        <div className="absolute inset-0 flex flex-wrap gap-1 p-4 opacity-30 animate-in fade-in duration-300">
          {Array.from({ length: 400 }).map((_, i) => (
            <span
              key={i}
              className="text-[10px] text-[#D4AF37] animate-pulse"
              style={{
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 1.5}s`,
                opacity: Math.random() * 0.8,
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </span>
          ))}
        </div>
      )}

      {/* Flash & Fade Out overlay */}
      <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-300 ${stage === "binary" ? "opacity-0" : "opacity-0"}`} />
    </div>
  );
}
