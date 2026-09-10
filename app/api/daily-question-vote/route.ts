import { NextRequest, NextResponse } from "next/server";
import { castDailyQuestionVote, getDailyQuestionVoteCounts } from "@/lib/supabase/queries";
import {
  FINGERPRINT_COOKIE,
  FINGERPRINT_COOKIE_OPTIONS,
  generateFingerprint,
  hashFingerprint,
} from "@/lib/voteFingerprint";

export async function GET(request: NextRequest) {
  const dailyQuestionId = request.nextUrl.searchParams.get("dailyQuestionId");
  if (!dailyQuestionId) {
    return NextResponse.json({ error: "Missing dailyQuestionId" }, { status: 400 });
  }

  const counts = await getDailyQuestionVoteCounts(dailyQuestionId);
  return NextResponse.json(counts);
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { dailyQuestionId, choice } = (body ?? {}) as { dailyQuestionId?: string; choice?: string };

  if (!dailyQuestionId) {
    return NextResponse.json({ error: "Missing dailyQuestionId" }, { status: 400 });
  }
  if (choice !== "yes" && choice !== "no") {
    return NextResponse.json({ error: "Choice must be 'yes' or 'no'" }, { status: 400 });
  }

  const existingFingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value;
  const rawFingerprint = existingFingerprint ?? generateFingerprint();
  const counts = await castDailyQuestionVote(dailyQuestionId, choice, hashFingerprint(rawFingerprint));

  const response = NextResponse.json(counts);
  if (!existingFingerprint) {
    response.cookies.set(FINGERPRINT_COOKIE, rawFingerprint, FINGERPRINT_COOKIE_OPTIONS);
  }
  return response;
}
