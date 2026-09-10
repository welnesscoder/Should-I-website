"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, MessageCircleQuestion, TrendingUp, Grid2x2 } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/feed", label: "Feed", icon: Layers, match: (p: string) => p.startsWith("/feed") },
  { href: "/should-i", label: "Should I?", icon: MessageCircleQuestion, match: (p: string) => p.startsWith("/should-i") },
  { href: "/trending", label: "Trending", icon: TrendingUp, match: (p: string) => p.startsWith("/trending") },
  { href: "/discover", label: "More", icon: Grid2x2, match: (p: string) => p.startsWith("/discover") },
];

/**
 * Five items only, matching the brief's explicit mobile priority list — the
 * other social formats (Cooked, Who's Wrong, Normal, Hype) live behind
 * "More" at /discover instead of crowding this bar or the header. Hidden on
 * sm+ where the header nav already covers the same ground.
 */
export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-rule bg-paper/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2 ${
                  active ? "text-ink font-medium" : "text-slate"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
