import { ImageResponse } from "next/og";
import { getDecisionBySlug } from "@/content/decisions";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#EDEFEA";
const INK = "#1B1D1F";
const SLATE = "#6B7280";
const RULE = "#C9CCC3";

export default async function Image({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const decision = getDecisionBySlug(category, slug);
  const title = decision?.title ?? "Should I?";
  const teaser = decision?.teaser ?? "A straight answer to your questionable decisions.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: INK }}>Should I?</div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: INK, lineHeight: 1.15 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 32, color: SLATE, marginTop: 24 }}>{teaser}</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: SLATE, borderTop: `2px dashed ${RULE}`, paddingTop: 24 }}>
          A clear 0–100 verdict, plus what everyone else decided.
        </div>
      </div>
    ),
    { ...size },
  );
}
