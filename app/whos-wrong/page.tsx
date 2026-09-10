import type { Metadata } from "next";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialIndexList from "@/components/social/SocialIndexList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Who's Wrong?",
  description: "Short dilemmas. The internet judges both sides.",
  alternates: { canonical: "/whos-wrong" },
};

export default async function WhosWrongIndexPage() {
  const dilemmas = getSocialByType("whos_wrong");
  const entries = await Promise.all(
    dilemmas.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <SocialIndexList
      eyebrow="⚖️ Who's Wrong?"
      title="You be the judge."
      description="Read the dilemma, pick a side, see where the internet lands."
      entries={entries}
      siteUrl={SITE_URL}
    />
  );
}
