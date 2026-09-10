import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "buy-it-on-sale",
  slug: "should-i-buy-it-on-sale",
  category: "money",
  engine: "quick",
  title: "Should I buy it because it's on sale?",
  teaser: "A discount doesn't make it a plan.",
  seo: {
    description:
      "A discount changes the price, not whether you actually wanted the thing. Three quick questions to tell the difference.",
    keywords: ["should I buy it on sale", "sale purchase decision", "impulse buy sale"],
  },
  howItWorks:
    "Three quick questions check whether the sale revealed a plan you already had, or just made spending feel easier.",
  questions: [
    { id: "onListBefore", text: "Was it already on your list before the sale?" },
    { id: "fullPriceInMonth", text: "Would you pay full price for it in a month?" },
    { id: "knowHowYoullUseIt", text: "Do you know exactly where it'll go or how you'll use it?" },
  ],
  verdictCopy: {
    YES: {
      headline: "Get it.",
      explanation: "This isn't impulse — it's a plan that got lucky timing.",
    },
    PROBABLY_YES: {
      headline: "Go ahead.",
      explanation: "Most signs point to a real want, not just a good price tag.",
    },
    MAYBE: {
      headline: "Sleep on it.",
      explanation: "Give it 24 hours. If you still want it tomorrow at this price, it's a yes.",
    },
    PROBABLY_NO: {
      headline: "Probably skip it.",
      explanation: "This is leaning more toward 'good deal' than 'good idea.'",
    },
    NO: {
      headline: "Skip it.",
      explanation: "A discount on something you didn't want yet is still spending.",
    },
  },
};

export default decision;
