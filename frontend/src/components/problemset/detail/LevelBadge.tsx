interface LevelBadgeProps {
  platform: string;
  difficulty: string;
}

export default function LevelBadge({ platform, difficulty }: LevelBadgeProps) {
  const getEffectiveLevel = (
    plat: string,
    diff: string,
  ): "EASY" | "MEDIUM" | "HARD" => {
    const p = plat.toUpperCase();
    const d = diff.toUpperCase();

    if (p === "PROGRAMMERS") {
      if (d.includes("LEVEL_0") || d.includes("LEVEL_1")) return "EASY";
      if (d.includes("LEVEL_2") || d.includes("LEVEL_3")) return "MEDIUM";
      return "HARD"; // Level 4, 5+
    } else if (p === "BOJ") {
      if (d.includes("BRONZE") || d.includes("SILVER") || d.includes("UNRATED"))
        return "EASY";
      if (d.includes("GOLD") || d.includes("PLATINUM")) return "MEDIUM";
      return "HARD"; // Diamond, Ruby+
    } else if (p === "SWEA") {
      if (["D1", "D2", "D3"].some((val) => d.includes(val))) return "EASY";
      if (["D4", "D5", "D6"].some((val) => d.includes(val))) return "MEDIUM";
      return "HARD"; // D7, D8+
    }

    return "EASY";
  };

  const getBadgeStyle = (effectiveLevel: string) => {
    switch (effectiveLevel) {
      case "MEDIUM": // Orange/Yellow
        return {
          bg: "bg-amber-50",
          border: "border border-amber-200",
          text: "text-amber-700",
          divider: "bg-amber-300",
          minWidth: "min-w-[68px]",
        };
      case "HARD": // Red
        return {
          bg: "bg-red-50",
          border: "border border-red-200",
          text: "text-red-700",
          divider: "bg-red-300",
          minWidth: "min-w-[68px]",
        };
      default: // EASY - Green
        return {
          bg: "bg-emerald-50",
          border: "border border-emerald-200",
          text: "text-emerald-700",
          divider: "bg-emerald-300",
          minWidth: "min-w-[68px]",
        };
    }
  };

  // Helper to shorten platform name for display if needed
  const getPlatformDisplay = (plat: string) => {
    const p = plat.toUpperCase();
    return p;
  };

  // Helper to format difficulty display (e.g. Gold 5 -> G5, Bronze 3 -> B3)
  const getDifficultyDisplay = (plat: string, diff: string) => {
    const p = plat.toUpperCase();

    if (p === "BOJ") {
      // Simple regex to grab First Letter + Number for standard tiers
      const match = diff.match(/([A-Z])[a-z]*\s*(\d+)/i);
      if (match) return `${match[1].toUpperCase()}${match[2]}`;
      // Handle "Unrated" or special cases - shorten to fit badge
      if (diff.toUpperCase() === "UNRATED") return "UR";
    } else if (p === "PROGRAMMERS") {
      // "level_3" -> "L3", "level_10" -> "L10"
      // Shorten to fit badge size
      const match = diff.match(/level[_\s]?(\d+)/i);
      if (match) return `L${match[1]}`;
      // Fallback: "Lv. 2" -> "L2"
      const lvMatch = diff.match(/lv\.?\s*(\d+)/i);
      if (lvMatch) return `L${lvMatch[1]}`;
      return diff;
    }

    // SWEA: "D3" -> "D3". default return is fine.
    return diff;
  };

  const effectiveLevel = getEffectiveLevel(platform, difficulty);
  const { bg, border, text, divider, minWidth } = getBadgeStyle(effectiveLevel);
  const platformDisplay = getPlatformDisplay(platform);

  return (
    <div
      className={`flex flex-row items-center justify-center gap-1.5 rounded-md px-2 py-1 ${bg} ${border} ${minWidth} w-fit whitespace-nowrap shadow-sm transition-shadow hover:shadow-md`}
    >
      <span
        className={`font-ibm text-[10px] leading-[130%] font-semibold tracking-tight ${text} shrink-0`}
      >
        {platformDisplay}
      </span>
      <div className={`h-[8px] w-[1px] ${divider} shrink-0 opacity-60`}></div>
      <span
        className={`font-ibm text-[11px] leading-[130%] font-bold tracking-tight ${text} shrink-0`}
      >
        {getDifficultyDisplay(platform, difficulty)}
      </span>
    </div>
  );
}
