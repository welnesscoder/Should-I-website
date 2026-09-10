import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/content/categories";
import { DECISIONS, categoryHref, decisionHref } from "@/content/decisions";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://should-i.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/feed`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/should-i`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/trending`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/question-of-the-day`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/methodology`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}${categoryHref(c.id)}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const decisionRoutes: MetadataRoute.Sitemap = DECISIONS.map((d) => ({
    url: `${SITE_URL}${decisionHref(d)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...decisionRoutes];
}
