import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import { clamp } from "@/lib/engines/normalize";
import { simulateBuyVsRent } from "@/lib/calculations/mortgage";
import { formatCurrency } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "buy-vs-rent-home",
  slug: "should-i-buy-a-home-instead-of-renting",
  category: "money",
  engine: "calculated",
  title: "Should I buy a home instead of renting?",
  teaser: "A proper amortization model, with every assumption shown.",
  seo: {
    description:
      "An educational buy-vs-rent comparison using real mortgage amortization, appreciation, and opportunity cost — with every assumption shown.",
    keywords: ["should I buy a house", "rent vs buy calculator", "buy vs rent home"],
  },
  riskLevel: "sensitive",
  howItWorks:
    "Simulates both paths month by month over how long you plan to stay: mortgage amortization, property tax, insurance, and maintenance for buying; rent growth for renting; and what the money not spent on a down payment could have earned if invested instead. This is a simplified, educational model, not a market forecast — real returns, rates, and home prices are never this smooth.",
  inputFields: [
    { id: "homePrice", label: "Home price", type: "currency", default: 380000, step: 5000 },
    { id: "downPaymentPct", label: "Down payment", type: "percent", default: 10, step: 1 },
    { id: "mortgageRatePct", label: "Mortgage interest rate", type: "percent", default: 6.5, step: 0.1 },
    { id: "mortgageTermYears", label: "Mortgage term", type: "years", default: 30, step: 5 },
    { id: "yearsInProperty", label: "Years you plan to stay", type: "years", default: 7, step: 1 },
    { id: "monthlyRent", label: "Comparable monthly rent", type: "currency", default: 1900, step: 50 },
    { id: "propertyTaxPct", label: "Property tax (annual, % of home value)", type: "percent", default: 1.1, step: 0.1 },
    { id: "insurancePct", label: "Homeowners insurance (annual, % of home value)", type: "percent", default: 0.4, step: 0.1 },
    { id: "maintenancePct", label: "Maintenance (annual, % of home value)", type: "percent", default: 1, step: 0.1 },
    { id: "buyingClosingCostPct", label: "Closing costs to buy (% of price)", type: "percent", default: 3, step: 0.5 },
    { id: "sellingCostPct", label: "Selling costs later (% of sale price)", type: "percent", default: 6, step: 0.5 },
    { id: "annualAppreciationPct", label: "Assumed home appreciation (annual %)", type: "percent", default: 3, step: 0.5 },
    { id: "annualRentGrowthPct", label: "Assumed rent growth (annual %)", type: "percent", default: 3, step: 0.5 },
    { id: "opportunityCostRatePct", label: "Assumed investment return on money not spent on a home (annual %)", type: "percent", default: 6, step: 0.5 },
  ],
  compute: (values) => {
    const inputs = {
      homePrice: num(values, "homePrice"),
      downPaymentPct: num(values, "downPaymentPct"),
      mortgageRatePct: num(values, "mortgageRatePct"),
      mortgageTermYears: num(values, "mortgageTermYears"),
      yearsInProperty: Math.max(1, num(values, "yearsInProperty")),
      monthlyRent: num(values, "monthlyRent"),
      propertyTaxPct: num(values, "propertyTaxPct"),
      insurancePct: num(values, "insurancePct"),
      maintenancePct: num(values, "maintenancePct"),
      buyingClosingCostPct: num(values, "buyingClosingCostPct"),
      sellingCostPct: num(values, "sellingCostPct"),
      annualAppreciationPct: num(values, "annualAppreciationPct"),
      annualRentGrowthPct: num(values, "annualRentGrowthPct"),
      opportunityCostRatePct: num(values, "opportunityCostRatePct"),
    };

    const result = simulateBuyVsRent(inputs);
    const diff = result.totalCostRenting - result.totalCostBuying; // positive => buying wins under these assumptions
    const avgCost = (Math.abs(result.totalCostBuying) + Math.abs(result.totalCostRenting)) / 2 || 1;
    const score = clamp(50 + (diff / avgCost) * 60);

    const buyingLooksBetter = diff > 0;
    const costComponentScore = score;
    const breakEvenScore = result.breakEvenYear
      ? clamp(100 - (result.breakEvenYear / inputs.yearsInProperty) * 60)
      : buyingLooksBetter
        ? 70
        : 30;

    const headline = buyingLooksBetter
      ? `Under these assumptions, buying comes out about ${formatCurrency(Math.abs(diff))} ahead over ${inputs.yearsInProperty} years.`
      : `Under these assumptions, renting comes out about ${formatCurrency(Math.abs(diff))} ahead over ${inputs.yearsInProperty} years.`;

    return {
      score: 0.7 * costComponentScore + 0.3 * breakEvenScore,
      verdict: "MAYBE",
      headline,
      explanation:
        "This is an educational estimate built on the assumptions above, not a personal financial recommendation — small changes to the rate, appreciation, or how long you stay can shift the answer.",
      breakdown: [
        { label: "Total cost comparison", score: Math.round(costComponentScore) },
        { label: "Break-even timing", score: Math.round(breakEvenScore) },
      ],
      biggestReasonYes: buyingLooksBetter ? "Total cost comparison" : undefined,
      biggestReasonHesitate: !buyingLooksBetter ? "Total cost comparison" : undefined,
      insights: [
        { label: "Monthly mortgage payment", value: formatCurrency(result.monthlyPayment) },
        { label: "Estimated equity after horizon", value: formatCurrency(Math.max(0, result.equityAtEnd)) },
        {
          label: "Approximate break-even point",
          value: result.breakEvenYear ? `Year ${result.breakEvenYear}` : `Beyond ${inputs.yearsInProperty} years`,
        },
      ],
      warnings: [
        "Educational estimate only — not professional financial or tax advice. Real rates, home prices, and rents don't move in a straight line.",
      ],
    };
  },
};

export default decision;
