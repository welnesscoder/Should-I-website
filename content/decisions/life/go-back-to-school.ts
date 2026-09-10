import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "go-back-to-school",
  slug: "should-i-go-back-to-school",
  category: "life",
  engine: "weighted",
  title: "Should I go back to school?",
  teaser: "Payoff, cost, and time, weighed honestly.",
  seo: {
    description: "Weigh the clarity of the payoff against the cost, time, and whether there's a cheaper path.",
    keywords: ["should I go back to school", "return to school decision"],
  },
  factors: [
    {
      id: "clearPayoff",
      type: "subjective",
      label: "How clear is the payoff for your specific goal?",
      shortLabel: "Clear payoff",
      scaleLabels: ["Very unclear", "Fuzzy", "Somewhat clear", "Clear", "Very clear"],
    },
    {
      id: "costComfort",
      type: "subjective",
      label: "How comfortable are you with the cost or debt involved?",
      shortLabel: "Cost comfort",
      scaleLabels: ["Very uncomfortable", "Uneasy", "Neutral", "Comfortable", "Very comfortable"],
    },
    {
      id: "timeEnergy",
      type: "subjective",
      label: "Do you have the time and energy to balance it right now?",
      shortLabel: "Time and energy",
      scaleLabels: ["Not at all", "Barely", "Somewhat", "Yes", "Plenty"],
    },
    {
      id: "noCheaperPath",
      type: "subjective",
      label: "Is there really no cheaper way to get the same result?",
      shortLabel: "No cheaper path",
      scaleLabels: ["Cheaper paths exist", "Probably some", "Unsure", "Probably not", "Definitely not"],
    },
  ],
};

export default decision;
