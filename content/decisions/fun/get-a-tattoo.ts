import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "get-a-tattoo",
  slug: "should-i-get-this-tattoo",
  category: "fun",
  engine: "weighted",
  title: "Should I get this tattoo?",
  teaser: "Permanence deserves more than a slider, but here's a start.",
  seo: {
    description:
      "Weigh how long you've wanted it, your comfort with permanence, cost readiness, and what it actually means.",
    keywords: ["should I get a tattoo", "get this tattoo decision"],
  },
  riskLevel: "sensitive",
  factors: [
    {
      id: "howLongWanted",
      type: "subjective",
      label: "How long have you wanted this exact design?",
      shortLabel: "How long wanted",
      scaleLabels: ["Just now", "A few weeks", "A few months", "Over a year", "Years"],
    },
    {
      id: "permanenceComfort",
      type: "subjective",
      label: "How comfortable are you with permanence?",
      shortLabel: "Permanence comfort",
      scaleLabels: ["Very uncomfortable", "Uneasy", "Neutral", "Comfortable", "Very comfortable"],
    },
    {
      id: "costReadiness",
      type: "subjective",
      label: "Are you financially ready for it, touch-ups included?",
      shortLabel: "Cost readiness",
      scaleLabels: ["Not ready", "A stretch", "Manageable", "Ready", "Very ready"],
    },
    {
      id: "realMeaning",
      type: "subjective",
      label: "Does it mean something, or is it mostly about looking cool right now?",
      shortLabel: "Real meaning",
      scaleLabels: ["Just looks cool", "Mostly aesthetic", "Some meaning", "Meaningful", "Deeply meaningful"],
    },
  ],
};

export default decision;
