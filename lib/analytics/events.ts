/**
 * Analytics event sink. No PII, no raw financial inputs — only ids, engine
 * types, scores, and verdicts. Wired to console in development; swap the
 * body of `trackEvent` for a real analytics provider when one is chosen.
 */

export type AnalyticsEventName =
  | "decision_started"
  | "decision_completed"
  | "verdict_generated"
  | "community_vote"
  | "result_shared"
  | "related_decision_clicked"
  | "category_opened"
  | "daily_question_vote";

export interface AnalyticsEventPayloads {
  decision_started: { decisionId: string; category: string; engine: string };
  decision_completed: { decisionId: string; category: string; engine: string };
  verdict_generated: { decisionId: string; score: number; verdict: string };
  community_vote: { decisionId: string; choice: "yes" | "no" };
  result_shared: { decisionId: string; method: "web_share" | "copy_link" | "unknown" };
  related_decision_clicked: { fromDecisionId: string; toDecisionId: string };
  category_opened: { category: string };
  daily_question_vote: { dailyQuestionId: string; choice: "yes" | "no" };
}

export function trackEvent<E extends AnalyticsEventName>(event: E, payload: AnalyticsEventPayloads[E]): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, payload);
  }
  // Wire a real analytics provider here (e.g. window.plausible, posthog, GA).
}
