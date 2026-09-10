import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialVoteCard from "@/components/social/SocialVoteCard";
import DailyQuestionVote from "@/components/DailyQuestionVote";
import { socialHref } from "@/content/social";
import { decisionHref } from "@/content/decisions";
import { ENGINE_LABEL } from "@/content/decisions";
import { SOCIAL_TYPE_ACCENT, SOCIAL_TYPE_LABEL, type SocialContentType } from "@/lib/content/types";
import type { FeedItem } from "@/lib/content/feed";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

const SOCIAL_EMOJI: Record<SocialContentType, string> = {
  cooked: "🔥",
  whos_wrong: "⚖️",
  normal: "👀",
  hype: "🔥",
  quick_fire: "⚡",
};

interface FeedCardProps {
  entry: FeedItem;
  counts?: SocialVoteCounts;
  siteUrl: string;
}

export default function FeedCard({ entry, counts, siteUrl }: FeedCardProps) {
  if (entry.kind === "should_i") {
    const d = entry.decision;
    return (
      <Link
        href={decisionHref(d)}
        className="block rounded-lg border-2 border-brand bg-white/60 p-4 hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        <p className="font-mono text-xs uppercase tracking-wide text-brand mb-2">
          🤔 Should I? · {ENGINE_LABEL[d.engine]}
        </p>
        <p className="font-serif text-lg font-medium mb-1 text-balance">{d.title}</p>
        <p className="text-sm text-slate mb-3">{d.teaser}</p>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand">
          Start this decision <ArrowRight size={14} aria-hidden="true" />
        </span>
      </Link>
    );
  }

  if (entry.kind === "daily_question") {
    return (
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-slate mb-2">📊 Question of the Day</p>
        <div className="rounded-lg border dashed-edge bg-white/40 p-4">
          <p className="font-serif text-base font-medium mb-3 text-balance">{entry.question.questionText}</p>
          <DailyQuestionVote dailyQuestionId={entry.question.id} initialCounts={entry.counts} />
        </div>
      </div>
    );
  }

  const { item } = entry;
  const accent = SOCIAL_TYPE_ACCENT[item.type];
  return (
    <div>
      <p className={`font-mono text-xs uppercase tracking-wide font-semibold mb-2 ${accent.text}`}>
        {SOCIAL_EMOJI[item.type]} {SOCIAL_TYPE_LABEL[item.type]}
      </p>
      <SocialVoteCard item={item} initialCounts={counts ?? {}} shareUrl={`${siteUrl}${socialHref(item)}`} compact />
    </div>
  );
}
