const SESSION_KEY = "should-i:session";

/** A random, non-identifying id scoped to this browser tab session — used only to group analytics events, never stored with any personal data. */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "unknown";
  }
}
