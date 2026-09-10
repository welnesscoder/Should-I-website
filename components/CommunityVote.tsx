"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/events";

interface VoteCounts {
  yes: number;
  no: number;
}

function storageKey(decisionId: string) {
  return `should-i:voted:${decisionId}`;
}

function readStoredVote(decisionId: string): "yes" | "no" | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(storageKey(decisionId));
    return stored === "yes" || stored === "no" ? stored : null;
  } catch {
    return null;
  }
}

export default function CommunityVote({ decisionId }: { decisionId: string }) {
  const [counts, setCounts] = useState<VoteCounts | null>(null);
  const [voted, setVoted] = useState<"yes" | "no" | null>(() => readStoredVote(decisionId));
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/vote?decisionId=${encodeURIComponent(decisionId)}`);
        if (!res.ok) throw new Error("failed to load votes");
        const data = await res.json();
        if (!cancelled) setCounts({ yes: data.yes ?? 0, no: data.no ?? 0 });
      } catch {
        if (!cancelled) setCounts({ yes: 0, no: 0 });
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [decisionId]);

  async function castVote(choice: "yes" | "no") {
    if (voted || pending || !counts) return;
    setPending(true);
    setVoted(choice);
    setCounts((prev) => (prev ? { ...prev, [choice]: prev[choice] + 1 } : prev));
    try {
      window.localStorage.setItem(storageKey(decisionId), choice);
    } catch {
      // best effort
    }
    trackEvent("community_vote", { decisionId, choice });

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisionId, choice }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.yes === "number" && typeof data.no === "number") {
          setCounts({ yes: data.yes, no: data.no });
        }
      }
    } catch {
      // optimistic count stands; server is the source of truth on next load
    } finally {
      setPending(false);
    }
  }

  if (!counts) {
    return <p className="text-sm text-slate text-center">Loading the community verdict…</p>;
  }

  const total = counts.yes + counts.no;
  const yesPct = total ? Math.round((counts.yes / total) * 100) : 50;

  return (
    <div className="border-t border-rule pt-6 mt-8">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">What everyone else said</p>
      {total === 0 ? (
        <p className="text-sm text-slate mb-3">No votes yet — be the first.</p>
      ) : total < 20 ? (
        <>
          <p className="text-sm text-slate mb-3">
            {yesPct}% yes · {100 - yesPct}% no, from just {total} vote{total === 1 ? "" : "s"} so far — early days.
          </p>
        </>
      ) : (
        <>
          <div className="flex h-3 rounded-full overflow-hidden border border-rule mb-2" aria-hidden="true">
            <div className="bg-yes" style={{ width: `${yesPct}%` }} />
            <div className="bg-no" style={{ width: `${100 - yesPct}%` }} />
          </div>
          <p className="text-sm text-slate mb-3">
            <strong className="text-ink">{yesPct}% yes</strong> · <strong className="text-ink">{100 - yesPct}% no</strong> ·{" "}
            {total.toLocaleString()} people voted
          </p>
        </>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => castVote("yes")}
          disabled={!!voted}
          aria-pressed={voted === "yes"}
          className={
            "flex-1 py-2 rounded-full border border-rule text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:opacity-60 " +
            (voted === "yes" ? "bg-yes text-white border-transparent" : "bg-white/50 hover:bg-white/80")
          }
        >
          {voted === "yes" ? "You voted yes" : "Vote yes"}
        </button>
        <button
          onClick={() => castVote("no")}
          disabled={!!voted}
          aria-pressed={voted === "no"}
          className={
            "flex-1 py-2 rounded-full border border-rule text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:opacity-60 " +
            (voted === "no" ? "bg-no text-white border-transparent" : "bg-white/50 hover:bg-white/80")
          }
        >
          {voted === "no" ? "You voted no" : "Vote no"}
        </button>
      </div>
    </div>
  );
}
