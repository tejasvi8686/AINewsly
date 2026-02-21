import { ArrowRight, Newspaper, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TickerStrip from "./TickerStrip";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Ticker background */}
      <TickerStrip />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Issue header */}
        <p className="font-mono-label text-muted-foreground mb-8 tracking-widest">
          ISSUE NO. 1 &nbsp;•&nbsp; 21/2/2026
        </p>

        {/* App icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-foreground flex items-center justify-center mb-6 shadow-lg">
          <div className="relative">
            <Newspaper className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground absolute -top-1 -right-2" />
          </div>
        </div>

        {/* AI */}
        <p className="font-serif-italic text-foreground/90 text-2xl md:text-3xl mb-1">AI</p>

        {/* NEWSLY */}
        <h1 className="font-serif font-bold text-[42px] md:text-[64px] leading-[1.05] tracking-tight text-foreground mb-6">
          NEWSLY
        </h1>

        {/* Separator */}
        <Separator className="w-12 bg-foreground/30 mb-6" />

        {/* Tagline */}
        <p className="font-mono-label text-foreground/80 tracking-[0.2em] text-sm mb-16">
          THE WORLD, SUMMARIZED.
        </p>

        {/* Value prop */}
        <p className="font-serif-italic text-muted-foreground text-base md:text-lg mb-6">
          Clarity in a noisy world.
        </p>

        {/* CTA */}
        <Button
          variant="hero"
          size="lg"
          className="group"
        >
          READ NOW
          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
