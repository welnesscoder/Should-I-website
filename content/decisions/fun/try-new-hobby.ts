import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "try-new-hobby",
  slug: "should-i-try-this-new-hobby",
  category: "fun",
  engine: "quick",
  title: "Should I try this new hobby?",
  teaser: "Curiosity, cost, and time, checked together.",
  seo: {
    description: "New hobby, real curiosity, or just a shiny idea? Three fast questions.",
    keywords: ["should I try a new hobby", "new hobby decision"],
  },
  questions: [
    { id: "soundsFun", text: "Does it actually sound fun, not just impressive?" },
    { id: "tryCheaply", text: "Can you try it cheaply before committing to gear?" },
    { id: "weeklySlot", text: "Do you have a real slot of time for it weekly?" },
  ],
  verdictCopy: {
    YES: { headline: "Try it.", explanation: "Low cost, real curiosity, and a slot for it — that's a yes." },
    PROBABLY_YES: {
      headline: "Worth a shot.",
      explanation: "Most of the pieces you'd want are already in place.",
    },
    MAYBE: {
      headline: "Try the cheapest version first.",
      explanation: "A class or a rental, before you buy anything.",
    },
    PROBABLY_NO: {
      headline: "Hold off for now.",
      explanation: "Cost or time is more of a stretch than the curiosity is worth yet.",
    },
    NO: {
      headline: "Not right now.",
      explanation: "Wait until you have time for it, not just interest in it.",
    },
  },
};

export default decision;
