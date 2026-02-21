import { Separator } from "@/components/ui/separator";
import { Twitter, Github, Linkedin } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="w-[90%] md:w-[85%] max-w-page mx-auto py-12">
      <Separator className="bg-border mb-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-serif-italic text-foreground/80 text-lg">AI</span>
          <span className="font-serif font-bold text-foreground text-lg tracking-tight">NEWSLY</span>
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors duration-200">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors duration-200">Contact</a>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        © 2026 AI Newsly. All rights reserved.
      </p>
    </footer>
  );
};

export default FooterSection;
