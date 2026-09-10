import type { SocialContentItem } from "@/lib/content/types";

export const WHOS_WRONG: SocialContentItem[] = [
  {
    id: "wrong-roommate-boyfriend-rent",
    slug: "roommates-boyfriend-stays-over",
    type: "whos_wrong",
    category: "roommates",
    prompt:
      "My roommate's boyfriend stays over five nights a week. I asked him to start contributing toward rent.",
    optionA: { key: "a", label: "Me" },
    optionB: { key: "b", label: "Roommate" },
    seo: { description: "Vote on who's wrong: asking a roommate's live-in boyfriend to pay rent." },
    featured: true,
  },
  {
    id: "wrong-wifi-password",
    slug: "changed-wifi-password-over-food",
    type: "whos_wrong",
    category: "roommates",
    prompt: "My roommate keeps eating my food, so I changed the Wi-Fi password until they stop.",
    optionA: { key: "a", label: "Me" },
    optionB: { key: "b", label: "Roommate" },
    seo: { description: "Vote on who's wrong: changing the Wi-Fi password to stop a roommate eating your food." },
    featured: true,
  },
  {
    id: "wrong-split-bill-drinks",
    slug: "split-bill-evenly-i-didnt-drink",
    type: "whos_wrong",
    category: "friends",
    prompt:
      "My friends want to split the bill evenly, but I didn't drink and ordered the cheapest thing on the menu.",
    optionA: { key: "a", label: "Me" },
    optionB: { key: "b", label: "Friends" },
    seo: { description: "Vote on who's wrong: splitting a bill evenly when one person barely ordered anything." },
  },
  {
    id: "wrong-family-group-chat",
    slug: "muted-family-group-chat",
    type: "whos_wrong",
    category: "family",
    prompt:
      "I muted the family group chat because of the constant forwarded messages. My mom found out and is hurt.",
    optionA: { key: "a", label: "Me" },
    optionB: { key: "b", label: "Mom" },
    seo: { description: "Vote on who's wrong: muting a family group chat full of forwards." },
  },
  {
    id: "wrong-coworker-credit",
    slug: "coworker-presented-my-idea",
    type: "whos_wrong",
    category: "work",
    prompt:
      "I mentioned an idea to a coworker over coffee. They presented it as their own in the team meeting the next day.",
    optionA: { key: "a", label: "Me" },
    optionB: { key: "b", label: "Coworker" },
    seo: { description: "Vote on who's wrong: a coworker presenting your casually-mentioned idea as their own." },
    featured: true,
  },
];
