import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What SayLess is, and why it exists.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">About SayLess</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          The internet has opinions about everything — your decisions, your dilemmas, whether that purchase was
          worth the hype. SayLess is a place to put those opinions to a vote: scroll the feed, react, see what
          people actually think, and move on with your day.
        </p>
        <p>
          <strong className="text-ink">Should I?</strong> is SayLess&apos;s useful side: answer a few honest
          questions, get a plain-language 0–100 verdict. It isn&apos;t trying to replace a financial advisor, a
          therapist, or your own judgment — it&apos;s a clarity tool that turns a vague, circling feeling into a
          specific set of factors and a number, without pretending to be more certain than it is.
        </p>
        <p>
          <strong className="text-ink">Am I Cooked?</strong>, <strong className="text-ink">Who&apos;s Wrong?</strong>,{" "}
          <strong className="text-ink">Is This Normal?</strong>, and the rest are SayLess&apos;s fun side —
          community voting on relatable situations, no accounts required, nothing designed to make anyone feel bad.
          Every calculator shows its assumptions, every quick decision is built to be answered in under fifteen
          seconds, and every vote is real — never fabricated.
        </p>
      </div>
    </div>
  );
}
