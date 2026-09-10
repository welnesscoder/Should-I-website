import Link from "next/link";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/should-i", label: "Should I?" },
  { href: "/trending", label: "Trending" },
  { href: "/discover", label: "More" },
];

export default function Header() {
  return (
    <header className="border-b border-rule">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold shrink-0 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          SayLess
        </Link>
        <nav aria-label="Primary" className="hidden sm:flex gap-5 text-sm whitespace-nowrap min-w-0 ml-auto">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-slate hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm px-1"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
