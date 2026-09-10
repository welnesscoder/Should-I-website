import type { ReactElement } from "react";
import { OG_INK, OG_PAPER, OG_RULE, OG_SLATE } from "./theme";

interface TitleCardProps {
  eyebrow: string;
  title: string;
  description: string;
}

/** Shared branded title card for format index pages (no vote data to show yet). */
export function titleCardElement({ eyebrow, title, description }: TitleCardProps): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: OG_PAPER,
        padding: 80,
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: OG_INK }}>{eyebrow}</div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: OG_INK, lineHeight: 1.15 }}>{title}</div>
        <div style={{ display: "flex", fontSize: 32, color: OG_SLATE, marginTop: 24 }}>{description}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          fontWeight: 600,
          color: OG_SLATE,
          borderTop: `2px dashed ${OG_RULE}`,
          paddingTop: 24,
        }}
      >
        <div style={{ display: "flex" }}>SAYLESS</div>
        <div style={{ display: "flex" }}>sayless.app</div>
      </div>
    </div>
  );
}
