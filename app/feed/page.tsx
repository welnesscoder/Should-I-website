import type { Metadata } from "next";
import { buildFeed, type FeedItem } from "@/lib/content/feed";
import { getDailyQuestion, getDailyQuestionVoteCounts, getSocialVoteCounts } from "@/lib/supabase/queries";
import FeedList, { type FeedEntry } from "@/components/feed/FeedList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Feed",
  description: "Everything SayLess in one scroll — vote, see the split, share, keep going.",
  alternates: { canonical: "/feed" },
};

export default async function FeedPage() {
  const feedItems: FeedItem[] = buildFeed();
  const dailyQuestion = await getDailyQuestion();

  const [dailyEntry, ...socialAndShouldI] = await Promise.all([
    (async (): Promise<FeedEntry | null> => {
      if (!dailyQuestion) return null;
      const counts = await getDailyQuestionVoteCounts(dailyQuestion.id);
      return { entry: { kind: "daily_question", question: dailyQuestion, counts } };
    })(),
    ...feedItems.map(
      async (item): Promise<FeedEntry> =>
        item.kind === "social"
          ? { entry: item, counts: await getSocialVoteCounts(item.item.type, item.item.id) }
          : { entry: item },
    ),
  ]);

  const entries: FeedEntry[] = dailyEntry ? [dailyEntry, ...socialAndShouldI] : socialAndShouldI;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:px-5 sm:py-10">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold mb-1">The Feed</h1>
      <p className="text-slate text-sm mb-6">Vote, see the split, keep scrolling.</p>
      <FeedList entries={entries} siteUrl={SITE_URL} />
    </div>
  );
}
