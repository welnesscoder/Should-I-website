import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "text-them-first",
  slug: "should-i-text-them-first",
  category: "quick",
  engine: "quick",
  title: "Should I text them first?",
  teaser: "Wanting to talk vs. managing anxiety.",
  seo: {
    description:
      "Should you text first, or wait? Three honest questions that tell the difference between wanting to connect and wanting reassurance.",
    keywords: ["should I text him first", "should I text her first", "should I text them first"],
  },
  howItWorks:
    "Three questions separate a genuine want to talk to someone from the urge to manage your own anxiety by getting a response.",
  faqs: [
    {
      question: "What if I get a 'maybe'?",
      answer:
        "Send something low-pressure and easy to ignore. It costs you nothing and doesn't read as anxious.",
    },
  ],
  questions: [
    { id: "wantToHear", text: "Do you actually want to hear from them, not just win the wait?" },
    { id: "okayWithNoResponse", text: "Would you be okay if they don't respond right away?" },
    { id: "enoughTimePassed", text: "Has enough time passed that reaching out won't read as anxious?" },
  ],
  verdictCopy: {
    YES: {
      headline: "Send it.",
      explanation:
        "You actually want to talk to them, you're okay with whatever happens next, and this doesn't sound like anxiety making the decision.",
    },
    PROBABLY_YES: {
      headline: "Go ahead and send it.",
      explanation: "Most of this is coming from wanting to connect, not from needing reassurance.",
    },
    MAYBE: {
      headline: "Send something low-pressure.",
      explanation: "A short, easy-to-ignore message costs you nothing.",
    },
    PROBABLY_NO: {
      headline: "Maybe don't, yet.",
      explanation:
        "This looks less like 'I want to talk to them' and more like 'I want reassurance immediately.'",
    },
    NO: {
      headline: "Give it a bit longer.",
      explanation: "Send it when it's not about managing your own anxiety.",
    },
  },
};

export default decision;
