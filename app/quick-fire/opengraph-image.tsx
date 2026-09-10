import { ImageResponse } from "next/og";
import { titleCardElement } from "@/lib/og/titleCard";
import { OG_SIZE } from "@/lib/og/theme";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    titleCardElement({
      eyebrow: "⚡ Quick Fire",
      title: "Pick one. Fast.",
      description: "No overthinking — just tap.",
    }),
    { ...size },
  );
}
