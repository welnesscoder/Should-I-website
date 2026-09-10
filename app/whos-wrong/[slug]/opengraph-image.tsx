import { ImageResponse } from "next/og";
import { getSocialItemBySlug } from "@/content/social";
import { getSocialVoteCounts } from "@/lib/supabase/queries";
import { getSocialLeadResult } from "@/lib/content/socialResult";
import { socialCardElement } from "@/lib/og/socialCard";
import { OG_SIZE } from "@/lib/og/theme";

export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getSocialItemBySlug("whos_wrong", slug);
  const counts = item ? await getSocialVoteCounts(item.type, item.id) : {};
  const lead = item ? getSocialLeadResult(item, counts) : { label: "", pct: 50, total: 0 };

  return new ImageResponse(
    socialCardElement({
      eyebrow: "⚖️ Who's Wrong?",
      prompt: item?.prompt ?? "SayLess",
      leadLabel: lead.label,
      leadPct: lead.pct,
      trailingLine: lead.total ? "The internet has spoken." : undefined,
    }),
    { ...size },
  );
}
