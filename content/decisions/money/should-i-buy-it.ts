import type { CalculatedDecisionConfig, CalculatedValues } from "@/lib/engines/types";
import {
  affordabilityScore,
  costPerUse as calcCostPerUse,
  disposableIncome,
  estimatedHourlyRate,
  impulseRiskScore,
  purchaseBurdenPct,
  usageScore,
  workHoursForPrice,
  type NeedVsWant,
} from "@/lib/calculations/affordability";
import { formatCurrency, formatCurrencyPrecise, formatHours, formatPercent } from "@/lib/format";

function num(values: CalculatedValues, id: string): number {
  return Number(values[id] ?? 0);
}

const decision: CalculatedDecisionConfig = {
  id: "should-i-buy-it",
  slug: "should-i-buy-it",
  category: "money",
  engine: "calculated",
  title: "Should I buy it?",
  teaser: "The general-purpose purchase check: affordability, usefulness, and impulse risk, all in one score.",
  seo: {
    description:
      "Should you buy it? Check affordability, how much you'll actually use it, and impulse risk — get a 0-100 score with the reasoning shown.",
    keywords: ["should I buy it", "should I buy this", "purchase decision calculator", "should I make this purchase"],
  },
  howItWorks:
    "Combines three components: affordability (price against your disposable income and savings), usage value (how often you'll use it and for how long, which drives cost per use), and impulse risk (whether you already own something similar, how long you've wanted it, and need vs. want). Affordability and usage value each carry 40% of the score; impulse risk carries the remaining 20%.",
  faqs: [
    {
      question: "Why does 'how long you've wanted it' matter?",
      answer:
        "It's a rough proxy for impulse. Something you've wanted for months is less likely to be a same-day regret than something you saw an hour ago.",
    },
  ],
  inputFields: [
    { id: "price", label: "Item price", type: "currency", default: 250, step: 10 },
    { id: "monthlyTakeHome", label: "Monthly take-home income", type: "currency", default: 4200, step: 100 },
    { id: "essentialExpenses", label: "Essential monthly expenses", type: "currency", default: 2800, step: 100 },
    { id: "savings", label: "Savings available", type: "currency", default: 6000, step: 500 },
    { id: "usesPerMonth", label: "Expected uses per month", type: "number", default: 8, step: 1 },
    { id: "ownershipMonths", label: "Expected ownership duration (months)", type: "months", default: 36, step: 6 },
    {
      id: "alreadyOwnsAlternative",
      label: "Do you already own something that serves the same purpose?",
      type: "boolean",
      default: false,
    },
    {
      id: "needVsWant",
      label: "Is this more of a need or a want?",
      type: "select",
      default: "want",
      options: [
        { value: "need", label: "Need" },
        { value: "want", label: "Want" },
      ],
    },
    { id: "howLongWantedMonths", label: "How long have you wanted it? (months)", type: "months", default: 2, step: 1 },
    {
      id: "hoursWorkedPerMonth",
      label: "Hours worked per month (optional, for the work-time cost)",
      type: "number",
      default: 160,
      step: 5,
      optional: true,
    },
  ],
  compute: (values) => {
    const price = num(values, "price");
    const monthlyTakeHome = num(values, "monthlyTakeHome");
    const essentialExpenses = num(values, "essentialExpenses");
    const savings = num(values, "savings");
    const usesPerMonth = num(values, "usesPerMonth");
    const ownershipMonths = num(values, "ownershipMonths");
    const alreadyOwnsAlternative = Boolean(values.alreadyOwnsAlternative);
    const needVsWant = (values.needVsWant as NeedVsWant) ?? "want";
    const howLongWantedMonths = num(values, "howLongWantedMonths");
    const hoursWorkedPerMonth = num(values, "hoursWorkedPerMonth");

    const disposable = disposableIncome(monthlyTakeHome, essentialExpenses);
    const burdenPct = purchaseBurdenPct(price, disposable);
    const costPerUseVal = calcCostPerUse(price, usesPerMonth, ownershipMonths);
    const hourlyRate = estimatedHourlyRate(monthlyTakeHome, hoursWorkedPerMonth);
    const workHours = workHoursForPrice(price, hourlyRate ?? 0);

    const affordability = affordabilityScore({ burdenPct, savings, price });
    const usage = usageScore({ usesPerMonth, costPerUse: costPerUseVal });
    const impulseRisk = impulseRiskScore({ alreadyOwnsAlternative, howLongWantedMonths, needVsWant });
    const timingScore = 100 - impulseRisk;

    const score = 0.4 * affordability + 0.4 * usage + 0.2 * timingScore;

    const components = [
      { label: "Affordability", score: Math.round(affordability) },
      { label: "Usage value", score: Math.round(usage) },
      { label: "Purchase timing", score: Math.round(timingScore) },
    ];
    const sorted = [...components].sort((a, b) => b.score - a.score);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];

    const reasonCopy: Record<string, string> = {
      Affordability: "It's a small enough share of your disposable income that it won't pinch.",
      "Usage value": "You'll use this frequently enough that the cost per use is genuinely low.",
      "Purchase timing": "This isn't a same-day impulse — you've thought about it and it fills a real gap.",
    };
    const hesitateCopy: Record<string, string> = {
      Affordability: `It takes a meaningful chunk of this month's disposable income (about ${formatPercent(burdenPct)}).`,
      "Usage value": "At this expected usage, the cost per use stays high enough to give pause.",
      "Purchase timing": alreadyOwnsAlternative
        ? "You already own something that does this job."
        : "This has the shape of an impulse buy more than a planned one.",
    };

    const insights = [
      { label: "Cost per use", value: `${formatCurrencyPrecise(costPerUseVal)} per use` },
      { label: "Share of disposable income", value: formatPercent(Math.min(burdenPct, 999)) },
    ];
    if (workHours !== undefined) {
      insights.unshift({ label: "Work-time cost", value: `About ${formatHours(workHours)} of work` });
    }

    return {
      score,
      verdict: "MAYBE",
      headline:
        score >= 61
          ? "This looks like a good use of the money."
          : score <= 39
            ? "This looks like a stretch, financially or in how much you'd actually use it."
            : "This is a real toss-up — it could go either way.",
      explanation: `${strongest.label} makes the strongest case; ${weakest.label.toLowerCase()} is the biggest thing worth double-checking.`,
      breakdown: components,
      biggestReasonYes: reasonCopy[strongest.label],
      biggestReasonHesitate: hesitateCopy[weakest.label],
      insights,
      warnings: disposable <= 0 ? ["Essential expenses currently meet or exceed take-home income — any discretionary purchase adds real strain."] : undefined,
    };
  },
};

export default decision;
