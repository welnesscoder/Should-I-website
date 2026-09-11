import SocialVoteCard from "./SocialVoteCard";
import { socialHref } from "@/content/social";
import { SOCIAL_TYPE_ACCENT, type SocialContentItem } from "@/lib/content/types";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

interface SocialIndexListProps {
  eyebrow: string;
  title: string;
  description: string;
  entries: { item: SocialContentItem; counts: SocialVoteCounts }[];
  siteUrl: string;
}

/** Shared list shell for a social format's index page — vote happens right here, no page load required. */
export default function SocialIndexList({ eyebrow, title, description, entries, siteUrl }: SocialIndexListProps) {
  const accent = entries[0] ? SOCIAL_TYPE_ACCENT[entries[0].item.type] : undefined;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <p className={`font-mono text-xs uppercase tracking-wide font-semibold mb-2 ${accent?.text ?? "text-slate"}`}>{eyebrow}</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-balance">{title}</h1>
      <p className="text-slate mt-2 max-w-md">{description}</p>

      <div className="flex flex-col gap-4 mt-8">
        {entries.map(({ item, counts }) => (
          <SocialVoteCard key={item.id} item={item} initialCounts={counts} shareUrl={`${siteUrl}${socialHref(item)}`} />
        ))}
      </div>
    </div>
  );
}
