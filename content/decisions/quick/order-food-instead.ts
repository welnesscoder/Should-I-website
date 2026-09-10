import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "order-food-instead",
  slug: "should-i-order-food-instead-of-cooking",
  category: "quick",
  engine: "quick",
  title: "Should I order food instead of cooking?",
  teaser: "Time, cost, and what's actually in the fridge.",
  seo: {
    description: "Order in or cook? Three fast questions about time, food on hand, and cost.",
    keywords: ["should I order food", "order delivery or cook"],
  },
  questions: [
    { id: "dayTooFull", text: "Is your day genuinely too full to cook?" },
    {
      id: "foodAtHome",
      text: "Do you have food at home you'd actually eat?",
      agreeShiftsToward: "no",
    },
    {
      id: "moneyWouldBother",
      text: "Would the money bother you tomorrow?",
      agreeShiftsToward: "no",
    },
  ],
  verdictCopy: {
    YES: { headline: "Order it.", explanation: "Your time is worth it tonight." },
    PROBABLY_YES: { headline: "Order it if you want.", explanation: "Nothing here strongly argues against it." },
    MAYBE: {
      headline: "Cook the fastest thing you have.",
      explanation: "Skip delivery, skip a big production too.",
    },
    PROBABLY_NO: {
      headline: "Lean toward cooking.",
      explanation: "You've got the food and the time, mostly.",
    },
    NO: { headline: "Cook something simple.", explanation: "You've got the time and the food — use them." },
  },
};

export default decision;
