"use client";

import { useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import type { DecisionResult } from "@/lib/engines/types";
import { VERDICT_LABEL } from "@/lib/engines/types";
import { VERDICT_STYLES } from "@/lib/verdictStyles";
import { trackEvent } from "@/lib/analytics/events";

interface ShareCardProps {
  decisionId: string;
  decisionTitle: string;
  result: DecisionResult;
  url: string;
}

export default function ShareCard({ decisionId, decisionTitle, result, url }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const style = VERDICT_STYLES[result.verdict];

  const shareText = `${decisionTitle} — ${VERDICT_LABEL[result.verdict]}, ${result.score}/100. ${result.headline}`;

  async function handleShare() {
    trackEvent("result_shared", { decisionId, method: "unknown" });
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "SayLess", text: shareText, url });
        return;
      } catch {
        // user cancelled or share failed; fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  }

  return (
    <div className="mt-10 border-t border-rule pt-8">
      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mb-3">Share this result</h2>
      <div className="rounded-lg border dashed-edge p-5 bg-white/50 max-w-sm">
        <p className="font-mono text-xs uppercase tracking-wide text-slate mb-2">Should I?</p>
        <p className="font-serif text-lg font-semibold mb-3">{decisionTitle}</p>
        <p className={`font-serif text-3xl font-bold ${style.textClass}`}>{VERDICT_LABEL[result.verdict]}</p>
        <p className="font-mono text-sm text-slate mt-1">{result.score}/100</p>
        {result.insights?.[0] && (
          <p className="text-sm text-slate mt-3 border-t border-rule pt-3">
            {result.insights[0].value} · {result.insights[0].label}
          </p>
        )}
        <p className="font-mono text-[10px] uppercase tracking-widest text-slate mt-4 pt-3 border-t border-rule">
          SayLess
        </p>
      </div>
      <button
        onClick={handleShare}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-rule bg-white/50 px-5 py-2.5 text-sm font-medium hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
        {copied ? "Link copied" : "Share my result"}
      </button>
      {!copied && (
        <span className="ml-3 text-xs text-slate inline-flex items-center gap-1">
          <LinkIcon size={12} aria-hidden="true" /> or copies the link
        </span>
      )}
    </div>
  );
}
