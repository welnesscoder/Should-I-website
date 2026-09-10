import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "say-yes-to-invite",
  slug: "should-i-say-yes-to-this-invite",
  category: "quick",
  engine: "quick",
  title: "Should I say yes to this invite?",
  teaser: "Want, afford, and regret, in three taps.",
  seo: {
    description: "Say yes or say no? Three fast questions about want, cost, and future regret.",
    keywords: ["should I say yes to invite", "accept invitation decision"],
  },
  questions: [
    { id: "actuallyWantToGo", text: "Do you actually want to go, apart from guilt?" },
    { id: "canAffordIt", text: "Can you afford the time and money it costs?" },
    {
      id: "willResent",
      text: "Will you resent saying yes by the time it arrives?",
      agreeShiftsToward: "no",
    },
  ],
  verdictCopy: {
    YES: { headline: "Say yes.", explanation: "Want it, can afford it, won't resent it — easy yes." },
    PROBABLY_YES: { headline: "Lean toward yes.", explanation: "Most of this points toward a good yes." },
    MAYBE: {
      headline: "Ask for details first.",
      explanation: "Get the when, where, and cost before you decide.",
    },
    PROBABLY_NO: {
      headline: "Lean toward no.",
      explanation: "This has more guilt or cost in it than actual want.",
    },
    NO: { headline: "Say no.", explanation: "A no now is kinder than a resentful yes later." },
  },
};

export default decision;
