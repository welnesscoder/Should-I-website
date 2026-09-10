"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/events";

interface VoteCounts {
  yes: number;
  no: number;
}

function storageKey(id: string) {
  return `should-i:voted-daily:${id}`;
}

function readStoredVote(id: string): "yes" | "no" | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(storageKey(id));
    return stored === "yes" || stored === "no" ? stored : null;
  } catch {
    return null;
  }
}

export default function DailyQuestionVote({
  dailyQuestionId,
  initialCounts,
}: {
  dailyQuestionId: string;
  initialCounts: VoteCounts;
}) {
  const [counts, setCounts] = useState<VoteCounts>(initialCounts);
  const [voted, setVoted] = useState<"yes" | "no" | null>(() => readStoredVote(dailyQuestionId));
  const [pending, setPending] = useState(false);

  async function castVote(choice: "yes" | "no") {
    if (voted || pending) return;
    setPending(true);
    setVoted(choice);
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
    try {
      window.localStorage.setItem(storageKey(dailyQuestionId), choice);
    } catch {
      // best effort
    }
    trackEvent("daily_question_vote", { dailyQuestionId, choice });

    try {
      const res = await fetch("/api/daily-question-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyQuestionId, choice }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.yes === "number" && typeof data.no === "number") setCounts({ yes: data.yes, no: data.no });
      }
    } catch {
      // optimistic count stands
    } finally {
      setPending(false);
    }
  }

  const total = counts.yes + counts.no;
  const yesPct = total ? Math.round((counts.yes / total) * 100) : 50;

  if (voted) {
    return (
      <div>
        <div className="flex h-3 rounded-full overflow-hidden border border-rule mb-2" aria-hidden="true">
          <div className="bg-yes" style={{ width: `${yesPct}%` }} />
          <div className="bg-no" style={{ width: `${100 - yesPct}%` }} />
        </div>
        <p className="text-sm text-slate">
          <strong className="text-ink">{yesPct}% yes</strong> · <strong className="text-ink">{100 - yesPct}% no</strong> ·{" "}
          {total.toLocaleString()} votes today
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => castVote("yes")}
        className="flex-1 py-2.5 rounded-full border border-rule bg-white/50 hover:bg-white/80 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        Yes
      </button>
      <button
        onClick={() => castVote("no")}
        className="flex-1 py-2.5 rounded-full border border-rule bg-white/50 hover:bg-white/80 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        No
      </button>
    </div>
  );
}
