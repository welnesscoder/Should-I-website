"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/events";

/**
 * Fires feed_item_viewed once when a card actually scrolls into view,
 * rather than when it's merely rendered off-screen further down the page.
 */
export default function FeedItemView({ contentType, contentId, children }: { contentType: string; contentId: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seen.current) {
          seen.current = true;
          trackEvent("feed_item_viewed", { contentType, contentId });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [contentType, contentId]);

  return <div ref={ref}>{children}</div>;
}
