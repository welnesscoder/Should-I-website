import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover",
  description: "Every SayLess format in one place.",
  alternates: { canonical: "/discover" },
};

const FORMATS = [
  {
    href: "/feed",
    emoji: "📱",
    title: "The Feed",
    description: "Everything mixed together — vote, see the split, keep scrolling.",
    border: "border-brand",
    text: "text-brand",
  },
  {
    href: "/should-i",
    emoji: "🤔",
    title: "Should I?",
    description: "Answer a few honest questions, get a straight verdict.",
    border: "border-brand",
    text: "text-brand",
  },
  {
    href: "/cooked",
    emoji: "🔥",
    title: "Am I Cooked?",
    description: "Read the situation, vote cooked or fine.",
    border: "border-cooked",
    text: "text-cooked",
  },
  {
    href: "/whos-wrong",
    emoji: "⚖️",
    title: "Who's Wrong?",
    description: "Short dilemmas. The internet judges both sides.",
    border: "border-wrong",
    text: "text-wrong",
  },
  {
    href: "/is-this-normal",
    emoji: "👀",
    title: "Is This Normal?",
    description: "Relatable behavior, put to a vote.",
    border: "border-normal",
    text: "text-normal",
  },
  {
    href: "/worth-the-hype",
    emoji: "✨",
    title: "Worth the Hype?",
    description: "Trends, products, and internet phenomena — worth it or overrated.",
    border: "border-hype",
    text: "text-hype",
  },
  {
    href: "/quick-fire",
    emoji: "⚡",
    title: "Quick Fire",
    description: "Fast either/or votes. Tap one, next question.",
    border: "border-quickfire",
    text: "text-quickfire",
  },
  {
    href: "/question-of-the-day",
    emoji: "📊",
    title: "Question of the Day",
    description: "One big community question, every day.",
    border: "border-brand",
    text: "text-brand",
  },
  {
    href: "/trending",
    emoji: "📈",
    title: "Trending",
    description: "What the community is voting on right now.",
    border: "border-brand",
    text: "text-brand",
  },
];

export default function DiscoverPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Discover</h1>
      <p className="text-slate mt-2 max-w-md">Every SayLess format, in one place.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {FORMATS.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`border-2 ${f.border} rounded-lg p-4 bg-white/50 hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 transition-colors`}
          >
            <span className="block text-xl mb-2" aria-hidden="true">
              {f.emoji}
            </span>
            <span className={`flex items-center gap-1 font-serif text-lg font-bold ${f.text}`}>
              {f.title} <ArrowRight size={14} aria-hidden="true" />
            </span>
            <span className="block text-sm text-slate mt-1">{f.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
