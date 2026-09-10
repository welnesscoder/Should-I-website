import { Wallet, Compass, Briefcase, PartyPopper, Zap, type LucideIcon } from "lucide-react";

export type CategoryId = "money" | "life" | "career" | "fun" | "quick";

export interface Category {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  {
    id: "money",
    name: "Money",
    tagline: "Spend it, save it, or put it to work.",
    description:
      "Purchases, big financial calls, and everything in between — with the math shown, not hidden.",
    icon: Wallet,
  },
  {
    id: "life",
    name: "Life",
    tagline: "The decisions that reroute everything else.",
    description: "Moves, relationships, and the personal calls that don't have a formula.",
    icon: Compass,
  },
  {
    id: "career",
    name: "Career",
    tagline: "Job moves, raises, and everything between.",
    description: "Offers, raises, and the professional decisions worth thinking through twice.",
    icon: Briefcase,
  },
  {
    id: "fun",
    name: "Fun",
    tagline: "Low stakes. Still worth a second thought.",
    description: "Entertainment, splurges, and the decisions that should stay fun.",
    icon: PartyPopper,
  },
  {
    id: "quick",
    name: "Quick",
    tagline: "Answer in one tap.",
    description: "The small stuff. Fifteen seconds, straight answer, move on with your day.",
    icon: Zap,
  },
];

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
