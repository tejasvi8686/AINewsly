import { Sparkles, Lightbulb, ChevronDown } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const cards = [
  {
    icon: <Sparkles className="w-5 h-5 text-accent" />,
    label: "AI Summary",
    labelColor: "text-accent",
    borderColor: "border-l-accent",
    text: "Despite a decline in overall interest in computer science, students are increasingly drawn to artificial intelligence. This shift is manifesting in greater enrollment in AI-focused majors and courses.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-accent-amber" />,
    label: "Why It Matters",
    labelColor: "text-accent-amber",
    borderColor: "border-l-accent-amber",
    text: "This change reflects the growing importance of AI in various industries and signifies a potential need for curriculum adjustments to meet student demand.",
  },
  {
    icon: <ChevronDown className="w-5 h-5 text-muted-foreground" />,
    label: "Swipe for next",
    labelColor: "text-muted-foreground",
    borderColor: "border-l-muted-foreground",
    text: "",
    muted: true,
  },
];

const HowItWorksSection = () => {
  return (
    <SectionWrapper id="how-it-works">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
        {/* Left */}
        <div>
          <p className="font-mono-label text-muted-foreground mb-4">HOW IT WORKS</p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Instant Intelligence
          </h2>
          <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
            Every story distilled to its essence. Our AI reads thousands of sources in real-time, 
            delivering concise summaries that respect your time — so you stay informed without the noise.
          </p>
        </div>

        {/* Right — cards */}
        <div className="flex flex-col gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`rounded-card border border-border bg-card p-5 border-l-4 ${card.borderColor} transition-transform duration-200 ease-out hover:-translate-y-1`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                {card.icon}
                <span className={`font-mono-label ${card.labelColor}`}>{card.label}</span>
              </div>
              {card.text && (
                <p className={`text-sm leading-relaxed ${card.muted ? "text-muted-foreground" : "text-foreground/80"}`}>
                  {card.text}
                </p>
              )}
              {card.muted && (
                <p className="text-sm text-muted-foreground italic">More stories await...</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HowItWorksSection;
