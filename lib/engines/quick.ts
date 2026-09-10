import type { DecisionResult, QuickAnswers, QuickDecisionConfig, ResultFactor } from "./types";
import { clamp, roundScore, scoreToVerdict } from "./normalize";

const SHIFT_PER_QUESTION = 18;

export function computeQuick(decision: QuickDecisionConfig, answers: QuickAnswers): DecisionResult {
  const breakdown: ResultFactor[] = [];
  let score = 50;

  for (const q of decision.questions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const affirmative = q.agreeShiftsToward ?? "yes";
    const agreed = answer === "yes";
    const movesTowardYes = agreed === (affirmative === "yes");
    score += movesTowardYes ? SHIFT_PER_QUESTION : -SHIFT_PER_QUESTION;
    breakdown.push({
      label: q.text,
      score: movesTowardYes ? 75 : 25,
    });
  }

  score = clamp(score);
  const verdict = scoreToVerdict(score);
  const copy = decision.verdictCopy[verdict];

  return {
    score: roundScore(score),
    verdict,
    headline: copy.headline,
    explanation: copy.explanation,
    breakdown,
  };
}
