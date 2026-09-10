import type { SocialContentItem } from "@/lib/content/types";

export const HYPE: SocialContentItem[] = [
  {
    id: "hype-expensive-skincare",
    slug: "expensive-skincare",
    type: "hype",
    category: "beauty",
    prompt: "$80+ skincare serums.",
    optionA: { key: "worth_it", label: "Worth it" },
    optionB: { key: "overrated", label: "Overrated" },
    seo: { description: "Vote on whether expensive skincare serums are worth the hype." },
    featured: true,
  },
  {
    id: "hype-smart-rings",
    slug: "smart-rings",
    type: "hype",
    category: "tech",
    prompt: "Smart rings that track your sleep and recovery.",
    optionA: { key: "worth_it", label: "Worth it" },
    optionB: { key: "overrated", label: "Overrated" },
    seo: { description: "Vote on whether smart rings are worth the hype." },
    featured: true,
  },
  {
    id: "hype-matcha",
    slug: "matcha",
    type: "hype",
    category: "food",
    prompt: "Matcha — the drink, the flavor, the whole aesthetic.",
    optionA: { key: "worth_it", label: "Worth it" },
    optionB: { key: "overrated", label: "Overrated" },
    seo: { description: "Vote on whether matcha lives up to the hype." },
  },
];
