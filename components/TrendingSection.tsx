import { getDecision } from "@/content/decisions";
import { getTrending } from "@/lib/supabase/queries";
import TicketRow from "./TicketRow";

const FALLBACK_IDS = ["should-i-buy-it", "take-job-offer", "text-them-first", "buy-it-on-sale", "get-a-tattoo"];

export default async function TrendingSection() {
  const trending = await getTrending(6);
  const trendingDecisions = trending.map((t) => getDecision(t.decisionId)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  const isReal = trendingDecisions.length > 0;
  const decisions = isReal
    ? trendingDecisions
    : FALLBACK_IDS.map((id) => getDecision(id)).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-1">
        {isReal ? "🔥 Trending right now" : "Popular to start with"}
      </p>
      {!isReal && (
        <p className="text-xs text-slate mb-3">Nothing&apos;s trending yet — here are a few good places to start.</p>
      )}
      <div className="flex flex-col mt-2">
        {decisions.map((d) => (
          <TicketRow key={d.id} href={`/${d.category}/${d.slug}`} title={d.title} teaser={d.teaser} />
        ))}
      </div>
    </section>
  );
}
