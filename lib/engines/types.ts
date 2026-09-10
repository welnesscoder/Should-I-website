import type { CategoryId } from "@/content/categories";

/** ---------- Shared result contract (never invent a per-decision result type) ---------- */

export type Verdict = "YES" | "PROBABLY_YES" | "MAYBE" | "PROBABLY_NO" | "NO";

export interface ResultFactor {
  label: string;
  score: number; // 0-100
  weight?: "low" | "medium" | "high";
}

export interface Insight {
  label: string;
  value: string;
}

export interface DecisionResult {
  score: number; // integer 0-100
  verdict: Verdict;
  headline: string;
  explanation: string;
  breakdown: ResultFactor[];
  biggestReasonYes?: string;
  biggestReasonHesitate?: string;
  insights?: Insight[];
  warnings?: string[];
}

export const VERDICT_LABEL: Record<Verdict, string> = {
  YES: "Yes",
  PROBABLY_YES: "Probably yes",
  MAYBE: "Maybe",
  PROBABLY_NO: "Probably no",
  NO: "No",
};

/** ---------- Decision metadata shared by every engine ---------- */

export type RiskLevel = "standard" | "sensitive";
export type EngineType = "quick" | "weighted" | "calculated";

export interface Seo {
  description: string;
  keywords?: string[];
}

export interface DecisionMeta {
  id: string;
  slug: string;
  category: CategoryId;
  title: string;
  teaser: string;
  engine: EngineType;
  riskLevel?: RiskLevel;
  seo: Seo;
  relatedIds?: string[];
  howItWorks?: string;
  faqs?: { question: string; answer: string }[];
}

/** ---------- Quick engine ---------- */

export interface QuickQuestion {
  id: string;
  text: string;
  /** Which answer ("yes" or "no") shifts the score toward the affirmative/headline action. Defaults to "yes". */
  agreeShiftsToward?: "yes" | "no";
}

export interface QuickVerdictCopy {
  headline: string;
  explanation: string;
}

export interface QuickDecisionConfig extends DecisionMeta {
  engine: "quick";
  questions: QuickQuestion[];
  verdictCopy: Record<Verdict, QuickVerdictCopy>;
}

export type QuickAnswers = Record<string, "yes" | "no">;

/** ---------- Weighted engine ---------- */

export type ImportanceLevel = "low" | "medium" | "high";

export const IMPORTANCE_MULTIPLIER: Record<ImportanceLevel, number> = {
  low: 0.5,
  medium: 1,
  high: 1.5,
};

export const COMPARISON_LABELS: [string, string, string, string, string] = [
  "Much worse",
  "Worse",
  "About the same",
  "Better",
  "Much better",
];

interface WeightedFactorBase {
  id: string;
  /** The question asked to the user, e.g. "How does the pay compare to what you have now?" */
  label: string;
  /** Short label for breakdown/insight display, e.g. "Compensation" */
  shortLabel: string;
  /** 5-point scale labels for -2..2, defaults to Much worse..Much better */
  scaleLabels?: [string, string, string, string, string];
  allowImportance?: boolean; // defaults true
}

export interface WeightedSubjectiveFactor extends WeightedFactorBase {
  type: "subjective";
}

export interface ComputedFactorInputField {
  id: string;
  label: string;
  unit?: string;
  default: number;
  step?: number;
  min?: number;
}

export interface WeightedComputedFactor extends WeightedFactorBase {
  type: "computed";
  inputs: ComputedFactorInputField[];
  /** Returns a value on the same -2..2 scale as the subjective factors. */
  compute: (values: Record<string, number>) => number;
  /** Optional human-readable insight derived from the same inputs. */
  insight?: (values: Record<string, number>) => Insight | undefined;
}

export type WeightedFactor = WeightedSubjectiveFactor | WeightedComputedFactor;

export interface WeightedDecisionConfig extends DecisionMeta {
  engine: "weighted";
  factors: WeightedFactor[];
  /** Optional per-verdict headline override; a sensible default is generated otherwise. */
  verdictHeadlines?: Partial<Record<Verdict, string>>;
}

export interface WeightedFactorAnswer {
  value: number; // -2..2
  importance: ImportanceLevel;
}

export type WeightedAnswers = Record<string, WeightedFactorAnswer>;
export type WeightedComputedInputs = Record<string, Record<string, number>>;

/** ---------- Calculated engine ---------- */

export type CalculatedFieldType =
  | "currency"
  | "number"
  | "percent"
  | "months"
  | "years"
  | "boolean"
  | "select";

export interface CalculatedInputField {
  id: string;
  label: string;
  type: CalculatedFieldType;
  helpText?: string;
  default: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  optional?: boolean;
}

export type CalculatedValues = Record<string, number | boolean | string>;

export interface CalculatedDecisionConfig extends DecisionMeta {
  engine: "calculated";
  inputFields: CalculatedInputField[];
  compute: (values: CalculatedValues) => DecisionResult;
}

export type DecisionConfig = QuickDecisionConfig | WeightedDecisionConfig | CalculatedDecisionConfig;
