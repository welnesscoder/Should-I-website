import { NextRequest, NextResponse } from "next/server";
import { getDecision } from "@/content/decisions";
import { castVote, getVoteCounts } from "@/lib/supabase/queries";
import {
  FINGERPRINT_COOKIE,
  FINGERPRINT_COOKIE_OPTIONS,
  generateFingerprint,
  hashFingerprint,
} from "@/lib/voteFingerprint";

export async function GET(request: NextRequest) {
  const decisionId = request.nextUrl.searchParams.get("decisionId");
  if (!decisionId || !getDecision(decisionId)) {
    return NextResponse.json({ error: "Unknown decision" }, { status: 400 });
  }

  const counts = await getVoteCounts(decisionId);
  return NextResponse.json(counts);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { decisionId, choice } = (body ?? {}) as { decisionId?: string; choice?: string };

  if (!decisionId || !getDecision(decisionId)) {
    return NextResponse.json({ error: "Unknown decision" }, { status: 400 });
  }
  if (choice !== "yes" && choice !== "no") {
    return NextResponse.json({ error: "Choice must be 'yes' or 'no'" }, { status: 400 });
  }

  const existingFingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value;
  const rawFingerprint = existingFingerprint ?? generateFingerprint();
  const counts = await castVote(decisionId, choice, hashFingerprint(rawFingerprint));

  const response = NextResponse.json(counts);
  if (!existingFingerprint) {
    response.cookies.set(FINGERPRINT_COOKIE, rawFingerprint, FINGERPRINT_COOKIE_OPTIONS);
  }
  return response;
}
