import type { Metadata } from "next";
import { getDecision } from "@/content/decisions";
import { getTrending } from "@/lib/supabase/queries";
import TicketRow from "@/components/TicketRow";

export const metadata: Metadata = {
  title: "Trending",
  description: "The decisions the community is voting on most right now.",
  alternates: { canonical: "/trending" },
};

const FALLBACK_IDS = [
  "should-i-buy-it",
  "take-job-offer",
  "text-them-first",
  "buy-it-on-sale",
  "get-a-tattoo",
  "quit-without-a-job",
];

export default async function TrendingPage() {
  const trending = await getTrending(20);
  const trendingDecisions = trending
    .map((t) => getDecision(t.decisionId))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const isReal = trendingDecisions.length > 0;
  const decisions = isReal ? trendingDecisions : FALLBACK_IDS.map((id) => getDecision(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">🔥 Trending</h1>
      <p className="text-slate mt-2">
        {isReal
          ? "Ranked by voting activity in the last 48 hours."
          : "Nothing's trending yet — here's a good place to start."}
      </p>
      <div className="flex flex-col mt-6">
        {decisions.map((d) => (
          <TicketRow key={d.id} href={`/${d.category}/${d.slug}`} title={d.title} teaser={d.teaser} />
        ))}
      </div>
    </div>
  );
}
