
import ParticipationStatus, { type TabType } from "./ParticipationStatus";
import WrittenReviews from "./WrittenReviews";
import ReviewRequestsContainer from "./ReviewRequestsContainer";
import ReceivedReviewsContainer from "./ReceivedReviewsContainer";

import InvitationStatus from "./InvitationStatus";

type ViewMode = "참여 현황" | "리뷰 요청" | "받은 리뷰" | "작성 리뷰" | "초대/신청 현황";

interface ContentAreaProps {
    viewMode: ViewMode;
    initialSubTab?: TabType;
}

const ContentArea = ({ viewMode, initialSubTab }: ContentAreaProps) => {

    return (
        <div className="flex flex-col gap-8 flex-1 w-full max-w-4xl">
            {/* View Mode Switcher */}


            {/* Dynamic Content */}
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                {viewMode === '참여 현황' && <ParticipationStatus initialTab={initialSubTab} />}
                {viewMode === '리뷰 요청' && <ReviewRequestsContainer />}
                {viewMode === '받은 리뷰' && <ReceivedReviewsContainer />}
                {viewMode === '작성 리뷰' && <WrittenReviews />}
                {viewMode === '초대/신청 현황' && <InvitationStatus />}
            </div>
        </div>
    );
};

export default ContentArea;
