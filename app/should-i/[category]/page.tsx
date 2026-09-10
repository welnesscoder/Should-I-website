import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/content/categories";
import { ENGINE_LABEL, decisionHref, getCategoryDecisions } from "@/content/decisions";
import TicketRow from "@/components/TicketRow";
import CategoryOpenedTracker from "@/components/CategoryOpenedTracker";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/should-i/${category.id}` },
    openGraph: { title: `${category.name} — Should I?`, description: category.description },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();

  const decisions = getCategoryDecisions(category.id);
  const Icon = category.icon;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <CategoryOpenedTracker category={category.id} />
      <Icon size={28} className="mb-3" aria-hidden="true" />
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold">{category.name}</h1>
      <p className="text-slate mt-2 max-w-md">{category.description}</p>

      <div className="flex flex-col mt-8">
        {decisions.map((d) => (
          <TicketRow
            key={d.id}
            href={decisionHref(d)}
            title={d.title}
            teaser={d.teaser}
            badge={ENGINE_LABEL[d.engine]}
          />
        ))}
      </div>
    </div>
  );
}
