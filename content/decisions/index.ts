import type { CategoryId } from "@/content/categories";
import type { DecisionConfig, EngineType } from "@/lib/engines/types";
import MONEY_DECISIONS from "./money";
import LIFE_DECISIONS from "./life";
import CAREER_DECISIONS from "./career";
import FUN_DECISIONS from "./fun";
import QUICK_DECISIONS from "./quick";

export const DECISIONS: DecisionConfig[] = [
  ...MONEY_DECISIONS,
  ...LIFE_DECISIONS,
  ...CAREER_DECISIONS,
  ...FUN_DECISIONS,
  ...QUICK_DECISIONS,
];

export const FLAGSHIP_IDS = ["should-i-buy-it", "take-job-offer", "text-them-first"];

export const ENGINE_LABEL: Record<EngineType, string> = {
  quick: "Quick tap",
  calculated: "Do the math",
  weighted: "Weigh it up",
};

export function getDecision(id: string): DecisionConfig | undefined {
  return DECISIONS.find((d) => d.id === id);
}

export function getDecisionBySlug(category: string, slug: string): DecisionConfig | undefined {
  return DECISIONS.find((d) => d.category === category && d.slug === slug);
}

export function getCategoryDecisions(category: CategoryId): DecisionConfig[] {
  return DECISIONS.filter((d) => d.category === category);
}

export function getRelated(decision: DecisionConfig, count = 3): DecisionConfig[] {
  if (decision.relatedIds?.length) {
    return decision.relatedIds
      .map((id) => getDecision(id))
      .filter((d): d is DecisionConfig => Boolean(d))
      .slice(0, count);
  }
  return DECISIONS.filter((d) => d.category === decision.category && d.id !== decision.id).slice(0, count);
}

export function getFlagshipDecisions(): DecisionConfig[] {
  return FLAGSHIP_IDS.map((id) => getDecision(id)).filter((d): d is DecisionConfig => Boolean(d));
}
