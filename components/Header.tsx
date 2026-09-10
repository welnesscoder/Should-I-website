import Link from "next/link";
import { CATEGORIES } from "@/content/categories";

export default function Header() {
  return (
    <header className="border-b border-rule">
      <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="font-serif text-2xl font-bold shrink-0 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
        >
          Should I?
        </Link>
        <nav
          aria-label="Categories"
          className="flex gap-4 overflow-x-auto text-sm whitespace-nowrap min-w-0"
        >
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="text-slate hover:text-ink focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm px-1 shrink-0"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
