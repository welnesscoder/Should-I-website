import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SocialVoteCard from "@/components/social/SocialVoteCard";
import { getSocialByType, socialHref } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import type { SocialContentType } from "@/lib/content/types";

interface SocialPreviewSectionProps {
  type: SocialContentType;
  eyebrow: string;
  title: string;
  viewAllHref: string;
  siteUrl: string;
  limit?: number;
}

export default async function SocialPreviewSection({
  type,
  eyebrow,
  title,
  viewAllHref,
  siteUrl,
  limit = 2,
}: SocialPreviewSectionProps) {
  const items = getSocialByType(type).slice(0, limit);
  if (items.length === 0) return null;

  const entries = await Promise.all(
    items.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <div className="flex items-baseline justify-between mb-1">
        <p className="font-mono text-xs uppercase tracking-wide text-slate">{eyebrow}</p>
        <Link
          href={viewAllHref}
          className="text-xs text-slate hover:text-ink inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          See all <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
      <h2 className="font-serif text-xl font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-4">
        {entries.map(({ item, counts }) => (
          <SocialVoteCard key={item.id} item={item} initialCounts={counts} shareUrl={`${siteUrl}${socialHref(item)}`} compact />
        ))}
      </div>
    </section>
  );
}
