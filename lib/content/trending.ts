import { getDecision } from "@/content/decisions";
import { getSocialItem } from "@/content/social";
import {
  getMostControversial,
  getMostControversialSocial,
  getSocialTrending,
  getTrending,
} from "@/lib/supabase/queries";
import type { DecisionConfig, EngineType } from "@/lib/engines/types";
import type { SocialContentItem } from "./types";

/** Serializable subset — see FeedDecisionSummary in feed.ts for why the full DecisionConfig isn't used. */
interface DecisionSummary {
  id: string;
  category: DecisionConfig["category"];
  slug: string;
  title: string;
  teaser: string;
  engine: EngineType;
}

function toSummary(d: DecisionConfig): DecisionSummary {
  return { id: d.id, category: d.category, slug: d.slug, title: d.title, teaser: d.teaser, engine: d.engine };
}

export type TrendingResult =
  | { kind: "should_i"; decision: DecisionSummary; voteCount: number }
  | { kind: "social"; item: SocialContentItem; voteCount: number };

/** Cross-type trending: merges Should I? votes and social content_votes, ranked by recent (48h) activity. */
export async function getUnifiedTrending(limit = 6): Promise<TrendingResult[]> {
  const [decisionTrending, socialTrending] = await Promise.all([getTrending(20), getSocialTrending(20)]);

  const results: TrendingResult[] = [];
  for (const t of decisionTrending) {
    const decision = getDecision(t.decisionId);
    if (decision) results.push({ kind: "should_i", decision: toSummary(decision), voteCount: t.voteCount });
  }
  for (const t of socialTrending) {
    const item = getSocialItem(t.contentId);
    if (item) results.push({ kind: "social", item, voteCount: t.voteCount });
  }

  return results.sort((a, b) => b.voteCount - a.voteCount).slice(0, limit);
}

export type ControversialResult =
  | { kind: "should_i"; decision: DecisionSummary; splitLabel: string }
  | { kind: "social"; item: SocialContentItem; splitLabel: string };

/** Cross-type "people can't agree": merges both controversial queries, ranked by closeness to 50/50. */
export async function getUnifiedControversial(limit = 3, minVotes = 20): Promise<ControversialResult[]> {
  const [decisionEntries, socialEntries] = await Promise.all([
    getMostControversial(20, minVotes),
    getMostControversialSocial(20, minVotes),
  ]);

  const results: (ControversialResult & { distance: number })[] = [];
  for (const entry of decisionEntries) {
    const decision = getDecision(entry.decisionId);
    if (!decision) continue;
    const yesPct = Math.round(entry.yesPct);
    results.push({
      kind: "should_i",
      decision: toSummary(decision),
      splitLabel: `${yesPct}% yes · ${100 - yesPct}% no`,
      distance: Math.abs(yesPct - 50),
    });
  }
  for (const entry of socialEntries) {
    const item = getSocialItem(entry.contentId);
    if (!item) continue;
    results.push({
      kind: "social",
      item,
      splitLabel: `${entry.leadPct}% · ${100 - entry.leadPct}% split`,
      distance: Math.abs(entry.leadPct - 50),
    });
  }

  return results.sort((a, b) => a.distance - b.distance).slice(0, limit);
}
