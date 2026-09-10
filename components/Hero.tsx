"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { DECISIONS } from "@/content/decisions";

const ROTATING_EXAMPLES = [
  "buy it?",
  "take the job?",
  "text them?",
  "move to a new city?",
  "go tonight?",
  "get the tattoo?",
  "hit snooze?",
];

export default function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % ROTATING_EXAMPLES.length), 2400);
    return () => clearInterval(t);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DECISIONS.filter((d) => d.title.toLowerCase().includes(q) || d.teaser.toLowerCase().includes(q)).slice(
      0,
      6,
    );
  }, [query]);

  function goToDecision() {
    if (matches[0]) router.push(`/${matches[0].category}/${matches[0].slug}`);
  }

  return (
    <section className="max-w-2xl mx-auto px-5 pt-12 pb-10 text-center sm:text-left">
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight">
        Should I<br />
        <span className="text-slate" aria-live="polite">
          {ROTATING_EXAMPLES[index]}
        </span>
      </h1>
      <p className="mt-4 text-slate max-w-md mx-auto sm:mx-0">
        Pick a decision. Answer a few honest questions. Get a straight 0–100 verdict — and see what everyone else
        decided too.
      </p>

      <div className="mt-6 relative max-w-md mx-auto sm:mx-0">
        <label htmlFor="decision-search" className="sr-only">
          What are you trying to decide?
        </label>
        <div className="flex items-center gap-2 border-2 border-ink rounded-lg px-4 py-3 bg-white/60">
          <Search size={18} className="text-slate shrink-0" aria-hidden="true" />
          <input
            id="decision-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToDecision();
            }}
            placeholder="What are you trying to decide?"
            className="w-full bg-transparent outline-none text-base"
          />
        </div>
        {matches.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 mt-1 bg-paper border border-rule rounded-lg overflow-hidden shadow-sm">
            {matches.map((d) => (
              <li key={d.id}>
                <a
                  href={`/${d.category}/${d.slug}`}
                  className="block px-4 py-2.5 text-sm hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={goToDecision}
          disabled={matches.length === 0}
          className="mt-3 w-full sm:w-auto px-6 py-2.5 rounded-full bg-ink text-paper font-medium disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          Help me decide
        </button>
      </div>
    </section>
  );
}
