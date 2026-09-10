"use client";

import { useState } from "react";
import SocialVoteCard from "./SocialVoteCard";
import type { SocialContentItem } from "@/lib/content/types";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

interface QuickFireDeckProps {
  entries: { item: SocialContentItem; counts: SocialVoteCounts }[];
  shareUrl: string;
}

/** Sequential either/or deck — vote, see the split immediately, and it advances to the next pair on its own. */
export default function QuickFireDeck({ entries, shareUrl }: QuickFireDeckProps) {
  const [index, setIndex] = useState(0);

  if (entries.length === 0) {
    return <p className="text-sm text-slate">No pairs yet — check back soon.</p>;
  }

  if (index >= entries.length) {
    return (
      <div className="rounded-lg border dashed-edge bg-white/40 p-5 text-center">
        <p className="font-serif text-lg font-medium mb-2">That's all for now.</p>
        <button
          onClick={() => setIndex(0)}
          className="mt-1 inline-flex rounded-full border-2 border-ink px-5 py-2 text-sm font-semibold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          Go again
        </button>
      </div>
    );
  }

  const { item, counts } = entries[index];

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-2">
        {index + 1} of {entries.length}
      </p>
      <SocialVoteCard key={item.id} item={item} initialCounts={counts} shareUrl={shareUrl} onNext={() => setIndex((i) => i + 1)} />
    </div>
  );
}
