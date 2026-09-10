import { DECISIONS, FLAGSHIP_IDS, getFlagshipDecisions } from "@/content/decisions";
import { getSocialByType } from "@/content/social";
import type { DecisionConfig, EngineType } from "@/lib/engines/types";
import type { DailyQuestion, VoteCounts } from "@/lib/supabase/queries";
import type { SocialContentItem, SocialContentType } from "./types";

/**
 * A DecisionConfig carries a `compute` function (for calculated/weighted
 * engines) that can't cross the server/client boundary, so the feed only
 * keeps the plain-data fields a teaser card actually renders.
 */
export interface FeedDecisionSummary {
  id: string;
  category: DecisionConfig["category"];
  slug: string;
  title: string;
  teaser: string;
  engine: EngineType;
}

export type FeedItem =
  | { kind: "social"; item: SocialContentItem }
  | { kind: "should_i"; decision: FeedDecisionSummary }
  | { kind: "daily_question"; question: DailyQuestion; counts: VoteCounts };

function toFeedDecisionSummary(d: DecisionConfig): FeedDecisionSummary {
  return { id: d.id, category: d.category, slug: d.slug, title: d.title, teaser: d.teaser, engine: d.engine };
}

const SOCIAL_ROTATION: SocialContentType[] = ["cooked", "whos_wrong", "normal", "quick_fire", "hype"];

/**
 * Deterministic mixed ordering: round-robins across the five social formats
 * so the same format never clusters two-in-a-row, with a Should I? teaser
 * dropped in every other round (flagships first). Swap this for a real
 * ranking (trending, freshness, personalization) later — every consumer
 * just reads buildFeed()'s output, so the change is contained to this file.
 */
export function buildFeed(): FeedItem[] {
  const buckets: Record<SocialContentType, SocialContentItem[]> = {
    cooked: getSocialByType("cooked"),
    whos_wrong: getSocialByType("whos_wrong"),
    normal: getSocialByType("normal"),
    hype: getSocialByType("hype"),
    quick_fire: getSocialByType("quick_fire"),
  };

  const shouldIQueue = [
    ...getFlagshipDecisions(),
    ...DECISIONS.filter((d) => !FLAGSHIP_IDS.includes(d.id)),
  ];

  const feed: FeedItem[] = [];
  const maxRounds = Math.max(0, ...SOCIAL_ROTATION.map((type) => buckets[type].length));
  let shouldIIndex = 0;

  for (let round = 0; round < maxRounds; round++) {
    for (const type of SOCIAL_ROTATION) {
      const item = buckets[type][round];
      if (item) feed.push({ kind: "social", item });
    }
    if (round % 2 === 1 && shouldIIndex < shouldIQueue.length) {
      feed.push({ kind: "should_i", decision: toFeedDecisionSummary(shouldIQueue[shouldIIndex]) });
      shouldIIndex++;
    }
  }

  return feed;
}
