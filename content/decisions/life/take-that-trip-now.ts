import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "take-that-trip-now",
  slug: "should-i-take-that-trip-now",
  category: "life",
  engine: "quick",
  title: "Should I take that trip now?",
  teaser: "Timing and money, checked in thirty seconds.",
  seo: {
    description:
      "Should you book the trip now or wait? Three honest questions about money, timing, and regret.",
    keywords: ["should I travel now", "book trip decision", "travel now or wait"],
  },
  questions: [
    { id: "canAfford", text: "Can you afford it without setting yourself back?" },
    { id: "goodWindow", text: "Is now genuinely a good window for work, family, and health?" },
    { id: "regretWaiting", text: "Will you regret waiting if you don't go?" },
  ],
  verdictCopy: {
    YES: { headline: "Book it.", explanation: "The window's open and you can afford to walk through it." },
    PROBABLY_YES: {
      headline: "Lean toward booking.",
      explanation: "Most of this points to now being a genuinely good time.",
    },
    MAYBE: {
      headline: "Check one more thing.",
      explanation: "You're close. Nail down the budget or the dates before deciding.",
    },
    PROBABLY_NO: {
      headline: "Probably wait.",
      explanation: "Something here — money or timing — isn't quite lined up yet.",
    },
    NO: {
      headline: "Wait on this one.",
      explanation: "The timing or the money isn't there yet — and that's fine.",
    },
  },
};

export default decision;
