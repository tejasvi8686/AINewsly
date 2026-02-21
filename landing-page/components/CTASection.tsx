import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionWrapper from "./SectionWrapper";

const CTASection = () => {
  return (
    <SectionWrapper className="text-center">
      <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
        Cut Through the Noise.
      </h2>
      <p className="text-foreground/80 text-lg max-w-lg mx-auto mb-10">
        Join thousands of readers who start their day smarter. AI-powered summaries, delivered instantly.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="hero" size="lg" className="group">
          GET STARTED
          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="ghost-hero" size="lg">
          LEARN MORE
        </Button>
      </div>
    </SectionWrapper>
  );
};

export default CTASection;
