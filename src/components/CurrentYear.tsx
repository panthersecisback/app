"use client";

import { useState, useEffect } from "react";

export default function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Show nothing (or a fallback) until the year is ready on the client
  if (year === null) return null;

  return <>{year}</>;
}
