"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type {
  DecisionResult,
  ImportanceLevel,
  WeightedAnswers,
  WeightedComputedInputs,
  WeightedDecisionConfig,
} from "@/lib/engines/types";
import { COMPARISON_LABELS } from "@/lib/engines/types";
import { computeWeighted } from "@/lib/engines/weighted";
import ProgressSteps from "./ProgressSteps";

const IMPORTANCE_OPTIONS: { value: ImportanceLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function WeightedEngine({
  decision,
  initialAnswers,
  initialComputedInputs,
  onComplete,
}: {
  decision: WeightedDecisionConfig;
  initialAnswers?: WeightedAnswers;
  initialComputedInputs?: WeightedComputedInputs;
  onComplete: (result: DecisionResult, answers: WeightedAnswers, computedInputs: WeightedComputedInputs) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<WeightedAnswers>(initialAnswers ?? {});
  const [computedInputs, setComputedInputs] = useState<WeightedComputedInputs>(initialComputedInputs ?? {});

  const factor = decision.factors[stepIndex];
  const isLast = stepIndex === decision.factors.length - 1;
  const scaleLabels = factor.type === "subjective" ? factor.scaleLabels ?? COMPARISON_LABELS : COMPARISON_LABELS;

  const currentAnswer = answers[factor.id];
  const canContinue = factor.type === "computed" || currentAnswer !== undefined;

  function finishOrAdvance(nextAnswers: WeightedAnswers, nextComputed: WeightedComputedInputs) {
    if (isLast) {
      onComplete(computeWeighted(decision, nextAnswers, nextComputed), nextAnswers, nextComputed);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  function setValue(value: number) {
    setAnswers((prev) => ({
      ...prev,
      [factor.id]: { value, importance: prev[factor.id]?.importance ?? "medium" },
    }));
  }

  function setImportance(importance: ImportanceLevel) {
    setAnswers((prev) => ({
      ...prev,
      [factor.id]: { value: prev[factor.id]?.value ?? 0, importance },
    }));
  }

  function setComputedField(fieldId: string, value: number) {
    setComputedInputs((prev) => ({
      ...prev,
      [factor.id]: { ...prev[factor.id], [fieldId]: value },
    }));
  }

  function handleContinue() {
    finishOrAdvance(answers, computedInputs);
  }

  return (
    <div>
      <ProgressSteps current={stepIndex + 1} total={decision.factors.length} />
      <h2 className="font-serif text-2xl font-medium mb-6 text-balance">{factor.label}</h2>

      {factor.type === "computed" ? (
        <div className="flex flex-col gap-4 mb-6">
          {factor.inputs.map((field) => (
            <label key={field.id} className="block">
              <span className="block text-sm mb-1">{field.label}</span>
              <div className="flex items-center border-b-2 border-rule pb-1">
                {field.unit === "$" && <span className="font-mono mr-1">$</span>}
                <input
                  type="number"
                  step={field.step}
                  defaultValue={computedInputs[factor.id]?.[field.id] ?? field.default}
                  onChange={(e) => setComputedField(field.id, parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent outline-none text-lg font-mono focus-visible:outline-2 focus-visible:outline-ink"
                  aria-label={field.label}
                />
                {field.unit && field.unit !== "$" && <span className="font-mono ml-1 text-slate">{field.unit}</span>}
              </div>
            </label>
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-6">
            {scaleLabels.map((label, i) => {
              const value = i - 2;
              const selected = currentAnswer?.value === value;
              return (
                <button
                  key={label}
                  onClick={() => setValue(value)}
                  aria-pressed={selected}
                  className={
                    "text-left px-4 py-3 rounded-lg border text-base focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 " +
                    (selected ? "border-ink bg-ink text-paper" : "border-rule bg-white/50 hover:bg-white/80")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          {factor.allowImportance !== false && (
            <div className="mb-6">
              <p className="text-sm text-slate mb-2">How important is this to you?</p>
              <div className="flex gap-2">
                {IMPORTANCE_OPTIONS.map((opt) => {
                  const selected = (currentAnswer?.importance ?? "medium") === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setImportance(opt.value)}
                      aria-pressed={selected}
                      className={
                        "flex-1 py-2 rounded-full border text-sm focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 " +
                        (selected ? "border-ink bg-ink text-paper" : "border-rule bg-white/50 hover:bg-white/80")
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-3 rounded-md font-serif text-lg font-medium bg-ink text-paper disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        {isLast ? "See the verdict" : "Continue"}
      </button>

      {stepIndex > 0 && (
        <button
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          className="mt-5 inline-flex items-center gap-1 text-sm text-slate hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back
        </button>
      )}
    </div>
  );
}
