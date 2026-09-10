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
  | "daily_question_vote"
  | "feed_item_viewed"
  | "feed_vote"
  | "next_item_viewed"
  | "cooked_completed"
  | "whos_wrong_vote"
  | "normal_vote"
  | "hype_vote"
  | "quick_fire_vote"
  | "share_card_generated"
  | "related_content_clicked";

interface SocialVotePayload {
  contentType: string;
  contentId: string;
  optionKey: string;
}

export interface AnalyticsEventPayloads {
  decision_started: { decisionId: string; category: string; engine: string };
  decision_completed: { decisionId: string; category: string; engine: string };
  verdict_generated: { decisionId: string; score: number; verdict: string };
  community_vote: { decisionId: string; choice: "yes" | "no" };
  result_shared: { decisionId: string; method: "web_share" | "copy_link" | "unknown" };
  related_decision_clicked: { fromDecisionId: string; toDecisionId: string };
  category_opened: { category: string };
  daily_question_vote: { dailyQuestionId: string; choice: "yes" | "no" };
  feed_item_viewed: { contentType: string; contentId: string };
  feed_vote: SocialVotePayload;
  next_item_viewed: { contentType: string; contentId: string };
  cooked_completed: SocialVotePayload;
  whos_wrong_vote: SocialVotePayload;
  normal_vote: SocialVotePayload;
  hype_vote: SocialVotePayload;
  quick_fire_vote: SocialVotePayload;
  share_card_generated: { contentType: string; contentId: string };
  related_content_clicked: { fromContentId: string; toContentId: string };
}

export function trackEvent<E extends AnalyticsEventName>(event: E, payload: AnalyticsEventPayloads[E]): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, payload);
  }
  // Wire a real analytics provider here (e.g. window.plausible, posthog, GA).
}
