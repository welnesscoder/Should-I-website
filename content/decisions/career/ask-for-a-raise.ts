import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import { clamp } from "@/lib/engines/normalize";
import { formatCurrency, formatPercent } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "ask-for-a-raise",
  slug: "should-i-ask-for-a-raise",
  category: "career",
  engine: "calculated",
  title: "Should I ask for a raise?",
  teaser: "Where you sit against the market, in numbers.",
  seo: {
    description: "See how far your pay sits from market rate, and how long it's been since you last checked.",
    keywords: ["should I ask for a raise", "am I underpaid", "raise calculator"],
  },
  howItWorks:
    "Compares your current pay to market rate for your role, and factors in how long it's been since your last raise — a bigger gap and a longer gap both strengthen the case.",
  inputFields: [
    { id: "marketRate", label: "Market rate for your role", type: "currency", default: 95000, step: 1000 },
    { id: "currentPay", label: "Your current pay", type: "currency", default: 82000, step: 1000 },
    { id: "monthsSinceLastRaise", label: "Months since your last raise", type: "number", default: 14, step: 1 },
  ],
  compute: (values) => {
    const marketRate = num(values, "marketRate");
    const currentPay = num(values, "currentPay");
    const monthsSinceLastRaise = num(values, "monthsSinceLastRaise");

    const gap = marketRate - currentPay;
    const pct = currentPay > 0 ? (gap / currentPay) * 100 : 0;

    const marketGapScore = clamp(50 + pct * 4);
    const timingScore = clamp(30 + monthsSinceLastRaise * 3);

    const score = 0.7 * marketGapScore + 0.3 * timingScore;

    const headline =
      pct >= 5
        ? `You're sitting about ${formatCurrency(gap)} (${formatPercent(pct)}) under market — that's worth a conversation.`
        : pct <= -5
          ? `You're already about ${formatPercent(Math.abs(pct))} above market rate — a raise pitch will need a different angle than pay alone.`
          : `You're within ${formatPercent(Math.abs(pct))} of market — close enough that timing and results will matter more than the gap itself.`;

    return {
      score,
      verdict: "MAYBE",
      headline,
      explanation:
        "Market gap carries the most weight here, with how long it's been since your last raise adding a bit more urgency.",
      breakdown: [
        { label: "Gap to market rate", score: Math.round(marketGapScore) },
        { label: "Time since last raise", score: Math.round(timingScore) },
      ],
      biggestReasonYes: pct >= 5 ? "Gap to market rate" : monthsSinceLastRaise >= 12 ? "Time since last raise" : undefined,
      biggestReasonHesitate: pct < 0 ? "Gap to market rate" : undefined,
      insights: [
        { label: "Gap to market rate", value: formatCurrency(gap) },
        { label: "As a percentage", value: formatPercent(pct) },
      ],
    };
  },
};

export default decision;
