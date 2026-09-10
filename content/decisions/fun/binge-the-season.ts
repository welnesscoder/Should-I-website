import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "binge-the-season",
  slug: "should-i-binge-the-whole-season-tonight",
  category: "fun",
  engine: "quick",
  title: "Should I binge the whole season tonight?",
  teaser: "Tomorrow's plans, checked before tonight's plans.",
  seo: {
    description: "Press play or call it after one episode? Three quick questions first.",
    keywords: ["should I binge watch", "watch whole season tonight"],
  },
  questions: [
    { id: "lightTomorrow", text: "Is tomorrow a genuinely light day?" },
    { id: "setUpToEnjoy", text: "Are you set up to actually enjoy it right now?" },
    {
      id: "stoppingWouldBother",
      text: "Would stopping partway through actually bother you?",
    },
  ],
  verdictCopy: {
    YES: { headline: "Press play.", explanation: "Nothing tomorrow needs protecting tonight." },
    PROBABLY_YES: { headline: "Go for it.", explanation: "Most of tonight is genuinely free for this." },
    MAYBE: {
      headline: "Set an episode limit now.",
      explanation: "Decide the cutoff before you start, not during.",
    },
    PROBABLY_NO: {
      headline: "Watch one and reassess.",
      explanation: "Tomorrow's asking for a little more caution than tonight is offering.",
    },
    NO: { headline: "Watch two and stop.", explanation: "Future-you has plans that need you rested." },
  },
};

export default decision;
