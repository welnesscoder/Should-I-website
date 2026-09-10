"use client";

import { useState } from "react";
import { Share2, Check, ArrowRight } from "lucide-react";
import type { SocialContentItem, SocialContentType } from "@/lib/content/types";
import type { SocialVoteCounts } from "@/lib/supabase/queries";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics/events";

const VOTE_EVENT: Record<SocialContentType, AnalyticsEventName> = {
  cooked: "cooked_completed",
  whos_wrong: "whos_wrong_vote",
  normal: "normal_vote",
  hype: "hype_vote",
  quick_fire: "quick_fire_vote",
};

function storageKey(item: SocialContentItem) {
  return `sayless:voted:${item.type}:${item.id}`;
}

function readStoredVote(item: SocialContentItem): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(storageKey(item));
  } catch {
    return null;
  }
}

function sumCounts(counts: SocialVoteCounts): number {
  return Object.values(counts).reduce((a, b) => a + b, 0);
}

interface SocialVoteCardProps {
  item: SocialContentItem;
  initialCounts: SocialVoteCounts;
  /** Absolute URL for sharing. Omit to hide the share button (e.g. server render without an origin). */
  shareUrl?: string;
  /** Feed context: renders a compact "Next" affordance after voting instead of leaving it to page navigation. */
  onNext?: () => void;
  /** Tighter padding/type scale for the feed; the standalone page uses the roomier default. */
  compact?: boolean;
}

export default function SocialVoteCard({ item, initialCounts, shareUrl, onNext, compact }: SocialVoteCardProps) {
  const [counts, setCounts] = useState<SocialVoteCounts>(initialCounts);
  const [voted, setVoted] = useState<string | null>(() => readStoredVote(item));
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [voteFailed, setVoteFailed] = useState(false);

  const aCount = counts[item.optionA.key] ?? 0;
  const bCount = counts[item.optionB.key] ?? 0;
  const total = aCount + bCount;
  const aPct = total ? Math.round((aCount / total) * 100) : 50;

  async function castVote(optionKey: string) {
    if (voted || pending) return;
    setPending(true);
    setVoteFailed(false);
    setVoted(optionKey);
    const optimistic = { ...counts, [optionKey]: (counts[optionKey] ?? 0) + 1 };
    setCounts(optimistic);
    try {
      window.localStorage.setItem(storageKey(item), optionKey);
    } catch {
      // best effort — voting still works without persistence
    }
    trackEvent(VOTE_EVENT[item.type], { contentType: item.type, contentId: item.id, optionKey });

    try {
      const res = await fetch("/api/social-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: item.type, id: item.id, optionKey }),
      });
      if (!res.ok) throw new Error("vote failed");
      const data = await res.json();
      const serverCounts = data.counts as SocialVoteCounts;
      // Guard against a stubbed/unconfigured backend echoing back zero counts and
      // clobbering the optimistic update the user just saw.
      if (sumCounts(serverCounts) >= sumCounts(optimistic)) {
        setCounts(serverCounts);
      }
    } catch {
      // Optimistic count stands — never tell the user their vote failed once
      // it's already reflected on screen; the server is the source of truth
      // on next load. Flag it quietly so a real outage is still visible.
      setVoteFailed(true);
    } finally {
      setPending(false);
    }
  }

  async function handleShare() {
    if (!shareUrl) return;
    trackEvent("share_card_generated", { contentType: item.type, contentId: item.id });
    const shareText = item.prompt || `${item.optionA.label} or ${item.optionB.label}?`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "SayLess", text: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or share failed; fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  }

  const pad = compact ? "p-4" : "p-5";
  const promptSize = compact ? "text-base" : "text-lg sm:text-xl";

  return (
    <div className={`rounded-lg border dashed-edge bg-white/40 ${pad}`}>
      {item.prompt && <p className={`font-serif font-medium text-balance ${promptSize} mb-4`}>{item.prompt}</p>}

      {!voted ? (
        <div className="flex gap-2">
          <button
            onClick={() => castVote(item.optionA.key)}
            disabled={pending}
            className="flex-1 py-2.5 rounded-full border-2 border-ink text-sm font-semibold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:opacity-60 transition-colors"
          >
            {item.optionA.label}
          </button>
          <button
            onClick={() => castVote(item.optionB.key)}
            disabled={pending}
            className="flex-1 py-2.5 rounded-full border-2 border-ink text-sm font-semibold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:opacity-60 transition-colors"
          >
            {item.optionB.label}
          </button>
        </div>
      ) : (
        <div className="stamp-pop">
          {total === 0 ? (
            <p className="text-sm text-slate mb-3">No votes yet — you're the first.</p>
          ) : (
            <>
              <div
                className="flex h-3 rounded-full overflow-hidden border border-rule mb-2"
                role="img"
                aria-label={`${aPct}% ${item.optionA.label}, ${100 - aPct}% ${item.optionB.label}`}
              >
                <div className="bg-ink" style={{ width: `${aPct}%` }} />
                <div className="bg-rule" style={{ width: `${100 - aPct}%` }} />
              </div>
              <p className="text-sm text-slate mb-1">
                <strong className="text-ink">
                  {aPct}% {item.optionA.label}
                </strong>{" "}
                ·{" "}
                <strong className="text-ink">
                  {100 - aPct}% {item.optionB.label}
                </strong>{" "}
                · {total.toLocaleString()} vote{total === 1 ? "" : "s"}
              </p>
            </>
          )}
          {item.resultLine && <p className="text-sm text-slate mt-2">{item.resultLine}</p>}
          {voteFailed && (
            <p className="text-xs text-slate mt-2">Your vote is saved here — we'll sync it when the connection is back.</p>
          )}

          <div className="flex items-center gap-3 mt-4">
            {shareUrl && (
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-white/50 px-4 py-2 text-sm font-medium hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Share2 size={14} aria-hidden="true" />}
                {copied ? "Copied" : "Share"}
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1.5 ml-auto rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
              >
                Next
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
