import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "quit-without-a-job",
  slug: "should-i-quit-without-another-job-lined-up",
  category: "career",
  engine: "weighted",
  title: "Should I quit without another job lined up?",
  teaser: "Runway and burnout, weighed against each other.",
  seo: {
    description: "Weigh your savings runway, market confidence, health cost, and support network before quitting.",
    keywords: ["should I quit my job", "quit without another job", "quit job no backup"],
  },
  factors: [
    {
      id: "savingsRunway",
      type: "subjective",
      label: "How many months could your savings realistically cover you?",
      shortLabel: "Savings runway",
      scaleLabels: ["Under 1 month", "1-2 months", "3-4 months", "5-6 months", "6+ months"],
    },
    {
      id: "marketConfidence",
      type: "subjective",
      label: "How confident are you in finding something else reasonably fast?",
      shortLabel: "Market confidence",
      scaleLabels: ["Not confident", "Unsure", "Somewhat", "Confident", "Very confident"],
    },
    {
      id: "healthCost",
      type: "subjective",
      label: "How much is the current job costing your health right now?",
      shortLabel: "Health cost",
      scaleLabels: ["Nothing", "A little", "Some", "A lot", "Severely"],
    },
    {
      id: "supportNetwork",
      type: "subjective",
      label: "Do you have people who'd help you land on your feet?",
      shortLabel: "Support network",
      scaleLabels: ["No one", "Barely", "Some", "Good support", "Strong support"],
    },
  ],
};

export default decision;
