import type { Metadata } from "next";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialIndexList from "@/components/social/SocialIndexList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Am I Cooked?",
  description: "Read the situation, vote cooked or fine, see what the internet thinks.",
  alternates: { canonical: "/cooked" },
};

export default async function CookedIndexPage() {
  const scenarios = getSocialByType("cooked");
  const entries = await Promise.all(
    scenarios.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <SocialIndexList
      eyebrow="🔥 Am I Cooked?"
      title="How cooked are they, really?"
      description="No sugarcoating — just the community's honest read."
      entries={entries}
      siteUrl={SITE_URL}
    />
  );
}
