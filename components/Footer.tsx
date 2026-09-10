import Link from "next/link";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/methodology", label: "How Should I? Works" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-rule mt-14 pb-16 sm:pb-0">
      <div className="max-w-3xl mx-auto px-5 py-8 text-sm text-slate">
        <nav aria-label="Site" className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p>
          SayLess is for clarity and fun — decisions, dilemmas, and community opinions. Should I?&apos;s calculated
          verdicts are not professional financial, legal, or medical advice.
        </p>
      </div>
    </footer>
  );
}
