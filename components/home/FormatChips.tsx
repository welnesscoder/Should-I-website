import Link from "next/link";

const CHIPS = [
  { href: "/should-i", emoji: "🧠", label: "Should I?", bg: "bg-brand-soft", text: "text-brand" },
  { href: "/cooked", emoji: "🔥", label: "Am I Cooked?", bg: "bg-cooked-soft", text: "text-cooked" },
  { href: "/whos-wrong", emoji: "⚖️", label: "Who's Wrong?", bg: "bg-wrong-soft", text: "text-wrong" },
  { href: "/is-this-normal", emoji: "👀", label: "Is This Normal?", bg: "bg-normal-soft", text: "text-normal" },
  { href: "/worth-the-hype", emoji: "💎", label: "Worth the Hype?", bg: "bg-hype-soft", text: "text-hype" },
  { href: "/quick-fire", emoji: "⚡", label: "Quick Fire", bg: "bg-quickfire-soft", text: "text-quickfire" },
];

/** Pastel color-block chip row — the fast visual index into every SayLess format from the homepage. */
export default function FormatChips() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-w-md sm:max-w-none mx-auto sm:mx-0 mt-6">
      {CHIPS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-3 px-1 text-center ${c.bg} hover:opacity-80 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 transition-opacity`}
        >
          <span className="text-xl" aria-hidden="true">
            {c.emoji}
          </span>
          <span className={`text-[11px] font-bold leading-tight ${c.text}`}>{c.label}</span>
        </Link>
      ))}
    </div>
  );
}
