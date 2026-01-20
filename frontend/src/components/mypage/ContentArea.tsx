import type { Dispatch, SetStateAction } from "react";
import ParticipationStatus from "./ParticipationStatus";
import ActivityHistory from "./ActivityHistory";
import WrittenReviews from "./WrittenReviews";

type ViewMode = "참여 현황" | "활동 내역" | "작성 리뷰";

interface ContentAreaProps {
    viewMode: ViewMode;
    setViewMode: Dispatch<SetStateAction<ViewMode>>;
    initialSubTab?: "문제집" | "캠페인" | "그룹방";
}

const ContentArea = ({ viewMode, setViewMode, initialSubTab }: ContentAreaProps) => {
    return (
        <div className="flex flex-col gap-8 flex-1 w-full max-w-4xl">
            {/* View Mode Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('참여 현황')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === '참여 현황'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    참여 현황
                </button>
                <button
                    onClick={() => setViewMode('활동 내역')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === '활동 내역'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    활동 내역
                </button>
                <button
                    onClick={() => setViewMode('작성 리뷰')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === '작성 리뷰'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    작성 리뷰
                </button>
            </div>

            {/* Dynamic Content */}
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {viewMode === '참여 현황' && <ParticipationStatus initialTab={initialSubTab} />}
                {viewMode === '활동 내역' && <ActivityHistory />}
                {viewMode === '작성 리뷰' && <WrittenReviews />}
            </div>
        </div>
    );
};

export default ContentArea;
