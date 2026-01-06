import { useNavigate } from "react-router-dom";

interface SearchProblemSetItemProps {
    programId: number;
    title: string;
    description: string;
    thumbnail: string;
    categories: string[];
    totalParticipants: number;
    problemCount?: number;
}

export default function SearchProblemSetItem({
    programId,
    title,
    description,
    categories,
    totalParticipants,
    problemCount = 0,
}: SearchProblemSetItemProps) {
    const navigate = useNavigate();
    const displayCategory = categories && categories.length > 0 ? categories[0] : "";

    return (
        <div
            onClick={() => navigate(`/problemset/${programId}`)}
            className="flex flex-col items-start p-6 gap-4 w-full h-[180px] bg-[#F8F9FA] rounded-lg cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-[#E5E7EB]"
        >
            {/* Category */}
            {displayCategory && (
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${displayCategory.includes('알고리즘') ? 'bg-[#F0FDFA] text-[#0F766E]' : 'bg-[#EFF6FF] text-[#1D4ED8]'
                    }`}>
                    {displayCategory}
                </div>
            )}

            {/* Content */}
            <div className="flex flex-col gap-1 w-full">
                <h3 className="text-lg font-bold text-[#1F2937] truncate">
                    {title}
                </h3>
                <p className="text-sm text-[#6B7280] line-clamp-2 h-[40px]">
                    {description}
                </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-[#9CA3AF]">
                <span>참여자 {totalParticipants}명</span>
                <span>문제 {problemCount}개</span>
            </div>
        </div>
    );
}
