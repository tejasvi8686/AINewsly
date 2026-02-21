import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AppPreviewSection from "@/components/AppPreviewSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <HowItWorksSection />
      <AppPreviewSection />
      <FeaturesSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
