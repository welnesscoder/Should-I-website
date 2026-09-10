import { ImageResponse } from "next/og";
import { titleCardElement } from "@/lib/og/titleCard";
import { OG_SIZE } from "@/lib/og/theme";

export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    titleCardElement({
      eyebrow: "🔥 Am I Cooked?",
      title: "How cooked are they, really?",
      description: "Read the situation, vote cooked or fine, see what the internet thinks.",
    }),
    { ...size },
  );
}
