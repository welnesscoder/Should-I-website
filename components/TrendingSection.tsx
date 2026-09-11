import { decisionHref, getDecision } from "@/content/decisions";
import { getUnifiedTrending } from "@/lib/content/trending";
import TrendingCard from "./TrendingCard";
import TicketRow from "./TicketRow";

const FALLBACK_IDS = ["should-i-buy-it", "take-job-offer", "text-them-first", "buy-it-on-sale", "get-a-tattoo"];

export default async function TrendingSection() {
  const trending = await getUnifiedTrending(8);
  const isReal = trending.length > 0;
  const fallbackDecisions = isReal
    ? []
    : FALLBACK_IDS.map((id) => getDecision(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <section className="max-w-2xl mx-auto py-6">
      <h2
        className={`font-mono text-xs uppercase tracking-wide font-bold mb-3 px-5 ${isReal ? "text-brand" : "text-slate"}`}
      >
        {isReal ? "🔥 Trending right now" : "Popular to start with"}
      </h2>
      {!isReal && (
        <p className="text-xs text-slate mb-3 px-5">Nothing&apos;s trending yet — here are a few good places to start.</p>
      )}
      {isReal ? (
        <div className="flex gap-3 overflow-x-auto pb-2 px-5 snap-x snap-mandatory">
          {trending.map((entry) => (
            <TrendingCard key={entry.kind === "should_i" ? entry.decision.id : entry.item.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col px-5">
          {fallbackDecisions.map((d) => (
            <TicketRow key={d.id} href={decisionHref(d)} title={d.title} teaser={d.teaser} />
          ))}
        </div>
      )}
    </section>
  );
}
