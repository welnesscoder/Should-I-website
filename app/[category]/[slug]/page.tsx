import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategory } from "@/content/categories";
import { DECISIONS, ENGINE_LABEL, getDecisionBySlug } from "@/content/decisions";
import EngineRunner from "@/components/EngineRunner";

export function generateStaticParams() {
  return DECISIONS.map((d) => ({ category: d.category, slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const decision = getDecisionBySlug(category, slug);
  if (!decision) return {};

  return {
    title: decision.title,
    description: decision.seo.description,
    keywords: decision.seo.keywords,
    alternates: { canonical: `/${decision.category}/${decision.slug}` },
    openGraph: {
      title: decision.title,
      description: decision.seo.description,
      type: "website",
    },
  };
}

export default async function DecisionPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categoryId, slug } = await params;
  const decision = getDecisionBySlug(categoryId, slug);
  if (!decision) notFound();

  const category = getCategory(decision.category);
  const jsonLd =
    decision.faqs && decision.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: decision.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <Link
        href={`/${decision.category}`}
        className="inline-flex items-center gap-1 text-sm text-slate hover:text-ink mb-6 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 rounded-sm"
      >
        <ArrowLeft size={14} aria-hidden="true" /> {category?.name ?? "Back"}
      </Link>

      <p className="font-mono text-xs uppercase tracking-wide text-slate mb-2">{ENGINE_LABEL[decision.engine]}</p>
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold mb-2 text-balance">{decision.title}</h1>
      <p className="text-slate mb-8">{decision.teaser}</p>

      <EngineRunner decisionId={decision.id} />

      {(decision.howItWorks || decision.faqs?.length) && (
        <div className="border-t border-rule mt-14 pt-8">
          {decision.howItWorks && (
            <div className="mb-8">
              <h2 className="font-serif text-lg font-semibold mb-2">How this works</h2>
              <p className="text-sm text-slate max-w-xl">{decision.howItWorks}</p>
            </div>
          )}
          {decision.faqs?.map((faq) => (
            <div key={faq.question} className="mb-4">
              <h3 className="font-medium mb-1">{faq.question}</h3>
              <p className="text-sm text-slate">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
