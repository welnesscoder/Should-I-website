import type { Metadata } from "next";
import { decisionHref, getDecision } from "@/content/decisions";
import { getUnifiedTrending } from "@/lib/content/trending";
import TrendingRow from "@/components/TrendingRow";
import TicketRow from "@/components/TicketRow";

export const metadata: Metadata = {
  title: "Trending",
  description: "Everything on SayLess the community is voting on most right now.",
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
  const trending = await getUnifiedTrending(20);
  const isReal = trending.length > 0;
  const fallbackDecisions = isReal
    ? []
    : FALLBACK_IDS.map((id) => getDecision(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">🔥 Trending</h1>
      <p className="text-slate mt-2">
        {isReal
          ? "Ranked by voting activity across all of SayLess in the last 48 hours."
          : "Nothing's trending yet — here's a good place to start."}
      </p>
      <div className="flex flex-col mt-6">
        {isReal
          ? trending.map((entry) => (
              <TrendingRow key={entry.kind === "should_i" ? entry.decision.id : entry.item.id} entry={entry} />
            ))
          : fallbackDecisions.map((d) => <TicketRow key={d.id} href={decisionHref(d)} title={d.title} teaser={d.teaser} />)}
      </div>
    </div>
  );
}
