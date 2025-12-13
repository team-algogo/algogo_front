import { useNavigate } from "react-router-dom";

interface ProblemSetCardProps {
    programId: number;
    title: string;
    description: string;
    thumbnail: string;
    categories: string[];
    totalParticipants: number;
    // Computed or extra props if needed
    problemCount?: number; // API doesn't seem to have "count" in the User JSON? "10개" in CSS.
    // User JSON: "programId", "title", "description", "thumbnail", "createAt", "modifiedAt", "programType", "categories", "totalParticipants".
    // The CSS shows "10개" (problems count?) and "100명" (participants).
    // API response MISSES problem count. I will default to 0 or hidden if missing.
    // Wait, the User JSON doesn't have problem count.
    // I will use a default or optional prop.
}

export default function ProblemSetCard({
    programId,
    title,
    description,
    thumbnail,
    categories,
    totalParticipants,
    problemCount = 0,
}: ProblemSetCardProps) {
    const navigate = useNavigate();
    const displayCategory = categories && categories.length > 0 ? categories[0] : "";

    return (
        <div
            onClick={() => navigate(`/problemset/${programId}`)}
            className="relative w-full h-[260px] rounded-[8px] overflow-hidden cursor-pointer group border border-[#EBEDF1] flex flex-col justify-between hover:shadow-lg transition-shadow"
            style={{
                // Combined linear gradient tint + image
                // If thumbnail is missing, use a fallback gradient or color to avoid plain white/grey
                backgroundImage: thumbnail
                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${thumbnail})`
                    : `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Frame 291: Top Badge Area */}
            <div className="flex flex-col items-start p-[12px_16px] gap-[10px] w-full h-[44px]">
                {displayCategory && (
                    <div className={`flex flex-row justify-center items-center px-[8px] py-[6px] gap-[10px] w-fit h-fit rounded-[100px] ${displayCategory === '알고리즘' ? 'bg-[#F0FDFA]' : 'bg-[#EFF6FF]'}`}>
                        <span className={`text-[12px] font-medium leading-[130%] tracking-[-0.01em] text-center whitespace-nowrap ${displayCategory === '알고리즘' ? 'text-[#0F766E]' : 'text-[#1D4ED8]'} font-ibm`}>
                            {displayCategory}
                        </span>
                    </div>
                )}
            </div>

            {/* Frame 269: Bottom Content Gradient Area */}
            <div
                className="flex flex-col items-start p-[12px_16px] gap-[4px] w-full h-[89px]"
                style={{
                    background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)'
                }}
            >
                {/* Title and Description */}
                <h3 className="w-full text-[16px] font-bold leading-[130%] tracking-[0.01em] text-white font-ibm truncate">
                    {title}
                </h3>
                <p className="w-full text-[14px] font-normal leading-[130%] tracking-[0.01em] text-white/80 font-ibm truncate">
                    {description}
                </p>

                {/* Frame 390: Stats */}
                <div className="flex flex-row items-center gap-[16px] w-[133px] h-[18px]">
                    {/* Problems Count */}
                    <div className="flex flex-row items-center gap-[8px]">
                        {/* Vector Icon Replacement */}
                        <img src="/icons/bookIconWhite.svg" alt="" className="w-[16px] h-[16px]" />
                        <span className="text-[14px] font-medium leading-[130%] tracking-[0.01em] text-[#FFFAFA] font-ibm">
                            {problemCount}개
                        </span>
                    </div>
                    {/* Participants Count */}
                    <div className="flex flex-row items-center gap-[8px]">
                        <img src="/icons/groupIconWhite.svg" alt="" className="w-[16px] h-[16px]" />
                        <span className="text-[14px] font-medium leading-[130%] tracking-[0.01em] text-[#FFFAFA] font-ibm">
                            {totalParticipants.toLocaleString()}명
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
