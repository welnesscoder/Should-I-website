"use client";

import { useEffect, useState } from "react";
import type {
  CalculatedValues,
  DecisionResult,
  QuickAnswers,
  WeightedAnswers,
  WeightedComputedInputs,
} from "@/lib/engines/types";
import { decisionHref, getDecision, getRelated } from "@/content/decisions";
import { trackEvent } from "@/lib/analytics/events";
import { getSessionId } from "@/lib/analytics/session";
import QuickEngine from "./QuickEngine";
import WeightedEngine from "./WeightedEngine";
import CalculatedEngine from "./CalculatedEngine";
import ResultCard from "./ResultCard";
import CommunityVote from "./CommunityVote";
import ShareCard from "./ShareCard";
import RelatedDecisions from "./RelatedDecisions";

type SavedState =
  | { engine: "quick"; answers: QuickAnswers }
  | { engine: "weighted"; answers: WeightedAnswers; computedInputs: WeightedComputedInputs }
  | { engine: "calculated"; values: CalculatedValues }
  | undefined;

export default function EngineRunner({ decisionId }: { decisionId: string }) {
  const decision = getDecision(decisionId);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [saved, setSaved] = useState<SavedState>(undefined);

  useEffect(() => {
    if (!decision) return;
    trackEvent("decision_started", { decisionId: decision.id, category: decision.category, engine: decision.engine });
    // Only fires once per decision page visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisionId]);

  if (!decision) return null;
  const activeDecision = decision;

  function handleComplete(nextResult: DecisionResult) {
    setResult(nextResult);
    trackEvent("decision_completed", {
      decisionId: activeDecision.id,
      category: activeDecision.category,
      engine: activeDecision.engine,
    });
    trackEvent("verdict_generated", {
      decisionId: activeDecision.id,
      score: nextResult.score,
      verdict: nextResult.verdict,
    });

    fetch("/api/analytics/decision-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decisionId: activeDecision.id,
        score: nextResult.score,
        verdict: nextResult.verdict,
        sessionId: getSessionId(),
      }),
    }).catch(() => {
      // best effort — analytics should never block the UI
    });
  }

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://should-i.app"}${decisionHref(activeDecision)}`;

  return (
    <div>
      {!result ? (
        <>
          {activeDecision.engine === "quick" && (
            <QuickEngine
              decision={activeDecision}
              initialAnswers={saved?.engine === "quick" ? saved.answers : undefined}
              onComplete={(r, answers) => {
                setSaved({ engine: "quick", answers });
                handleComplete(r);
              }}
            />
          )}
          {activeDecision.engine === "weighted" && (
            <WeightedEngine
              decision={activeDecision}
              initialAnswers={saved?.engine === "weighted" ? saved.answers : undefined}
              initialComputedInputs={saved?.engine === "weighted" ? saved.computedInputs : undefined}
              onComplete={(r, answers, computedInputs) => {
                setSaved({ engine: "weighted", answers, computedInputs });
                handleComplete(r);
              }}
            />
          )}
          {activeDecision.engine === "calculated" && (
            <CalculatedEngine
              decision={activeDecision}
              initialValues={saved?.engine === "calculated" ? saved.values : undefined}
              onComplete={(r, values) => {
                setSaved({ engine: "calculated", values });
                handleComplete(r);
              }}
            />
          )}
        </>
      ) : (
        <div>
          <ResultCard result={result} />
          <div className="text-center mt-4">
            <button
              onClick={() => setResult(null)}
              className="text-sm text-slate underline hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
            >
              Change my answers
            </button>
          </div>
          <CommunityVote decisionId={activeDecision.id} />
          <ShareCard decisionId={activeDecision.id} decisionTitle={activeDecision.title} result={result} url={shareUrl} />
          <RelatedDecisions fromDecisionId={activeDecision.id} decisions={getRelated(activeDecision)} />
        </div>
      )}
    </div>
  );
}
