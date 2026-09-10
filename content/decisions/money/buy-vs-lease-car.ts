import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import { clamp } from "@/lib/engines/normalize";
import { formatCurrency } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "buy-vs-lease-car",
  slug: "should-i-buy-instead-of-lease-my-next-car",
  category: "money",
  engine: "calculated",
  title: "Should I buy instead of lease my next car?",
  teaser: "Compare the real 5-year cost, not the monthly payment.",
  seo: {
    description:
      "Compare buying and leasing on total 5-year cost and upfront cash needed — not just the monthly payment.",
    keywords: ["should I buy or lease a car", "buy vs lease car calculator"],
  },
  howItWorks:
    "Compares the all-in 5-year cost of each option, plus how much cash each requires upfront, since that changes what's realistic even when the totals are close.",
  inputFields: [
    { id: "buyTotal5yr", label: "Total cost to buy over 5 years (loan, maintenance, minus expected resale)", type: "currency", default: 34000, step: 500 },
    { id: "leaseTotal5yr", label: "Total cost to lease over 5 years (all lease payments and fees)", type: "currency", default: 27000, step: 500 },
    { id: "buyUpfront", label: "Cash needed upfront to buy (down payment + fees)", type: "currency", default: 5000, step: 250 },
    { id: "leaseUpfront", label: "Cash due at signing to lease", type: "currency", default: 2500, step: 250 },
  ],
  compute: (values) => {
    const buyTotal = num(values, "buyTotal5yr");
    const leaseTotal = num(values, "leaseTotal5yr");
    const buyUpfront = num(values, "buyUpfront");
    const leaseUpfront = num(values, "leaseUpfront");

    const avgTotal = (buyTotal + leaseTotal) / 2 || 1;
    const totalCostScore = clamp(50 + ((leaseTotal - buyTotal) / avgTotal) * 100 * 0.6);

    const avgUpfront = (buyUpfront + leaseUpfront) / 2 || 1;
    const liquidityScore = clamp(50 + ((leaseUpfront - buyUpfront) / avgUpfront) * 50);

    const score = 0.75 * totalCostScore + 0.25 * liquidityScore;
    const diff = Math.abs(buyTotal - leaseTotal);
    const cheaperOption = buyTotal <= leaseTotal ? "buying" : "leasing";

    return {
      score,
      verdict: "MAYBE",
      headline:
        cheaperOption === "buying"
          ? `Buying comes out about ${formatCurrency(diff)} cheaper over 5 years.`
          : `Leasing comes out about ${formatCurrency(diff)} cheaper over 5 years.`,
      explanation:
        "This compares total cost of ownership over 5 years against how much cash each option ties up upfront.",
      breakdown: [
        { label: "5-year total cost", score: Math.round(totalCostScore) },
        { label: "Upfront cash needed", score: Math.round(liquidityScore) },
      ],
      biggestReasonYes: totalCostScore >= 50 ? "5-year total cost" : undefined,
      biggestReasonHesitate: liquidityScore < 50 ? "Upfront cash needed" : undefined,
      insights: [
        { label: "5-year cost difference", value: formatCurrency(diff) },
        { label: "Upfront cash, buy vs. lease", value: `${formatCurrency(buyUpfront)} vs. ${formatCurrency(leaseUpfront)}` },
      ],
      warnings:
        buyTotal <= 0 || leaseTotal <= 0
          ? ["Enter realistic 5-year totals for both options to get a meaningful comparison."]
          : undefined,
    };
  },
};

export default decision;
