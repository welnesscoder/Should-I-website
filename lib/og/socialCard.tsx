import type { ReactElement } from "react";
import { OG_INK, OG_PAPER, OG_RULE, OG_SLATE } from "./theme";

interface SocialCardProps {
  eyebrow: string;
  prompt: string;
  leadLabel: string;
  leadPct: number;
  trailingLine?: string;
}

/**
 * Shared "verdict stamp" OG card for every social format's permalink —
 * shows the live vote split so a shared link unfurls as an actual result,
 * not just a generic title card. Kept as a plain JSX-returning function
 * (not a component) since next/og's satori renderer needs a single element
 * tree per request, not a mounted React component.
 */
export function socialCardElement({ eyebrow, prompt, leadLabel, leadPct, trailingLine }: SocialCardProps): ReactElement {
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

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 600, color: OG_INK, lineHeight: 1.25, marginBottom: 36 }}>
          {prompt}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 700, color: OG_INK }}>{leadPct}%</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: OG_INK, letterSpacing: 1 }}>
            {leadLabel.toUpperCase()}
          </div>
        </div>
        {trailingLine && (
          <div style={{ display: "flex", fontSize: 28, color: OG_SLATE, marginTop: 20 }}>{trailingLine}</div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
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
