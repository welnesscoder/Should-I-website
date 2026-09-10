import type { Verdict } from "./types";

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** 0–19 NO · 20–39 PROBABLY_NO · 40–60 MAYBE · 61–80 PROBABLY_YES · 81–100 YES */
export function scoreToVerdict(score: number): Verdict {
  const s = clamp(Math.round(score));
  if (s <= 19) return "NO";
  if (s <= 39) return "PROBABLY_NO";
  if (s <= 60) return "MAYBE";
  if (s <= 80) return "PROBABLY_YES";
  return "YES";
}

export function roundScore(score: number): number {
  return Math.round(clamp(score));
}
