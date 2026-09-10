import type { SocialContentItem } from "./types";
import type { SocialVoteCounts } from "@/lib/supabase/queries";

export interface SocialLeadResult {
  label: string;
  pct: number;
  total: number;
}

/** Which option is currently ahead, and by how much — used by share/OG cards. */
export function getSocialLeadResult(item: SocialContentItem, counts: SocialVoteCounts): SocialLeadResult {
  const aCount = counts[item.optionA.key] ?? 0;
  const bCount = counts[item.optionB.key] ?? 0;
  const total = aCount + bCount;
  const aPct = total ? Math.round((aCount / total) * 100) : 50;
  const leadIsA = aPct >= 50;
  return {
    label: leadIsA ? item.optionA.label : item.optionB.label,
    pct: total ? (leadIsA ? aPct : 100 - aPct) : 50,
    total,
  };
}
