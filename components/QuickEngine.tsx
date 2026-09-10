"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { DecisionResult, QuickAnswers, QuickDecisionConfig } from "@/lib/engines/types";
import { computeQuick } from "@/lib/engines/quick";
import ProgressSteps from "./ProgressSteps";

export default function QuickEngine({
  decision,
  initialAnswers,
  onComplete,
}: {
  decision: QuickDecisionConfig;
  initialAnswers?: QuickAnswers;
  onComplete: (result: DecisionResult, answers: QuickAnswers) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuickAnswers>(initialAnswers ?? {});

  const question = decision.questions[stepIndex];
  const isLast = stepIndex === decision.questions.length - 1;

  function answer(choice: "yes" | "no") {
    const next = { ...answers, [question.id]: choice };
    setAnswers(next);
    if (isLast) {
      onComplete(computeQuick(decision, next), next);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div>
      <ProgressSteps current={stepIndex + 1} total={decision.questions.length} />
      <h2 className="font-serif text-2xl font-medium mb-6 text-balance">{question.text}</h2>
      <div className="flex gap-3">
        <button
          onClick={() => answer("yes")}
          className="flex-1 py-4 rounded-lg border border-rule bg-white/50 hover:bg-white/80 text-lg font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          Yes
        </button>
        <button
          onClick={() => answer("no")}
          className="flex-1 py-4 rounded-lg border border-rule bg-white/50 hover:bg-white/80 text-lg font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          No
        </button>
      </div>
      {stepIndex > 0 && (
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          className="mt-5 inline-flex items-center gap-1 text-sm text-slate hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          <ArrowLeft size={14} /> Back
        </button>
      )}
    </div>
  );
}
