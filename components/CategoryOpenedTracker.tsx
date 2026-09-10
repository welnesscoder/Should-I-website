"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/events";

/** Fires once per category page visit. A tiny client island so the page itself can stay a server component. */
export default function CategoryOpenedTracker({ category }: { category: string }) {
  useEffect(() => {
    trackEvent("category_opened", { category });
    // Only fires once per page visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return null;
}
