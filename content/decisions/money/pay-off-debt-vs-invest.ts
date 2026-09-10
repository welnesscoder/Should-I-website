import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import { compareDebtVsInvest } from "@/lib/calculations/debtVsInvest";
import { formatCurrency, formatPercent } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "pay-off-debt-vs-invest",
  slug: "should-i-pay-off-debt-before-investing",
  category: "money",
  engine: "calculated",
  title: "Should I pay off debt before investing?",
  teaser: "Guaranteed savings vs. an uncertain expected return.",
  seo: {
    description:
      "Compare the guaranteed interest you'd avoid by paying off debt against an uncertain expected investment return.",
    keywords: ["pay off debt or invest", "debt vs investing calculator"],
  },
  riskLevel: "sensitive",
  howItWorks:
    "Paying off debt guarantees a return equal to its interest rate. Investing offers an expected return that is never guaranteed, so it's discounted here to reflect that uncertainty before the two are compared. This is an educational comparison, not investment advice.",
  inputFields: [
    { id: "debtRatePct", label: "Debt interest rate", type: "percent", default: 19, step: 0.5 },
    { id: "debtBalance", label: "Debt balance", type: "currency", default: 6000, step: 500 },
    { id: "minimumPayment", label: "Minimum monthly payment", type: "currency", default: 150, step: 10 },
    { id: "availableCash", label: "Extra cash available each month", type: "currency", default: 400, step: 50 },
    {
      id: "hasEmergencyFund",
      label: "Do you already have 3+ months of expenses saved separately?",
      type: "boolean",
      default: true,
    },
    { id: "expectedReturnPct", label: "Expected investment return (annual)", type: "percent", default: 7, step: 0.5 },
    { id: "investmentTimeHorizonYears", label: "Investment time horizon", type: "years", default: 10, step: 1 },
  ],
  compute: (values) => {
    const debtRatePct = num(values, "debtRatePct");
    const debtBalance = num(values, "debtBalance");
    const availableCash = num(values, "availableCash");
    const expectedReturnPct = num(values, "expectedReturnPct");
    const investmentTimeHorizonYears = num(values, "investmentTimeHorizonYears");
    const hasEmergencyFund = Boolean(values.hasEmergencyFund);

    const result = compareDebtVsInvest({
      debtRatePct,
      debtBalance,
      expectedReturnPct,
      investmentTimeHorizonYears,
      availableCash,
      hasEmergencyFund,
    });

    const guaranteedScore = Math.min(100, debtRatePct * 3);
    const expectedScore = Math.min(100, result.riskAdjustedExpectedReturnPct * 3);
    const emergencyFundScore = hasEmergencyFund ? 90 : 25;

    const favorsPayoff = result.score < 50;

    return {
      score: 100 - result.score,
      verdict: "MAYBE",
      headline: favorsPayoff
        ? `Under these numbers, paying off the debt's guaranteed ${formatPercent(debtRatePct)} looks stronger than the risk-adjusted expected return.`
        : `Under these numbers, the risk-adjusted expected return looks stronger than the guaranteed ${formatPercent(debtRatePct)} from paying off debt.`,
      explanation:
        "This weighs a guaranteed outcome against an uncertain one — it's an educational comparison, not a personal investment recommendation.",
      breakdown: [
        { label: "Guaranteed return from payoff", score: Math.round(guaranteedScore) },
        { label: "Risk-adjusted expected return", score: Math.round(expectedScore) },
        { label: "Emergency fund readiness", score: Math.round(emergencyFundScore) },
      ],
      biggestReasonYes: favorsPayoff ? "Guaranteed return from payoff" : undefined,
      biggestReasonHesitate: !favorsPayoff ? "Guaranteed return from payoff" : undefined,
      insights: [
        { label: "Guaranteed interest avoided", value: `${formatPercent(debtRatePct)} per year` },
        {
          label: "Risk-adjusted expected return",
          value: `${formatPercent(result.riskAdjustedExpectedReturnPct)} per year (of a ${formatPercent(expectedReturnPct)} assumption)`,
        },
        { label: "Debt balance", value: formatCurrency(debtBalance) },
      ],
      warnings: result.emergencyFundWarning
        ? [
            "Without an emergency fund, an uncertain investment return carries more risk than usual — most educational guidance favors building that cushion first.",
          ]
        : [
            "Educational comparison only — not investment advice. Actual investment returns are never guaranteed and can be negative in any given year.",
          ],
    };
  },
};

export default decision;
