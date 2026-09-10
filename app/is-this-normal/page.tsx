import type { Metadata } from "next";
import { getSocialByType } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialIndexList from "@/components/social/SocialIndexList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export const metadata: Metadata = {
  title: "Is This Normal?",
  description: "Relatable behavior, put to a vote. Reassurance, not diagnosis.",
  alternates: { canonical: "/is-this-normal" },
};

export default async function NormalIndexPage() {
  const questions = getSocialByType("normal");
  const entries = await Promise.all(
    questions.map(async (item) => ({ item, counts: await getSocialVoteCounts(item.type, item.id) })),
  );

  return (
    <SocialIndexList
      eyebrow="👀 Is This Normal?"
      title="You're probably not the only one."
      description="Relatable behavior, put to a vote — reassurance, not diagnosis."
      entries={entries}
      siteUrl={SITE_URL}
    />
  );
}
