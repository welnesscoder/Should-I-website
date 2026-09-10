import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "accept-the-promotion",
  slug: "should-i-accept-this-promotion",
  category: "career",
  engine: "quick",
  title: "Should I accept this promotion?",
  teaser: "Interest, capacity, and reward, checked fast.",
  seo: {
    description:
      "Not every promotion is worth taking right now. Three questions on interest, capacity, and reward.",
    keywords: ["should I accept a promotion", "take promotion decision"],
  },
  questions: [
    { id: "actuallyInterested", text: "Does the new role actually interest you, not just the title?" },
    { id: "canHandleLoad", text: "Can you take on the added responsibility right now?" },
    { id: "rewardMatches", text: "Does the pay or scope bump match the extra load?" },
  ],
  verdictCopy: {
    YES: { headline: "Take it.", explanation: "Interest, capacity, and reward are all lined up." },
    PROBABLY_YES: {
      headline: "Lean toward yes.",
      explanation: "Most of what matters here is pointing in the right direction.",
    },
    MAYBE: {
      headline: "Ask for specifics.",
      explanation: "Get clear on scope and pay before you answer either way.",
    },
    PROBABLY_NO: {
      headline: "Ask more before saying yes.",
      explanation: "Something about capacity or reward isn't quite adding up yet.",
    },
    NO: {
      headline: "Not yet.",
      explanation: "Say so honestly — a promotion you're not ready for helps no one.",
    },
  },
};

export default decision;
