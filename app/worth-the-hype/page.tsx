import type { Metadata } from "next";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialIndexList from "@/components/social/SocialIndexList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Worth the Hype?",
  description: "Trends, products, and internet phenomena — worth it or overrated?",
  alternates: { canonical: "/worth-the-hype" },
};

export default async function HypeIndexPage() {
  const topics = getSocialByType("hype");
  const entries = await Promise.all(
    topics.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <SocialIndexList
      eyebrow="✨ Worth the Hype?"
      title="Is it actually worth it?"
      description="Community opinion, not paid reviews. Vote and see where everyone lands."
      entries={entries}
      siteUrl={SITE_URL}
    />
  );
}
