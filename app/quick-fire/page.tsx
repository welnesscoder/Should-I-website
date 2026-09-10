import type { Metadata } from "next";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import QuickFireDeck from "@/components/social/QuickFireDeck";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Quick Fire",
  description: "Fast either/or votes. Tap one, see the split, next question.",
  alternates: { canonical: "/quick-fire" },
};

export default async function QuickFirePage() {
  const pairs = getSocialByType("quick_fire");
  const entries = await Promise.all(
    pairs.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-2">⚡ Quick Fire</p>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">Pick one. Fast.</h1>
      <p className="text-slate mt-2 max-w-md">No overthinking — just tap.</p>

      <div className="mt-8">
        <QuickFireDeck entries={entries} shareUrl={`${SITE_URL}/quick-fire`} />
      </div>
    </div>
  );
}
