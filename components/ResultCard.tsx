import type { DecisionResult } from "@/lib/engines/types";
import ScoreDial from "./ScoreDial";
import VerdictBadge from "./VerdictBadge";
import BreakdownList from "./BreakdownList";

export default function ResultCard({ result }: { result: DecisionResult }) {
  const { score, verdict, headline, explanation, breakdown, biggestReasonYes, biggestReasonHesitate, insights, warnings } =
    result;

  return (
    <div>
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <VerdictBadge verdict={verdict} />
        <ScoreDial score={score} verdict={verdict} />
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold max-w-md text-balance">{headline}</h2>
        <p className="text-slate max-w-md">{explanation}</p>
      </div>

      {breakdown.length > 0 && (
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">The breakdown</p>
          <BreakdownList factors={breakdown} />
        </div>
      )}

      {(biggestReasonYes || biggestReasonHesitate) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {biggestReasonYes && (
            <div className="rounded-lg border border-rule bg-yes-soft p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-slate mb-1">Biggest reason to say yes</p>
              <p className="text-ink">{biggestReasonYes}</p>
            </div>
          )}
          {biggestReasonHesitate && (
            <div className="rounded-lg border border-rule bg-no-soft p-4">
              <p className="font-mono text-xs uppercase tracking-wide text-slate mb-1">Biggest reason to hesitate</p>
              <p className="text-ink">{biggestReasonHesitate}</p>
            </div>
          )}
        </div>
      )}

      {insights && insights.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {insights.map((insight) => (
            <div key={insight.label} className="rounded-lg border dashed-edge p-4 text-center">
              <p className="font-serif text-xl font-semibold">{insight.value}</p>
              <p className="text-xs text-slate mt-1">{insight.label}</p>
            </div>
          ))}
        </div>
      )}

      {warnings && warnings.length > 0 && (
        <div className="mt-8 flex flex-col gap-2">
          {warnings.map((w) => (
            <p key={w} className="text-sm text-slate border-l-2 border-rule pl-3">
              {w}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
