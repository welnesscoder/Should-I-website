import Link from "next/link";

export default function TicketRow({
  href,
  title,
  teaser,
  badge,
  badgeClass,
}: {
  href: string;
  title: string;
  teaser: string;
  badge?: string;
  /** Full literal Tailwind classes (e.g. "border-cooked text-cooked") to tint the badge per format. */
  badgeClass?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 py-4 px-1 border-b border-rule hover:bg-white/40 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
    >
      <span>
        <span className="block text-lg font-serif font-medium">{title}</span>
        <span className="block text-sm text-slate mt-0.5">{teaser}</span>
      </span>
      {badge && (
        <span
          className={`font-mono text-xs uppercase tracking-wide font-semibold whitespace-nowrap border rounded-full px-3 py-1 ${
            badgeClass ?? "border-rule text-slate"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
