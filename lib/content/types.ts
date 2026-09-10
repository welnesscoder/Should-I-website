/**
 * Shared shape for every SayLess "social" content format (Cooked, Who's
 * Wrong, Is This Normal, Worth the Hype, Quick Fire). All five are
 * structurally identical — a prompt plus a binary vote — so they share one
 * type instead of five near-duplicate ones. Should I? keeps its own
 * DecisionConfig/DecisionResult contract in lib/engines/types.ts; that is
 * intentionally not merged with this.
 */

export type SocialContentType = "cooked" | "whos_wrong" | "normal" | "hype" | "quick_fire";

export interface SocialOption {
  key: string; // e.g. "cooked" | "fine", "a" | "b", "yes" | "not_me", "worth_it" | "overrated"
  label: string;
}

export interface SocialContentItem {
  id: string; // stable id, used as content_id in votes — never reused across items
  slug: string;
  type: SocialContentType;
  category: string;
  /** The situation/dilemma/question shown to the reader. Quick Fire can leave this "" — the two options say it all. */
  prompt: string;
  optionA: SocialOption;
  optionB: SocialOption;
  /** Witty microcopy shown after voting, independent of which way the vote landed, e.g. "Apparently we're all doing this." */
  resultLine?: string;
  seo?: { description: string };
  featured?: boolean;
}

export const SOCIAL_TYPE_PATH: Record<SocialContentType, string> = {
  cooked: "cooked",
  whos_wrong: "whos-wrong",
  normal: "is-this-normal",
  hype: "worth-the-hype",
  quick_fire: "quick-fire",
};

export const SOCIAL_TYPE_LABEL: Record<SocialContentType, string> = {
  cooked: "Am I Cooked?",
  whos_wrong: "Who's Wrong?",
  normal: "Is This Normal?",
  hype: "Worth the Hype?",
  quick_fire: "Quick Fire",
};

/** Short verb phrase for feed/nav microcopy, e.g. "vote cooked or fine." */
export const SOCIAL_TYPE_VOTE_VERB: Record<SocialContentType, string> = {
  cooked: "How cooked are they?",
  whos_wrong: "Who's wrong here?",
  normal: "Is this normal?",
  hype: "Worth the hype?",
  quick_fire: "Pick one.",
};

/**
 * One signature accent color per format (see app/globals.css). Tailwind
 * needs full literal class names to find at build time, so this maps
 * straight to class strings rather than a color key a component would
 * interpolate — `text-${accent}` would silently not exist in the CSS.
 */
export interface SocialAccentClasses {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  /** Pre-composed so the full "hover:bg-x" string is visible to Tailwind's static scanner — see note above. */
  hoverBg: string;
}

export const SOCIAL_TYPE_ACCENT: Record<SocialContentType, SocialAccentClasses> = {
  cooked: {
    text: "text-cooked",
    bg: "bg-cooked",
    bgSoft: "bg-cooked-soft",
    border: "border-cooked",
    hoverBg: "hover:bg-cooked",
  },
  whos_wrong: {
    text: "text-wrong",
    bg: "bg-wrong",
    bgSoft: "bg-wrong-soft",
    border: "border-wrong",
    hoverBg: "hover:bg-wrong",
  },
  normal: {
    text: "text-normal",
    bg: "bg-normal",
    bgSoft: "bg-normal-soft",
    border: "border-normal",
    hoverBg: "hover:bg-normal",
  },
  hype: {
    text: "text-hype",
    bg: "bg-hype",
    bgSoft: "bg-hype-soft",
    border: "border-hype",
    hoverBg: "hover:bg-hype",
  },
  quick_fire: {
    text: "text-quickfire",
    bg: "bg-quickfire",
    bgSoft: "bg-quickfire-soft",
    border: "border-quickfire",
    hoverBg: "hover:bg-quickfire",
  },
};
