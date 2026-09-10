import Link from "next/link";
import { getCategoryDecisions } from "@/content/decisions";

export default function QuickFireRow() {
  const decisions = getCategoryDecisions("quick");

  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-3">Quick fire</p>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory">
        {decisions.map((d) => (
          <Link
            key={d.id}
            href={`/${d.category}/${d.slug}`}
            className="snap-start shrink-0 whitespace-nowrap rounded-full border border-rule px-4 py-2 text-sm bg-white/50 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          >
            {d.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
