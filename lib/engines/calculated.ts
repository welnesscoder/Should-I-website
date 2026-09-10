import type { CalculatedDecisionConfig, CalculatedValues, DecisionResult } from "./types";
import { roundScore, scoreToVerdict } from "./normalize";

/**
 * Calculated decisions are bespoke per decision (see /lib/calculations), but every
 * compute() result is still normalized through the shared 0-100 verdict bands here
 * so scoring stays consistent across engines.
 */
export function computeCalculated(decision: CalculatedDecisionConfig, values: CalculatedValues): DecisionResult {
  const result = decision.compute(values);
  const score = roundScore(result.score);
  return {
    ...result,
    score,
    verdict: scoreToVerdict(score),
  };
}
