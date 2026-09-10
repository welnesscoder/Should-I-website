import "server-only";
import { getSupabaseServerClient } from "./server";

export interface VoteCounts {
  yes: number;
  no: number;
}

const EMPTY_COUNTS: VoteCounts = { yes: 0, no: 0 };

export async function getVoteCounts(decisionId: string): Promise<VoteCounts> {
  const client = getSupabaseServerClient();
  if (!client) return EMPTY_COUNTS;

  const { data, error } = await client.from("votes").select("choice").eq("decision_id", decisionId);
  if (error || !data) return EMPTY_COUNTS;

  return data.reduce<VoteCounts>(
    (acc, row) => {
      if (row.choice === "yes") acc.yes += 1;
      else if (row.choice === "no") acc.no += 1;
      return acc;
    },
    { yes: 0, no: 0 },
  );
}

export async function castVote(
  decisionId: string,
  choice: "yes" | "no",
  fingerprint: string,
): Promise<VoteCounts> {
  const client = getSupabaseServerClient();
  if (!client) return EMPTY_COUNTS;

  const { data, error } = await client.rpc("cast_vote", {
    p_decision_id: decisionId,
    p_choice: choice,
    p_fingerprint: fingerprint,
  });
  if (error || !data || !data[0]) return getVoteCounts(decisionId);

  return { yes: Number(data[0].yes_count) || 0, no: Number(data[0].no_count) || 0 };
}

export interface TrendingEntry {
  decisionId: string;
  voteCount: number;
}

/** Trending = vote activity in the last 48 hours, grouped by decision. */
export async function getTrending(limit = 6): Promise<TrendingEntry[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client.from("votes").select("decision_id").gte("created_at", since);
  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    counts.set(row.decision_id, (counts.get(row.decision_id) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([decisionId, voteCount]) => ({ decisionId, voteCount }))
    .sort((a, b) => b.voteCount - a.voteCount)
    .slice(0, limit);
}

export interface ControversialEntry {
  decisionId: string;
  yesPct: number;
  totalVotes: number;
}

/** Decisions where the community is closest to a 50/50 split, above a minimum sample size. */
export async function getMostControversial(limit = 3, minVotes = 20): Promise<ControversialEntry[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const { data, error } = await client.from("votes").select("decision_id, choice");
  if (error || !data) return [];

  const byDecision = new Map<string, VoteCounts>();
  for (const row of data) {
    const counts = byDecision.get(row.decision_id) ?? { yes: 0, no: 0 };
    if (row.choice === "yes") counts.yes += 1;
    else counts.no += 1;
    byDecision.set(row.decision_id, counts);
  }

  return [...byDecision.entries()]
    .map(([decisionId, counts]) => {
      const totalVotes = counts.yes + counts.no;
      const yesPct = totalVotes ? (counts.yes / totalVotes) * 100 : 50;
      return { decisionId, yesPct, totalVotes };
    })
    .filter((entry) => entry.totalVotes >= minVotes)
    .sort((a, b) => Math.abs(a.yesPct - 50) - Math.abs(b.yesPct - 50))
    .slice(0, limit);
}

export interface DailyQuestion {
  id: string;
  questionText: string;
  date: string;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getDailyQuestion(date: Date = new Date()): Promise<DailyQuestion | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("daily_questions")
    .select("id, question_text, date")
    .eq("date", isoDate(date))
    .maybeSingle();
  if (error || !data) return null;

  return { id: data.id, questionText: data.question_text, date: data.date };
}

export async function getPreviousDailyQuestion(): Promise<DailyQuestion | null> {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDailyQuestion(yesterday);
}

/** Past questions, most recent first, for the /question-of-the-day archive. */
export async function getDailyQuestionHistory(limit = 30): Promise<DailyQuestion[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("daily_questions")
    .select("id, question_text, date")
    .lte("date", isoDate(new Date()))
    .order("date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  return data.map((row) => ({ id: row.id, questionText: row.question_text, date: row.date }));
}

export async function getDailyQuestionVoteCounts(dailyQuestionId: string): Promise<VoteCounts> {
  const client = getSupabaseServerClient();
  if (!client) return EMPTY_COUNTS;

  const { data, error } = await client
    .from("daily_question_votes")
    .select("choice")
    .eq("daily_question_id", dailyQuestionId);
  if (error || !data) return EMPTY_COUNTS;

  return data.reduce<VoteCounts>(
    (acc, row) => {
      if (row.choice === "yes") acc.yes += 1;
      else if (row.choice === "no") acc.no += 1;
      return acc;
    },
    { yes: 0, no: 0 },
  );
}

export async function castDailyQuestionVote(
  dailyQuestionId: string,
  choice: "yes" | "no",
  fingerprint: string,
): Promise<VoteCounts> {
  const client = getSupabaseServerClient();
  if (!client) return EMPTY_COUNTS;

  const { data, error } = await client.rpc("cast_daily_question_vote", {
    p_daily_question_id: dailyQuestionId,
    p_choice: choice,
    p_fingerprint: fingerprint,
  });
  if (error || !data || !data[0]) return getDailyQuestionVoteCounts(dailyQuestionId);

  return { yes: Number(data[0].yes_count) || 0, no: Number(data[0].no_count) || 0 };
}

/** Analytics only — never pass raw financial inputs here. */
export async function recordDecisionRun(params: {
  decisionId: string;
  sessionId?: string;
  score: number;
  verdict: string;
}): Promise<void> {
  const client = getSupabaseServerClient();
  if (!client) return;

  await client.from("decision_runs").insert({
    decision_id: params.decisionId,
    session_id: params.sessionId,
    score: params.score,
    verdict: params.verdict,
  });
}
