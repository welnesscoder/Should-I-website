import { decisionHref, getDecision } from "@/content/decisions";
import { getUnifiedTrending } from "@/lib/content/trending";
import TrendingRow from "./TrendingRow";
import TicketRow from "./TicketRow";

const FALLBACK_IDS = ["should-i-buy-it", "take-job-offer", "text-them-first", "buy-it-on-sale", "get-a-tattoo"];

export default async function TrendingSection() {
  const trending = await getUnifiedTrending(6);
  const isReal = trending.length > 0;
  const fallbackDecisions = isReal
    ? []
    : FALLBACK_IDS.map((id) => getDecision(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mb-1">
        {isReal ? "🔥 Trending right now" : "Popular to start with"}
      </h2>
      {!isReal && (
        <p className="text-xs text-slate mb-3">Nothing&apos;s trending yet — here are a few good places to start.</p>
      )}
      <div className="flex flex-col mt-2">
        {isReal
          ? trending.map((entry) => (
              <TrendingRow key={entry.kind === "should_i" ? entry.decision.id : entry.item.id} entry={entry} />
            ))
          : fallbackDecisions.map((d) => <TicketRow key={d.id} href={decisionHref(d)} title={d.title} teaser={d.teaser} />)}
      </div>
    </section>
  );
}
