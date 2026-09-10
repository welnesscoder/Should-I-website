import { NextRequest, NextResponse } from "next/server";
import { getSocialItem } from "@/content/social";
import { SOCIAL_TYPE_PATH, type SocialContentType } from "@/lib/content/types";
import { castSocialVote, getSocialVoteCounts } from "@/lib/supabase/queries";
import {
  FINGERPRINT_COOKIE,
  FINGERPRINT_COOKIE_OPTIONS,
  generateFingerprint,
  hashFingerprint,
} from "@/lib/voteFingerprint";

function isSocialContentType(value: unknown): value is SocialContentType {
  return typeof value === "string" && value in SOCIAL_TYPE_PATH;
}

export async function GET(request: NextRequest) {
  const contentType = request.nextUrl.searchParams.get("type");
  const contentId = request.nextUrl.searchParams.get("id");

  if (!isSocialContentType(contentType) || !contentId) {
    return NextResponse.json({ error: "Unknown content" }, { status: 400 });
  }
  const item = getSocialItem(contentId);
  if (!item || item.type !== contentType) {
    return NextResponse.json({ error: "Unknown content" }, { status: 400 });
  }

  const counts = await getSocialVoteCounts(contentType, contentId);
  return NextResponse.json({ counts });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { type: contentType, id: contentId, optionKey } = (body ?? {}) as {
    type?: string;
    id?: string;
    optionKey?: string;
  };

  if (!isSocialContentType(contentType) || !contentId || !optionKey) {
    return NextResponse.json({ error: "Unknown content" }, { status: 400 });
  }
  const item = getSocialItem(contentId);
  if (!item || item.type !== contentType) {
    return NextResponse.json({ error: "Unknown content" }, { status: 400 });
  }
  if (optionKey !== item.optionA.key && optionKey !== item.optionB.key) {
    return NextResponse.json({ error: "Invalid option" }, { status: 400 });
  }

  const existingFingerprint = request.cookies.get(FINGERPRINT_COOKIE)?.value;
  const rawFingerprint = existingFingerprint ?? generateFingerprint();
  const counts = await castSocialVote(contentType, contentId, optionKey, hashFingerprint(rawFingerprint));

  const response = NextResponse.json({ counts });
  if (!existingFingerprint) {
    response.cookies.set(FINGERPRINT_COOKIE, rawFingerprint, FINGERPRINT_COOKIE_OPTIONS);
  }
  return response;
}
