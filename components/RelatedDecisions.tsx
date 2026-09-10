"use client";

import Link from "next/link";
import type { DecisionConfig } from "@/lib/engines/types";
import { decisionHref } from "@/content/decisions";
import { trackEvent } from "@/lib/analytics/events";

export default function RelatedDecisions({
  fromDecisionId,
  decisions,
}: {
  fromDecisionId: string;
  decisions: DecisionConfig[];
}) {
  if (!decisions.length) return null;

  return (
    <div className="border-t border-rule pt-6 mt-8">
      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mb-3">Related decisions</h2>
      <div className="flex flex-col">
        {decisions.map((d) => (
          <Link
            key={d.id}
            href={decisionHref(d)}
            onClick={() => trackEvent("related_decision_clicked", { fromDecisionId, toDecisionId: d.id })}
            className="flex items-center justify-between gap-4 py-4 px-1 border-b border-rule hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
          >
            <span>
              <span className="block text-lg font-serif font-medium">{d.title}</span>
              <span className="block text-sm text-slate mt-0.5">{d.teaser}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
