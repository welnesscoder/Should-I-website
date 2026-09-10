import Hero from "@/components/Hero";
import TrendingSection from "@/components/TrendingSection";
import FeedPreview from "@/components/home/FeedPreview";
import SocialPreviewSection from "@/components/home/SocialPreviewSection";
import QuickFirePreview from "@/components/home/QuickFirePreview";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import ControversialSection from "@/components/ControversialSection";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sayless.app";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrendingSection />
      <FeedPreview siteUrl={SITE_URL} />
      <SocialPreviewSection
        type="cooked"
        eyebrow="🔥 Am I Cooked?"
        title="How cooked are they, really?"
        viewAllHref="/cooked"
        siteUrl={SITE_URL}
      />
      <SocialPreviewSection
        type="whos_wrong"
        eyebrow="⚖️ Who's Wrong?"
        title="You be the judge."
        viewAllHref="/whos-wrong"
        siteUrl={SITE_URL}
      />
      <SocialPreviewSection
        type="normal"
        eyebrow="👀 Is This Normal?"
        title="You're probably not the only one."
        viewAllHref="/is-this-normal"
        siteUrl={SITE_URL}
      />
      <SocialPreviewSection
        type="hype"
        eyebrow="✨ Worth the Hype?"
        title="Is it actually worth it?"
        viewAllHref="/worth-the-hype"
        siteUrl={SITE_URL}
        limit={1}
      />
      <QuickFirePreview siteUrl={SITE_URL} />
      <QuestionOfTheDay />
      <ControversialSection />
    </div>
  );
}
