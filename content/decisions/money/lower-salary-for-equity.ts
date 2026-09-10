import type { WeightedDecisionConfig } from "@/lib/engines/types";

const decision: WeightedDecisionConfig = {
  id: "lower-salary-for-equity",
  slug: "should-i-take-a-lower-salary-for-equity",
  category: "money",
  engine: "weighted",
  title: "Should I take a lower salary for equity?",
  teaser: "Weigh the upside against your cash needs.",
  seo: {
    description:
      "Trading salary for equity is a bet on the company and on your own runway. Weigh the factors that actually matter.",
    keywords: ["salary vs equity", "should I take equity over salary", "startup equity decision"],
  },
  factors: [
    {
      id: "companyConfidence",
      type: "subjective",
      label: "How confident are you in where this company is headed?",
      shortLabel: "Company confidence",
      scaleLabels: ["Not confident", "A little skeptical", "Neutral", "Fairly confident", "Very confident"],
    },
    {
      id: "cashCushion",
      type: "subjective",
      label: "How much cushion do you have if take-home pay drops?",
      shortLabel: "Cash cushion",
      scaleLabels: ["Very little", "A bit thin", "Manageable", "Comfortable", "Very comfortable"],
    },
    {
      id: "equityUpside",
      type: "subjective",
      label: "How real is the equity's upside, honestly?",
      shortLabel: "Equity upside",
      scaleLabels: ["Mostly hope", "Uncertain", "Plausible", "Fairly likely", "Very real"],
    },
    {
      id: "roleExcitement",
      type: "subjective",
      label: "How excited are you about the role itself, equity aside?",
      shortLabel: "Role excitement",
      scaleLabels: ["Not excited", "Lukewarm", "Interested", "Excited", "Very excited"],
    },
  ],
};

export default decision;
