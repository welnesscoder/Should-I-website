import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FeedCard from "@/components/feed/FeedCard";
import { buildFeed, feedKey } from "@/lib/content/feed";
import { getSocialVoteCounts } from "@/lib/supabase/queries";

export default async function FeedPreview({ siteUrl }: { siteUrl: string }) {
  const feed = buildFeed().slice(0, 4);
  const entries = await Promise.all(
    feed.map(async (entry) =>
      entry.kind === "social"
        ? { entry, counts: await getSocialVoteCounts(entry.item.type, entry.item.id) }
        : { entry },
    ),
  );

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">The SayLess Feed</p>
      <div className="flex flex-col gap-4">
        {entries.map(({ entry, counts }) => (
          <FeedCard key={feedKey(entry)} entry={entry} counts={counts} siteUrl={siteUrl} />
        ))}
      </div>
      <Link
        href="/feed"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
      >
        Keep scrolling <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </section>
  );
}
