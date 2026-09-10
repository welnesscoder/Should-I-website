import type { QuickDecisionConfig } from "@/lib/engines/types";

const decision: QuickDecisionConfig = {
  id: "go-to-the-party",
  slug: "should-i-go-to-the-party-tonight",
  category: "fun",
  engine: "quick",
  title: "Should I go to the party tonight?",
  teaser: "Energy and dread, checked before you decide.",
  seo: {
    description: "Go or stay in? Three fast questions about energy, enjoyment, and regret.",
    keywords: ["should I go to the party", "party or stay home"],
  },
  questions: [
    { id: "willEnjoy", text: "Will you actually enjoy it once you're there?" },
    { id: "haveEnergy", text: "Do you have the energy for it?" },
    { id: "regretSkipping", text: "Will skipping it bother you tomorrow?" },
  ],
  verdictCopy: {
    YES: { headline: "Go.", explanation: "You'll enjoy it more than the couch will." },
    PROBABLY_YES: { headline: "Probably go.", explanation: "More reasons to go than to stay in tonight." },
    MAYBE: { headline: "Go for one hour.", explanation: "Show your face, keep your exit open." },
    PROBABLY_NO: {
      headline: "Probably stay in.",
      explanation: "This is sounding more like obligation than fun.",
    },
    NO: { headline: "Stay in.", explanation: "An obligation you're dreading isn't a fun decision." },
  },
};

export default decision;
