import { NextRequest, NextResponse } from "next/server";
import { getDecision } from "@/content/decisions";
import { VERDICT_LABEL } from "@/lib/engines/types";
import { recordDecisionRun } from "@/lib/supabase/queries";

/**
 * Analytics-only endpoint. Never accepts or logs raw financial inputs —
 * decisionId, score, verdict, and an anonymous session id only.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { decisionId, score, verdict, sessionId } = (body ?? {}) as {
    decisionId?: string;
    score?: number;
    verdict?: string;
    sessionId?: string;
  };

  if (!decisionId || !getDecision(decisionId)) {
    return NextResponse.json({ error: "Unknown decision" }, { status: 400 });
  }
  if (typeof score !== "number" || score < 0 || score > 100) {
    return NextResponse.json({ error: "Score must be 0-100" }, { status: 400 });
  }
  if (!verdict || !(verdict in VERDICT_LABEL)) {
    return NextResponse.json({ error: "Invalid verdict" }, { status: 400 });
  }

  await recordDecisionRun({
    decisionId,
    score: Math.round(score),
    verdict,
    sessionId: typeof sessionId === "string" ? sessionId.slice(0, 100) : undefined,
  });

  return NextResponse.json({ ok: true });
}
