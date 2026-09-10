import type { Metadata } from "next";
import CategoryGrid from "@/components/CategoryGrid";
import { getFlagshipDecisions, decisionHref } from "@/content/decisions";
import TicketRow from "@/components/TicketRow";

export const metadata: Metadata = {
  title: "Should I?",
  description:
    "Pick a decision, answer a few honest questions, and get a clear 0–100 verdict — plus what everyone else decided too.",
  alternates: { canonical: "/should-i" },
};

export default function ShouldIHub() {
  const flagships = getFlagshipDecisions();

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Should I?</h1>
      <p className="text-slate mt-2 max-w-md">
        Pick a decision. Answer a few honest questions. Get a straight 0–100 verdict — and see what everyone else
        decided too.
      </p>

      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mt-10 mb-3">Start here</h2>
      <div className="flex flex-col mb-4">
        {flagships.map((d) => (
          <TicketRow key={d.id} href={decisionHref(d)} title={d.title} teaser={d.teaser} />
        ))}
      </div>

      <h2 className="font-mono text-xs uppercase tracking-wide text-slate mt-8 mb-1">Browse by category</h2>
      <CategoryGrid />
    </div>
  );
}
