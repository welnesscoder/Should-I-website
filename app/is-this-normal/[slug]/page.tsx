import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NORMAL } from "@/content/social/is-this-normal";
import { getSocialItemBySlug, socialHref } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import SocialDetailShell from "@/components/social/SocialDetailShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export function generateStaticParams() {
  return NORMAL.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getSocialItemBySlug("normal", slug);
  if (!item) return {};

  return {
    title: item.prompt,
    description: item.seo?.description ?? item.prompt,
    alternates: { canonical: socialHref(item) },
    openGraph: { title: "Is This Normal?", description: item.prompt, type: "website" },
  };
}

export default async function NormalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSocialItemBySlug("normal", slug);
  if (!item) notFound();

  const counts = await getSocialVoteCounts(item.type, item.id);

  return (
    <SocialDetailShell
      eyebrow="👀 Is This Normal?"
      backHref="/is-this-normal"
      backLabel="Is This Normal?"
      item={item}
      counts={counts}
      siteUrl={SITE_URL}
    />
  );
}
