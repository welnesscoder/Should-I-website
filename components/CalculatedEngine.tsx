"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { CalculatedDecisionConfig, CalculatedValues, DecisionResult } from "@/lib/engines/types";
import { computeCalculated } from "@/lib/engines/calculated";
import ProgressSteps from "./ProgressSteps";

const UNIT_SUFFIX: Record<string, string> = {
  currency: "$",
  percent: "%",
  months: "months",
  years: "years",
};

function initialValues(decision: CalculatedDecisionConfig): CalculatedValues {
  const values: CalculatedValues = {};
  for (const field of decision.inputFields) values[field.id] = field.default;
  return values;
}

export default function CalculatedEngine({
  decision,
  initialValues: initialValuesProp,
  onComplete,
}: {
  decision: CalculatedDecisionConfig;
  initialValues?: CalculatedValues;
  onComplete: (result: DecisionResult, values: CalculatedValues) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<CalculatedValues>(() => initialValuesProp ?? initialValues(decision));

  const field = decision.inputFields[stepIndex];
  const isLast = stepIndex === decision.inputFields.length - 1;

  function setField(id: string, value: number | boolean | string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleContinue() {
    if (isLast) {
      onComplete(computeCalculated(decision, values), values);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <div>
      <ProgressSteps current={stepIndex + 1} total={decision.inputFields.length} />
      <h2 className="font-serif text-2xl font-medium mb-2 text-balance">{field.label}</h2>
      {field.helpText && <p className="text-sm text-slate mb-4">{field.helpText}</p>}

      <div className="mb-8 mt-4">
        {field.type === "boolean" ? (
          <div className="flex gap-3">
            {[true, false].map((opt) => {
              const selected = Boolean(values[field.id]) === opt;
              return (
                <button
                  key={String(opt)}
                  onClick={() => setField(field.id, opt)}
                  aria-pressed={selected}
                  className={
                    "flex-1 py-3 rounded-lg border text-base focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 " +
                    (selected ? "border-ink bg-ink text-paper" : "border-rule bg-white/50 hover:bg-white/80")
                  }
                >
                  {opt ? "Yes" : "No"}
                </button>
              );
            })}
          </div>
        ) : field.type === "select" ? (
          <div className="flex flex-col gap-2">
            {field.options?.map((opt) => {
              const selected = values[field.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setField(field.id, opt.value)}
                  aria-pressed={selected}
                  className={
                    "text-left px-4 py-3 rounded-lg border text-base focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 " +
                    (selected ? "border-ink bg-ink text-paper" : "border-rule bg-white/50 hover:bg-white/80")
                  }
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center border-b-2 border-rule pb-2">
            {UNIT_SUFFIX[field.type] === "$" && <span className="font-mono mr-1 text-xl">$</span>}
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step ?? 1}
              value={values[field.id] === undefined ? "" : Number(values[field.id])}
              onChange={(e) => setField(field.id, e.target.value === "" ? 0 : parseFloat(e.target.value))}
              className="w-full bg-transparent outline-none text-2xl font-mono focus-visible:outline-2 focus-visible:outline-ink"
              aria-label={field.label}
            />
            {UNIT_SUFFIX[field.type] && UNIT_SUFFIX[field.type] !== "$" && (
              <span className="font-mono ml-2 text-slate">{UNIT_SUFFIX[field.type]}</span>
            )}
          </div>
        )}
        {field.optional && (
          <p className="text-xs text-slate mt-2">Optional — leave the default if you&apos;re not sure.</p>
        )}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 rounded-md font-serif text-lg font-medium bg-ink text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
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
