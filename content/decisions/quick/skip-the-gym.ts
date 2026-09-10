import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "skip-the-gym",
  slug: "should-i-skip-the-gym-today",
  category: "quick",
  engine: "quick",
  title: "Should I skip the gym today?",
  teaser: "Real fatigue vs. low motivation.",
  seo: {
    description: "Rest day or just low motivation? Three fast questions before you decide.",
    keywords: ["should I skip the gym", "rest day or push through"],
  },
  questions: [
    { id: "realFatigue", text: "Is this fatigue, not just low motivation?" },
    { id: "trainedHardRecently", text: "Did you already train hard the last two days?" },
    {
      id: "lightVersionWouldHelp",
      text: "Would a lighter version, like a walk, still feel like something?",
      agreeShiftsToward: "no",
    },
  ],
  verdictCopy: {
    YES: { headline: "Take the day.", explanation: "Rest is part of the plan, not a break from it." },
    PROBABLY_YES: { headline: "Lean toward resting.", explanation: "Most signs point to your body needing the day." },
    MAYBE: {
      headline: "Do the light version.",
      explanation: "Show up, keep it easy, decide the rest once you're there.",
    },
    PROBABLY_NO: {
      headline: "Probably still go.",
      explanation: "This is sounding more like motivation than actual fatigue.",
    },
    NO: { headline: "Go, even a short one.", explanation: "This is motivation talking, not your body." },
  },
};

export default decision;
