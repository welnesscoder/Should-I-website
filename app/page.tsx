import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import TrendingSection from "@/components/TrendingSection";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import ControversialSection from "@/components/ControversialSection";
import QuickFireRow from "@/components/QuickFireRow";

export default function Home() {
  return (
    <div>
      <Hero />
      <CategoryGrid />
      <TrendingSection />
      <QuestionOfTheDay />
      <ControversialSection />
      <QuickFireRow />
    </div>
  );
}
