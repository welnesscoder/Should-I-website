import Link from "next/link";
import { decisionHref } from "@/content/decisions";
import { socialHref } from "@/content/social";
import { SOCIAL_TYPE_ACCENT, SOCIAL_TYPE_LABEL } from "@/lib/content/types";
import type { TrendingResult } from "@/lib/content/trending";

/** Colored, card-shaped trending tile for the homepage carousel — the full /trending page keeps the plain list. */
export default function TrendingCard({ entry }: { entry: TrendingResult }) {
  if (entry.kind === "should_i") {
    return (
      <Link
        href={decisionHref(entry.decision)}
        className="snap-start shrink-0 w-52 rounded-xl bg-brand-soft p-4 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 transition-opacity"
      >
        <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-brand text-white rounded-full px-2 py-0.5 mb-2">
          Should I?
        </span>
        <p className="font-serif font-semibold text-sm text-balance text-ink">{entry.decision.title}</p>
      </Link>
    );
  }

  const { item, voteCount } = entry;
  const accent = SOCIAL_TYPE_ACCENT[item.type];

  return (
    <Link
      href={socialHref(item)}
      className={`snap-start shrink-0 w-52 rounded-xl ${accent.bgSoft} p-4 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 transition-opacity`}
    >
      <span className={`inline-block text-[10px] font-bold uppercase tracking-wide ${accent.bg} text-white rounded-full px-2 py-0.5 mb-2`}>
        {SOCIAL_TYPE_LABEL[item.type]}
      </span>
      <p className="font-serif font-semibold text-sm text-balance text-ink line-clamp-3">
        {item.prompt || `${item.optionA.label} or ${item.optionB.label}?`}
      </p>
      <p className={`text-xs font-semibold mt-2 ${accent.text}`}>
        {voteCount.toLocaleString()} recent vote{voteCount === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
