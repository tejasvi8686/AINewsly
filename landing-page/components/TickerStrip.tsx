const TICKER_WORDS = [
    "AI ANALYSIS",
    "BREAKING",
    "TECH",
    "GLOBAL MARKETS",
    "AI ANALYSIS",
    "BREAKING",
    "POLITICS",
    "CLIMATE",
    "AI ANALYSIS",
    "HEALTH",
    "SCIENCE",
    "BREAKING",
  ];
  
  const TickerRow = ({ reverse = false }: { reverse?: boolean }) => {
    const text = TICKER_WORDS.map((w) => `• ${w} `).join("");
    return (
      <div className="whitespace-nowrap overflow-hidden">
        <div className={reverse ? "animate-ticker-reverse" : "animate-ticker"}>
          <span className="inline-block font-serif font-bold text-[5rem] md:text-[8rem] leading-none text-foreground/[0.12] select-none">
            {text}{text}
          </span>
        </div>
      </div>
    );
  };
  
  const TickerStrip = () => {
    return (
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ transform: "rotate(-10deg) scale(1.2)" }}
        aria-hidden="true"
      >
        <div className="flex flex-col justify-center h-full gap-2">
          <TickerRow />
          <TickerRow reverse />
          <TickerRow />
          <TickerRow reverse />
          <TickerRow />
        </div>
      </div>
    );
  };
  
  export default TickerStrip;
  