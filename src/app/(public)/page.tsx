import HeroSection from "@/components/public/HeroSection";
import FeaturesSection from "@/components/public/FeaturesSection";
import AILearningSection from "@/components/public/AILearningSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import StatsSection from "@/components/public/StatsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AILearningSection />
      <TestimonialsSection />
    </>
  );
}
