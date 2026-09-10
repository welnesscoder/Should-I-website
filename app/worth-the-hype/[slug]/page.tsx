import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HYPE } from "@/content/social/worth-the-hype";
import { getSocialItemBySlug, socialHref } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialDetailShell from "@/components/social/SocialDetailShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export function generateStaticParams() {
  return HYPE.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getSocialItemBySlug("hype", slug);
  if (!item) return {};

  return {
    title: item.prompt,
    description: item.seo?.description ?? item.prompt,
    alternates: { canonical: socialHref(item) },
    openGraph: { title: "Worth the Hype?", description: item.prompt, type: "website" },
  };
}

export default async function HypeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSocialItemBySlug("hype", slug);
  if (!item) notFound();

  const counts = await getSocialVoteCounts(item.type, item.id);

  return (
    <SocialDetailShell
      eyebrow="✨ Worth the Hype?"
      backHref="/worth-the-hype"
      backLabel="Worth the Hype?"
      item={item}
      counts={counts}
      siteUrl={SITE_URL}
    />
  );
}
