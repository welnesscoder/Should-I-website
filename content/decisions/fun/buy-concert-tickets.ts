import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import { clamp } from "@/lib/engines/normalize";
import { formatCurrency } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "buy-concert-tickets",
  slug: "should-i-buy-tickets-to-this-concert",
  category: "fun",
  engine: "calculated",
  title: "Should I buy tickets to this concert?",
  teaser: "Price against what's actually left in the budget.",
  seo: {
    description: "Check the ticket price against your remaining fun budget and how much you want to go.",
    keywords: ["should I buy concert tickets", "concert ticket decision"],
  },
  inputFields: [
    { id: "ticketPrice", label: "Ticket price (total, fees included)", type: "currency", default: 120, step: 10 },
    { id: "funBudgetLeft", label: "Fun budget left this month", type: "currency", default: 150, step: 10 },
    { id: "howBadlyWantToGo", label: "How badly do you want to go?", type: "number", default: 7, min: 1, max: 10, step: 1 },
  ],
  compute: (values) => {
    const ticketPrice = num(values, "ticketPrice");
    const funBudgetLeft = num(values, "funBudgetLeft");
    const wantToGo = num(values, "howBadlyWantToGo");

    const burdenPct = funBudgetLeft > 0 ? (ticketPrice / funBudgetLeft) * 100 : ticketPrice > 0 ? 999 : 0;
    const budgetScore = clamp(115 - burdenPct);
    const desireScore = clamp(wantToGo * 10);

    const score = 0.6 * budgetScore + 0.4 * desireScore;

    const headline =
      budgetScore >= 50
        ? `At ${formatCurrency(ticketPrice)} against a ${formatCurrency(funBudgetLeft)} budget, this fits.`
        : `${formatCurrency(ticketPrice)} stretches your ${formatCurrency(funBudgetLeft)} fun budget further than it should.`;

    return {
      score,
      verdict: "MAYBE",
      headline,
      explanation: "Budget fit carries more weight than excitement here, but both matter.",
      breakdown: [
        { label: "Fits your fun budget", score: Math.round(budgetScore) },
        { label: "How much you want to go", score: Math.round(desireScore) },
      ],
      biggestReasonYes: desireScore >= 70 ? "How much you want to go" : budgetScore >= 70 ? "Fits your fun budget" : undefined,
      biggestReasonHesitate: budgetScore < 40 ? "Fits your fun budget" : undefined,
      insights: [{ label: "Share of remaining fun budget", value: `${Math.round(burdenPct)}%` }],
    };
  },
};

export default decision;
