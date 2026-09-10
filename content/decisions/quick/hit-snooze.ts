import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "hit-snooze",
  slug: "should-i-hit-snooze",
  category: "quick",
  engine: "quick",
  title: "Should I hit snooze?",
  teaser: "Sleep debt vs. schedule slack.",
  seo: {
    description: "Nine more minutes or up now? Three fast questions about sleep and slack.",
    keywords: ["should I hit snooze", "snooze alarm decision"],
  },
  questions: [
    { id: "closeToFullNight", text: "Did you get close to a full night's sleep?" },
    { id: "scheduleSlack", text: "Do you have slack in your morning schedule?" },
    {
      id: "willActuallyHelp",
      text: "Will nine more minutes actually help, or just delay the same tiredness?",
    },
  ],
  verdictCopy: {
    YES: { headline: "Nine more minutes.", explanation: "You've got the room for it." },
    PROBABLY_YES: { headline: "Go ahead, once.", explanation: "One snooze looks low-risk here." },
    MAYBE: {
      headline: "One snooze, no more.",
      explanation: "Set the line before your thumb finds the button.",
    },
    PROBABLY_NO: {
      headline: "Better to get up.",
      explanation: "Snoozing is more likely to cost you than help right now.",
    },
    NO: { headline: "Up now.", explanation: "Snoozing won't fix this kind of tired — moving will." },
  },
};

export default decision;
