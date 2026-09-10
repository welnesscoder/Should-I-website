import type { SocialContentItem, SocialContentType } from "@/lib/content/types";
import { COOKED } from "./cooked";
import { WHOS_WRONG } from "./whos-wrong";
import { NORMAL } from "./is-this-normal";
import { HYPE } from "./worth-the-hype";
import { QUICK_FIRE } from "./quick-fire";

export const SOCIAL_CONTENT: SocialContentItem[] = [...COOKED, ...WHOS_WRONG, ...NORMAL, ...HYPE, ...QUICK_FIRE];

export function getSocialItem(id: string): SocialContentItem | undefined {
  return SOCIAL_CONTENT.find((item) => item.id === id);
}

export function getSocialItemBySlug(type: SocialContentType, slug: string): SocialContentItem | undefined {
  return SOCIAL_CONTENT.find((item) => item.type === type && item.slug === slug);
}

export function getSocialByType(type: SocialContentType): SocialContentItem[] {
  return SOCIAL_CONTENT.filter((item) => item.type === type);
}

export function getFeaturedSocial(limit = 6): SocialContentItem[] {
  const featured = SOCIAL_CONTENT.filter((item) => item.featured);
  return (featured.length ? featured : SOCIAL_CONTENT).slice(0, limit);
}
