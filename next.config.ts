import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Should I? category/decision pages moved under /should-i to make room
      // for sibling SayLess sections (/cooked, /whos-wrong, etc.). The
      // category-name allowlist keeps this from swallowing new top-level
      // routes that happen to share a first path segment.
      {
        source: "/:category(money|life|career|fun|quick)",
        destination: "/should-i/:category",
        permanent: true,
      },
      {
        source: "/:category(money|life|career|fun|quick)/:slug",
        destination: "/should-i/:category/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
