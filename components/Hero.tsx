"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { DECISIONS, decisionHref } from "@/content/decisions";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DECISIONS.filter((d) => d.title.toLowerCase().includes(q) || d.teaser.toLowerCase().includes(q)).slice(
      0,
      6,
    );
  }, [query]);

  function goToDecision() {
    if (matches[0]) router.push(decisionHref(matches[0]));
  }

  return (
    <section className="max-w-2xl mx-auto px-5 pt-12 pb-10 text-center sm:text-left">
      <h1 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight">SayLess</h1>
      <p className="mt-3 text-lg text-ink max-w-md mx-auto sm:mx-0">The internet has opinions. So do we.</p>
      <p className="mt-2 text-slate max-w-md mx-auto sm:mx-0">
        Decisions, dilemmas, hot takes &amp; questionable choices.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto sm:mx-0">
        <Link
          href="/feed"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full bg-ink text-paper font-medium focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        >
          Start scrolling <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href="/should-i"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-full border-2 border-ink font-medium hover:bg-ink hover:text-paper focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 transition-colors"
        >
          Help me decide
        </Link>
      </div>

      <div className="mt-6 relative max-w-md mx-auto sm:mx-0">
        <label htmlFor="decision-search" className="sr-only">
          Or jump straight to a decision
        </label>
        <div className="flex items-center gap-2 border border-rule rounded-lg px-4 py-2.5 bg-white/50">
          <Search size={16} className="text-slate shrink-0" aria-hidden="true" />
          <input
            id="decision-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goToDecision();
            }}
            placeholder="Or search a decision — 'should I buy it?'"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        {matches.length > 0 && (
          <ul className="absolute z-10 left-0 right-0 mt-1 bg-paper border border-rule rounded-lg overflow-hidden shadow-sm text-left">
            {matches.map((d) => (
              <li key={d.id}>
                <a
                  href={decisionHref(d)}
                  className="block px-4 py-2.5 text-sm hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2"
                >
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
