"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ remainingMs, onComplete }) {
  const [ms, setMs] = useState(remainingMs ?? 0);

  useEffect(() => {
    setMs(remainingMs ?? 0);
  }, [remainingMs]);

  useEffect(() => {
    if (ms <= 0) return;
    const interval = setInterval(() => {
      setMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [ms > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds < 60 && totalSeconds > 0;

  return (
    <span
      className={`font-mono text-lg tabular-nums ${
        isUrgent ? "text-destructive animate-pulse font-bold" : "text-muted-foreground"
      }`}
    >
      {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
