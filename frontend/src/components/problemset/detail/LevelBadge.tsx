interface LevelBadgeProps {
    platform: string;
    difficulty: string;
}

export default function LevelBadge({ platform, difficulty }: LevelBadgeProps) {
    const getEffectiveLevel = (plat: string, diff: string): "EASY" | "MEDIUM" | "HARD" => {
        const p = plat.toUpperCase();
        const d = diff.toUpperCase();

        if (p === "PROGRAMMERS") {
            if (d.includes("LEVEL_0") || d.includes("LEVEL_1")) return "EASY";
            if (d.includes("LEVEL_2") || d.includes("LEVEL_3")) return "MEDIUM";
            return "HARD"; // Level 4, 5+
        }
        else if (p === "BOJ") {
            if (d.includes("BRONZE") || d.includes("SILVER") || d.includes("UNRATED")) return "EASY";
            if (d.includes("GOLD") || d.includes("PLATINUM")) return "MEDIUM";
            return "HARD"; // Diamond, Ruby+
        }
        else if (p === "SWEA") {
            if (["D1", "D2", "D3"].some(val => d.includes(val))) return "EASY";
            if (["D4", "D5", "D6"].some(val => d.includes(val))) return "MEDIUM";
            return "HARD"; // D7, D8+
        }

        return "EASY";
    };

    const getBadgeStyle = (effectiveLevel: string) => {
        switch (effectiveLevel) {
            case "MEDIUM": // Orange/Yellow
                return {
                    bg: "bg-[#FEF3C7]",
                    text: "text-[#B45309]",
                    minWidth: "min-w-[61px]"
                };
            case "HARD": // Red
                return {
                    bg: "bg-[#FEE2E2]",
                    text: "text-[#B91C1C]",
                    minWidth: "min-w-[61px]"
                };
            default: // EASY - Green
                return {
                    bg: "bg-[#DCFCE7]",
                    text: "text-[#15803D]",
                    minWidth: "min-w-[60px]"
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
            // Handle "Unrated" or special cases
            if (diff.toUpperCase() === "UNRATED") return "Unrated";
        } else if (p === "PROGRAMMERS") {
            // "level_3" -> "LEVEL 3"
            // "Lv. 2" -> "LEVEL 2"
            let formatted = diff.replace(/_/g, " ");
            formatted = formatted.replace(/Lv\.?/i, "LEVEL");
            return formatted.toUpperCase(); // "LEVEL 3"
        }

        // SWEA: "D3" -> "D3". default return is fine.
        return diff;
    };

    const effectiveLevel = getEffectiveLevel(platform, difficulty);
    const { bg, text, minWidth } = getBadgeStyle(effectiveLevel);
    const platformDisplay = getPlatformDisplay(platform);

    // User CSS implied two separate text elements.
    // "BOJ" styles are identical for both items in the CSS block, except content.
    // Actually the user CSS has "BOJ" block and "B3" block.
    // I will render them as two spans.

    return (
        <div className={`flex flex-row items-center justify-center px-2 py-[4px] gap-[4px] rounded-[10px] ${bg} ${minWidth} whitespace-nowrap`}>
            <span className={`text-[10px] font-medium font-ibm leading-[130%] tracking-[−0.02em] ${text}`}>
                {platformDisplay}
            </span>
            <div className={`w-[1px] h-[8px] ${text} opacity-20 bg-current`}></div>
            <span className={`text-[12px] font-bold font-ibm leading-[130%] tracking-[−0.02em] ${text}`}>
                {getDifficultyDisplay(platform, difficulty)}
            </span>
        </div>
    );
}
