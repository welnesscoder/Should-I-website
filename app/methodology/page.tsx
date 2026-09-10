import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Should I? Works",
  description: "How the three decision engines score answers, and what the 0–100 verdict actually means.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">How Should I? works</h1>
      <div className="flex flex-col gap-6 text-slate">
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">The 0–100 score</h2>
          <p>
            Every decision — however it&apos;s calculated — ends up as a score from 0 to 100, and a verdict band:
            0–19 No, 20–39 Probably no, 40–60 Maybe, 61–80 Probably yes, 81–100 Yes. The number summarizes the
            factors that went into it; it isn&apos;t a scientific measurement, and small changes to your answers
            can reasonably shift it by several points.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">Quick decisions</h2>
          <p>
            A handful of yes/no questions, each nudging the score up or down from a neutral starting point. Built
            for decisions you can genuinely answer in under fifteen seconds.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">Weigh-it-up decisions</h2>
          <p>
            You compare each factor (much worse to much better) and say how much it matters to you (low, medium,
            high importance). Those combine into a single normalized score, so a factor you don&apos;t care about
            can&apos;t swing the result as much as one you&apos;ve marked as high priority.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">Calculated decisions</h2>
          <p>
            These use real formulas — proper mortgage amortization, disposable-income math, effective hourly
            compensation — broken into two to four named components (like affordability and usage value) that
            combine into the overall score. Every calculator explains what it assumed, and none of them are a
            substitute for professional financial advice.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-xl font-semibold text-ink mb-2">Community voting</h2>
          <p>
            Voting doesn&apos;t require an account. Each browser gets a lightweight, anonymous identifier to keep
            one vote per person per decision — it&apos;s a soft protection, not a fraud-proof system, and vote
            totals are never faked or seeded.
          </p>
        </section>
      </div>
    </div>
  );
}
