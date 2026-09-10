import { describe, expect, it } from "vitest";
import { DECISIONS } from "../index";
import { computeQuick } from "@/lib/engines/quick";
import { computeWeighted } from "@/lib/engines/weighted";
import { computeCalculated } from "@/lib/engines/calculated";
import type { CalculatedValues, QuickAnswers, WeightedAnswers } from "@/lib/engines/types";
import { VERDICT_LABEL } from "@/lib/engines/types";

function isValidResult(result: { score: number; verdict: string; headline: string; breakdown: unknown[] }) {
  expect(result.score).toBeGreaterThanOrEqual(0);
  expect(result.score).toBeLessThanOrEqual(100);
  expect(Object.keys(VERDICT_LABEL)).toContain(result.verdict);
  expect(result.headline.length).toBeGreaterThan(0);
  expect(Array.isArray(result.breakdown)).toBe(true);
}

describe("all decision configs", () => {
  it("has exactly 26 unique decisions with unique slugs", () => {
    expect(DECISIONS.length).toBe(26);
    expect(new Set(DECISIONS.map((d) => d.id)).size).toBe(26);
    expect(new Set(DECISIONS.map((d) => d.slug)).size).toBe(26);
  });

  for (const decision of DECISIONS) {
    it(`${decision.id} (${decision.engine}) computes a valid result end-to-end`, () => {
      if (decision.engine === "quick") {
        const allYes: QuickAnswers = {};
        const allNo: QuickAnswers = {};
        for (const q of decision.questions) {
          allYes[q.id] = "yes";
          allNo[q.id] = "no";
        }
        isValidResult(computeQuick(decision, allYes));
        isValidResult(computeQuick(decision, allNo));
        for (const verdict of Object.keys(decision.verdictCopy)) {
          expect(decision.verdictCopy[verdict as keyof typeof decision.verdictCopy].headline.length).toBeGreaterThan(0);
        }
      } else if (decision.engine === "weighted") {
        const answers: WeightedAnswers = {};
        for (const f of decision.factors) {
          if (f.type === "subjective") answers[f.id] = { value: 2, importance: "high" };
        }
        isValidResult(computeWeighted(decision, answers));
        isValidResult(computeWeighted(decision, {}));
      } else {
        const values: CalculatedValues = {};
        for (const field of decision.inputFields) {
          values[field.id] = field.default;
        }
        isValidResult(computeCalculated(decision, values));
      }
    });
  }
});
