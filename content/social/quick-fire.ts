import type { SocialContentItem } from "@/lib/content/types";

export const QUICK_FIRE: SocialContentItem[] = [
  {
    id: "qf-call-text",
    slug: "call-or-text",
    type: "quick_fire",
    category: "communication",
    prompt: "",
    optionA: { key: "a", label: "Call" },
    optionB: { key: "b", label: "Text" },
  },
  {
    id: "qf-stay-in-go-out",
    slug: "stay-in-or-go-out",
    type: "quick_fire",
    category: "lifestyle",
    prompt: "",
    optionA: { key: "a", label: "Stay in" },
    optionB: { key: "b", label: "Go out" },
  },
  {
    id: "qf-save-spend",
    slug: "save-or-spend",
    type: "quick_fire",
    category: "money",
    prompt: "",
    optionA: { key: "a", label: "Save" },
    optionB: { key: "b", label: "Spend" },
  },
  {
    id: "qf-ghost-explain",
    slug: "ghost-or-explain",
    type: "quick_fire",
    category: "relationships",
    prompt: "",
    optionA: { key: "a", label: "Ghost" },
    optionB: { key: "b", label: "Explain" },
  },
  {
    id: "qf-iphone-android",
    slug: "iphone-or-android",
    type: "quick_fire",
    category: "tech",
    prompt: "",
    optionA: { key: "a", label: "iPhone" },
    optionB: { key: "b", label: "Android" },
  },
];
