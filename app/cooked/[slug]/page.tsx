import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COOKED } from "@/content/social/cooked";
import { getSocialItemBySlug, socialHref } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialDetailShell from "@/components/social/SocialDetailShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export function generateStaticParams() {
  return COOKED.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getSocialItemBySlug("cooked", slug);
  if (!item) return {};

  return {
    title: item.prompt,
    description: item.seo?.description ?? item.prompt,
    alternates: { canonical: socialHref(item) },
    openGraph: { title: "Am I Cooked?", description: item.prompt, type: "website" },
  };
}

export default async function CookedDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSocialItemBySlug("cooked", slug);
  if (!item) notFound();

  const counts = await getSocialVoteCounts(item.type, item.id);

  return (
    <SocialDetailShell
      eyebrow="🔥 Am I Cooked?"
      backHref="/cooked"
      backLabel="Am I Cooked?"
      item={item}
      counts={counts}
      siteUrl={SITE_URL}
    />
  );
}
