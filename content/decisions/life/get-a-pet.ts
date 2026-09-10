import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "get-a-pet",
  slug: "should-i-get-a-pet",
  category: "life",
  engine: "weighted",
  title: "Should I get a pet?",
  teaser: "It's a decade-long yes, not a weekend one.",
  seo: {
    description: "A pet is a ten-plus year commitment. Weigh your schedule, finances, and support system honestly.",
    keywords: ["should I get a pet", "should I get a dog", "should I get a cat"],
  },
  factors: [
    {
      id: "scheduleStability",
      type: "subjective",
      label: "How stable is your schedule for the next several years?",
      shortLabel: "Schedule stability",
      scaleLabels: ["Very unstable", "Shaky", "Okay", "Stable", "Very stable"],
    },
    {
      id: "financialReadiness",
      type: "subjective",
      label: "How ready are you for vet bills and ongoing cost?",
      shortLabel: "Financial readiness",
      scaleLabels: ["Not ready", "A stretch", "Manageable", "Ready", "Very ready"],
    },
    {
      id: "howLongWanted",
      type: "subjective",
      label: "How long have you specifically wanted this?",
      shortLabel: "How long wanted",
      scaleLabels: ["Just now", "A few weeks", "A few months", "Over a year", "Years"],
    },
    {
      id: "supportSystem",
      type: "subjective",
      label: "Do you have people who could help when you travel or are busy?",
      shortLabel: "Support system",
      scaleLabels: ["No one", "Barely", "Some", "Good support", "Strong support"],
    },
  ],
};

export default decision;
