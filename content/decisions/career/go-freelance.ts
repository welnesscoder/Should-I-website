import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "go-freelance",
  slug: "should-i-go-freelance",
  category: "career",
  engine: "weighted",
  title: "Should I go freelance?",
  teaser: "Cushion, pipeline, and appetite for risk.",
  seo: {
    description: "Weigh your savings cushion, client pipeline, income comfort, and how much autonomy matters.",
    keywords: ["should I go freelance", "freelance vs full-time"],
  },
  factors: [
    {
      id: "savingsCushion",
      type: "subjective",
      label: "How big is your savings cushion?",
      shortLabel: "Savings cushion",
      scaleLabels: ["Very thin", "Thin", "Okay", "Solid", "Very solid"],
    },
    {
      id: "pipelineConfidence",
      type: "subjective",
      label: "How confident are you in your client pipeline?",
      shortLabel: "Client pipeline",
      scaleLabels: ["No pipeline", "Weak", "Some leads", "Solid", "Very solid"],
    },
    {
      id: "incomeComfort",
      type: "subjective",
      label: "How comfortable are you with unpredictable income?",
      shortLabel: "Income comfort",
      scaleLabels: ["Very uncomfortable", "Uneasy", "Neutral", "Comfortable", "Very comfortable"],
    },
    {
      id: "autonomyValue",
      type: "subjective",
      label: "How much does autonomy matter to you right now?",
      shortLabel: "Autonomy value",
      scaleLabels: ["Not much", "A little", "Some", "A lot", "Everything"],
    },
  ],
};

export default decision;
