import type {
  DecisionResult,
  Insight,
  ResultFactor,
  WeightedAnswers,
  WeightedComputedInputs,
  WeightedDecisionConfig,
  WeightedFactor,
} from "./types";
import { IMPORTANCE_MULTIPLIER } from "./types";
import { clamp, roundScore, scoreToVerdict } from "./normalize";

const DEFAULT_HEADLINES: Record<string, string> = {
  YES: "This looks like a clear yes.",
  PROBABLY_YES: "This leans yes, with a little to think about.",
  MAYBE: "This is a genuine toss-up.",
  PROBABLY_NO: "This leans no, but it's not a hard stop.",
  NO: "This looks like a no, at least for now.",
};

function factorValue(
  factor: WeightedFactor,
  answers: WeightedAnswers,
  computedInputs: WeightedComputedInputs,
): number {
  if (factor.type === "computed") {
    const values = computedInputs[factor.id] ?? {};
    const inputValues: Record<string, number> = {};
    for (const field of factor.inputs) {
      inputValues[field.id] = values[field.id] ?? (field.default as number);
    }
    return clamp(factor.compute(inputValues), -2, 2);
  }
  return answers[factor.id]?.value ?? 0;
}

function factorImportance(factor: WeightedFactor, answers: WeightedAnswers) {
  if (factor.allowImportance === false) return "medium" as const;
  return answers[factor.id]?.importance ?? "medium";
}

export function computeWeighted(
  decision: WeightedDecisionConfig,
  answers: WeightedAnswers,
  computedInputs: WeightedComputedInputs = {},
): DecisionResult {
  const factors = decision.factors;
  const contributions: { factor: WeightedFactor; value: number; weighted: number; importance: string }[] = [];

  let weightedSum = 0;
  let maxWeightedSum = 0;

  for (const factor of factors) {
    const value = factorValue(factor, answers, computedInputs);
    const importance = factorImportance(factor, answers);
    const multiplier = IMPORTANCE_MULTIPLIER[importance];
    const weighted = value * multiplier;
    weightedSum += weighted;
    maxWeightedSum += 2 * multiplier;
    contributions.push({ factor, value, weighted, importance });
  }

  const normalized = maxWeightedSum > 0 ? 50 + (weightedSum / maxWeightedSum) * 50 : 50;
  const score = clamp(normalized);
  const verdict = scoreToVerdict(score);

  const breakdown: ResultFactor[] = contributions.map((c) => ({
    label: c.factor.shortLabel,
    score: roundScore(50 + c.value * 25),
    weight: c.importance as "low" | "medium" | "high",
  }));

  const sorted = [...contributions].sort((a, b) => b.weighted - a.weighted);
  const topPositive = sorted.find((c) => c.value > 0);
  const topNegative = [...sorted].reverse().find((c) => c.value < 0);

  const insights: Insight[] = [];
  for (const factor of factors) {
    if (factor.type === "computed" && factor.insight) {
      const values = computedInputs[factor.id] ?? {};
      const inputValues: Record<string, number> = {};
      for (const field of factor.inputs) {
        inputValues[field.id] = values[field.id] ?? (field.default as number);
      }
      const insight = factor.insight(inputValues);
      if (insight) insights.push(insight);
    }
  }

  const headline = decision.verdictHeadlines?.[verdict] ?? DEFAULT_HEADLINES[verdict];

  const explanation =
    topPositive && topNegative
      ? `${topPositive.factor.shortLabel} makes the strongest case for yes; ${topNegative.factor.shortLabel.toLowerCase()} is the biggest thing holding it back.`
      : topPositive
        ? `${topPositive.factor.shortLabel} is doing most of the work here.`
        : topNegative
          ? `${topNegative.factor.shortLabel} is the main thing pulling this toward no.`
          : "Everything you weighed in on landed close to neutral.";

  return {
    score: roundScore(score),
    verdict,
    headline,
    explanation,
    breakdown,
    biggestReasonYes: topPositive?.factor.shortLabel,
    biggestReasonHesitate: topNegative?.factor.shortLabel,
    insights: insights.length ? insights : undefined,
  };
}
