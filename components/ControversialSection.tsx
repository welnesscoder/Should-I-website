import { getDecision } from "@/content/decisions";
import { getMostControversial } from "@/lib/supabase/queries";
import TicketRow from "./TicketRow";

export default async function ControversialSection() {
  const controversial = await getMostControversial(3);
  if (controversial.length === 0) return null;

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">People can&apos;t agree</p>
      <div className="flex flex-col">
        {controversial.map((entry) => {
          const decision = getDecision(entry.decisionId);
          if (!decision) return null;
          const yesPct = Math.round(entry.yesPct);
          return (
            <TicketRow
              key={decision.id}
              href={`/${decision.category}/${decision.slug}`}
              title={decision.title}
              teaser={`${yesPct}% yes · ${100 - yesPct}% no`}
            />
          );
        })}
      </div>
    </section>
  );
}
