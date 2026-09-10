import Link from "next/link";
import { CATEGORIES } from "@/content/categories";
import { categoryHref, getCategoryDecisions } from "@/content/decisions";

export default function CategoryGrid() {
  return (
    <section className="max-w-2xl mx-auto px-5 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const examples = getCategoryDecisions(c.id).slice(0, 3);
          return (
            <Link
              key={c.id}
              href={categoryHref(c.id)}
              className="text-left border dashed-edge rounded-lg p-4 bg-white/40 hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
            >
              <Icon size={20} className="mb-2" aria-hidden="true" />
              <span className="block font-serif text-lg font-medium">{c.name}</span>
              <span className="block text-sm text-slate mt-1">{c.tagline}</span>
              <ul className="mt-3 flex flex-col gap-1">
                {examples.map((d) => (
                  <li key={d.id} className="text-xs text-slate truncate">
                    {d.title}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
