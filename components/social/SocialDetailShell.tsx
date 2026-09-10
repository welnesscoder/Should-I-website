import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SocialVoteCard from "./SocialVoteCard";
import { socialHref } from "@/content/social";
import { SOCIAL_TYPE_ACCENT, type SocialContentItem } from "@/lib/content/types";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

interface SocialDetailShellProps {
  eyebrow: string;
  backHref: string;
  backLabel: string;
  item: SocialContentItem;
  counts: SocialVoteCounts;
  siteUrl: string;
}

/** Shared single-item shell for a social format's permalink page — used for sharing, SEO, and direct links. */
export default function SocialDetailShell({
  eyebrow,
  backHref,
  backLabel,
  item,
  counts,
  siteUrl,
}: SocialDetailShellProps) {
  const accent = SOCIAL_TYPE_ACCENT[item.type];

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm text-slate hover:text-ink mb-6 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
      >
        <ArrowLeft size={14} aria-hidden="true" /> {backLabel}
      </Link>
      <p className={`font-mono text-xs uppercase tracking-wide font-semibold mb-4 ${accent.text}`}>{eyebrow}</p>
      <SocialVoteCard item={item} initialCounts={counts} shareUrl={`${siteUrl}${socialHref(item)}`} promptAsHeading />
    </div>
  );
}
