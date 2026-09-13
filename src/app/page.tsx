import PublicHeader from "@/components/public/PublicHeader";
import HeroSection from "@/components/public/HeroSection";
import FeaturesSection from "@/components/public/FeaturesSection";
import CoursesSection from "@/components/public/CoursesSection";
import AILearningSection from "@/components/public/AILearningSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import TeachersSection from "@/components/public/TeachersSection";
import StatsSection from "@/components/public/StatsSection";
import ContactSection from "@/components/public/ContactSection";
import PublicFooter from "@/components/public/PublicFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CoursesSection />
        <AILearningSection />
        <TeachersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
