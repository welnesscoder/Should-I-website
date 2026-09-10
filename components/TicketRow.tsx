import Link from "next/link";

export default function TicketRow({
  href,
  title,
  teaser,
  badge,
}: {
  href: string;
  title: string;
  teaser: string;
  badge?: string;
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
        <span className="font-mono text-xs uppercase tracking-wide text-slate whitespace-nowrap border border-rule rounded-full px-3 py-1">
          {badge}
        </span>
      )}
    </Link>
  );
}
