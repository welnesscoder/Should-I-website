import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "What Should I? is, and why it exists.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">About Should I?</h1>
      <div className="flex flex-col gap-4 text-slate">
        <p>
          Life is full of questionable decisions — some big, some genuinely trivial. Should I? gives you a
          straightforward way to think one through: answer a few honest questions, get a plain-language 0–100
          verdict, see what everyone else decided, and move on with your day.
        </p>
        <p>
          It isn&apos;t trying to replace a financial advisor, a therapist, or your own judgment. It&apos;s a
          clarity tool — something that turns a vague, circling feeling into a specific set of factors you can
          actually look at, and a number that summarizes them without pretending to be more certain than it is.
        </p>
        <p>
          Every calculator shows its assumptions. Every quick decision is built to be answered in under fifteen
          seconds. And nothing here is designed to make you feel bad about a purchase, a choice, or a doubt —
          the goal is a straight answer, not a lecture.
        </p>
      </div>
    </div>
  );
}
