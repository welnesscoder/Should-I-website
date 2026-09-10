import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "move-to-new-city",
  slug: "should-i-move-to-a-new-city",
  category: "life",
  engine: "weighted",
  title: "Should I move to a new city?",
  teaser: "Opportunity, roots, and gut feeling, side by side.",
  seo: {
    description: "Weigh the opportunity, your readiness to leave, cost of living, and your gut feeling.",
    keywords: ["should I move to a new city", "relocation decision"],
  },
  factors: [
    {
      id: "opportunity",
      type: "subjective",
      label: "How strong is the opportunity pulling you there?",
      shortLabel: "Opportunity",
      scaleLabels: ["Very weak", "Weak", "Moderate", "Strong", "Very strong"],
    },
    {
      id: "readinessToLeave",
      type: "subjective",
      label: "How ready are you to leave where you are now?",
      shortLabel: "Readiness to leave",
      scaleLabels: ["Not ready", "Hesitant", "Neutral", "Ready", "Very ready"],
    },
    {
      id: "costOfLiving",
      type: "subjective",
      label: "Does the cost of living work in your favor there?",
      shortLabel: "Cost of living",
      scaleLabels: ["Much worse", "Worse", "About the same", "Better", "Much better"],
    },
    {
      id: "gutFeeling",
      type: "subjective",
      label: "When you picture living there, what does your gut say?",
      shortLabel: "Gut feeling",
      scaleLabels: ["Dread", "Unsure", "Neutral", "Good", "Excited"],
    },
  ],
};

export default decision;
