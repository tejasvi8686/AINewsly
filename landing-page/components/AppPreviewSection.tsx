import { Sparkles, Navigation, Bookmark } from "lucide-react";
import SectionWrapper from "./SectionWrapper";
import newspapersImg from "../public/images/newspapers.jpg";
import Image from "next/image";

const features = [
  { icon: <Sparkles className="w-6 h-6" />, title: "AI Powered", desc: "Smart summaries in seconds" },
  { icon: <Navigation className="w-6 h-6" />, title: "Swipe Navigation", desc: "Browse stories effortlessly" },
  { icon: <Bookmark className="w-6 h-6" />, title: "Save & Like", desc: "Curate your reading list" },
];

const AppPreviewSection = () => {
  return (
    <SectionWrapper id="preview" className="text-center">
      <p className="font-mono-label text-muted-foreground mb-4">APP PREVIEW</p>
      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-12">
        Your Daily Briefing
      </h2>

      {/* Phone mockup */}
      <div className="relative mx-auto max-w-sm mb-16">
        <div className="rounded-[2.5rem] border-2 border-border overflow-hidden bg-card shadow-2xl">
          {/* Status bar mock */}
          <div className="bg-background px-6 py-3 flex justify-between items-center">
            <span className="text-xs text-muted-foreground font-mono">3:24</span>
            <div className="w-24 h-6 rounded-full bg-foreground/10" />
            <div className="flex gap-1">
              <div className="w-4 h-3 rounded-sm bg-foreground/30" />
            </div>
          </div>
          {/* Article image */}
          <Image
            src={newspapersImg.src}
            width={100}
            height={100}
            alt="Stacked newspapers with AI and technology headlines"
            className="w-full h-48 object-cover"
          />
          {/* Article content */}
          <div className="p-5 text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono-label text-muted-foreground text-[11px] bg-card border border-border rounded-full px-3 py-1">
                techcrunch.com
              </span>
              <span className="text-xs text-muted-foreground">4 days ago · 1 min read</span>
            </div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-3">
              AI Sparks Interest in Computer Science
            </h3>
            <div className="border-l-2 border-accent pl-3 mb-3">
              <p className="font-mono-label text-accent text-[11px] mb-1">✦ AI Summary</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Students are increasingly drawn to artificial intelligence, manifesting in greater enrollment in AI-focused majors...
              </p>
            </div>
            <div className="border-l-2 border-accent-amber pl-3">
              <p className="font-mono-label text-accent-amber text-[11px] mb-1">💡 Why It Matters</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                This reflects the growing importance of AI across industries...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-card border border-border bg-card p-6 flex flex-col items-center gap-3 transition-transform duration-200 ease-out hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-foreground">{f.icon}</div>
            <h4 className="font-serif font-semibold text-foreground">{f.title}</h4>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default AppPreviewSection;
