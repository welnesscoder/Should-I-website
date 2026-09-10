import { CheckCircle2, ChevronDown, ChevronUp, Minus, XCircle, type LucideIcon } from "lucide-react";
import type { Verdict } from "./engines/types";

export interface VerdictStyle {
  textClass: string;
  softBgClass: string;
  cssVar: string;
  Icon: LucideIcon;
}

export const VERDICT_STYLES: Record<Verdict, VerdictStyle> = {
  YES: { textClass: "text-yes", softBgClass: "bg-yes-soft", cssVar: "var(--color-yes)", Icon: CheckCircle2 },
  PROBABLY_YES: { textClass: "text-yes", softBgClass: "bg-yes-soft", cssVar: "var(--color-yes)", Icon: ChevronUp },
  MAYBE: { textClass: "text-tie", softBgClass: "bg-tie-soft", cssVar: "var(--color-tie)", Icon: Minus },
  PROBABLY_NO: { textClass: "text-no", softBgClass: "bg-no-soft", cssVar: "var(--color-no)", Icon: ChevronDown },
  NO: { textClass: "text-no", softBgClass: "bg-no-soft", cssVar: "var(--color-no)", Icon: XCircle },
};
