import "server-only";
import crypto from "node:crypto";

export const FINGERPRINT_COOKIE = "si_fp";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Hashes an anonymous per-browser cookie value before it's stored, so the
 * database never holds a directly reusable identifier. This is intentionally
 * soft dedup (cookie + DB unique constraint) — not real anti-fraud.
 */
export function hashFingerprint(rawValue: string): string {
  const salt = process.env.VOTE_FINGERPRINT_SALT ?? "should-i-dev-salt";
  return crypto.createHash("sha256").update(`${salt}:${rawValue}`).digest("hex");
}

export function generateFingerprint(): string {
  return crypto.randomUUID();
}

export const FINGERPRINT_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: COOKIE_MAX_AGE_SECONDS,
  path: "/",
};
