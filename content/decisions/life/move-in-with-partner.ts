import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "move-in-with-partner",
  slug: "should-i-move-in-with-my-partner",
  category: "life",
  engine: "weighted",
  title: "Should I move in with my partner?",
  teaser: "Relationship readiness meets practical logistics.",
  seo: {
    description:
      "Moving in together mixes relationship readiness with practical logistics. Weigh both honestly.",
    keywords: ["should I move in with my partner", "moving in together decision"],
  },
  factors: [
    {
      id: "relationshipStability",
      type: "subjective",
      label: "How stable and communicative is the relationship?",
      shortLabel: "Relationship stability",
      scaleLabels: ["Rocky", "Inconsistent", "Okay", "Stable", "Very stable"],
    },
    {
      id: "financialSense",
      type: "subjective",
      label: "Does combining households make financial sense?",
      shortLabel: "Financial sense",
      scaleLabels: ["Not really", "Unclear", "Neutral", "Makes sense", "Clearly makes sense"],
    },
    {
      id: "personalReadiness",
      type: "subjective",
      label: "How ready are you to give up living solo (or with roommates)?",
      shortLabel: "Personal readiness",
      scaleLabels: ["Not ready", "Hesitant", "Neutral", "Ready", "Very ready"],
    },
    {
      id: "conflictHandling",
      type: "subjective",
      label: "How well do you two handle conflict when it happens?",
      shortLabel: "Conflict handling",
      scaleLabels: ["Poorly", "Not great", "Okay", "Well", "Very well"],
    },
  ],
};

export default decision;
