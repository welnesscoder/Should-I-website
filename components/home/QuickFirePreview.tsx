import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialVoteCard from "@/components/social/SocialVoteCard";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";

export default async function QuickFirePreview({ siteUrl }: { siteUrl: string }) {
  const pairs = getSocialByType("quick_fire").slice(0, 4);
  if (pairs.length === 0) return null;

  const entries = await Promise.all(
    pairs.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-xs uppercase tracking-wide font-bold text-quickfire">⚡ Quick Fire</p>
        <Link
          href="/quick-fire"
          className="text-xs text-slate hover:text-ink inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          See all <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {entries.map(({ item, counts }) => (
          <div key={item.id} className="snap-start shrink-0 w-64">
            <SocialVoteCard item={item} initialCounts={counts} shareUrl={`${siteUrl}/quick-fire`} compact />
          </div>
        ))}
      </div>
    </section>
  );
}
