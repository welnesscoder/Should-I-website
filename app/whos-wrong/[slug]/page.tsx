import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WHOS_WRONG } from "@/content/social/whos-wrong";
import { getSocialItemBySlug, socialHref } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialDetailShell from "@/components/social/SocialDetailShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export function generateStaticParams() {
  return WHOS_WRONG.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getSocialItemBySlug("whos_wrong", slug);
  if (!item) return {};

  return {
    title: item.prompt,
    description: item.seo?.description ?? item.prompt,
    alternates: { canonical: socialHref(item) },
    openGraph: { title: "Who's Wrong?", description: item.prompt, type: "website" },
  };
}

export default async function WhosWrongDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSocialItemBySlug("whos_wrong", slug);
  if (!item) notFound();

  const counts = await getSocialVoteCounts(item.type, item.id);

  return (
    <SocialDetailShell
      eyebrow="⚖️ Who's Wrong?"
      backHref="/whos-wrong"
      backLabel="Who's Wrong?"
      item={item}
      counts={counts}
      siteUrl={SITE_URL}
    />
  );
}
