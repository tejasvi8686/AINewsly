import { Zap, Heart, Bookmark, Newspaper, Sparkles, Settings } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const features = [
  {
    icon: <Zap className="w-7 h-7" />,
    title: "Lightning Summaries",
    desc: "Get the essence of any story in under 10 seconds. Our AI distills complex articles into clear, actionable insights.",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "Smart Curation",
    desc: "AI learns your interests over time, surfacing the stories that matter most to you from thousands of sources.",
  },
  {
    icon: <Newspaper className="w-7 h-7" />,
    title: "Global Coverage",
    desc: "From tech and politics to climate and markets — comprehensive coverage across every topic that shapes our world.",
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: "Like & Discover",
    desc: "Like stories to refine your feed. The more you engage, the smarter your experience becomes.",
  },
  {
    icon: <Bookmark className="w-7 h-7" />,
    title: "Save for Later",
    desc: "Bookmark articles to build your personal library. Access saved stories anytime, even offline.",
  },
  {
    icon: <Settings className="w-7 h-7" />,
    title: "Your Preferences",
    desc: "Full control over notifications, categories, and reading experience. Tailored entirely to you.",
  },
];

const FeaturesSection = () => {
  return (
    <SectionWrapper id="features">
      <div className="text-center mb-16">
        <p className="font-mono-label text-muted-foreground mb-4">FEATURES</p>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">
          Everything You Need
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-card p-8 transition-transform duration-200 ease-out hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-foreground mb-4">{f.icon}</div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default FeaturesSection;
