"use client";

import { useState } from "react";
import FeedCard from "./FeedCard";
import FeedItemView from "./FeedItemView";
import { feedKey, type FeedItem } from "@/lib/content/feed";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

function feedItemViewProps(entry: FeedItem): { contentType: string; contentId: string } {
  if (entry.kind === "should_i") return { contentType: "should_i", contentId: entry.decision.id };
  if (entry.kind === "daily_question") return { contentType: "daily_question", contentId: entry.question.id };
  return { contentType: entry.item.type, contentId: entry.item.id };
}

export interface FeedEntry {
  entry: FeedItem;
  counts?: SocialVoteCounts;
}

const PAGE_SIZE = 8;

/**
 * Controlled pagination, not infinite scroll: the whole feed is small
 * enough at launch to ship to the client in one response, so "Load more"
 * just reveals the next slice already in hand rather than round-tripping.
 * When the content library grows into the thousands, swap this for a real
 * paginated /api/feed endpoint — buildFeed() is the only other call site.
 */
export default function FeedList({ entries, siteUrl }: { entries: FeedEntry[]; siteUrl: string }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = entries.slice(0, visible);
  const hasMore = visible < entries.length;

  return (
    <div>
      <div className="flex flex-col gap-5">
        {shown.map(({ entry, counts }) => (
          <FeedItemView key={feedKey(entry)} {...feedItemViewProps(entry)}>
            <FeedCard entry={entry} counts={counts} siteUrl={siteUrl} />
          </FeedItemView>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-6 w-full py-3 rounded-full border-2 border-ink text-sm font-semibold hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          Load more
        </button>
      )}
    </div>
  );
}
