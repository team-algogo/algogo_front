import type { ReceiveCodeReview } from '../../type/mypage/ReceivedReviews';

interface ReceivedReviewsProps {
    reviews: ReceiveCodeReview[];
    totalElements: number;
}

const ReceivedReviews = ({ reviews, totalElements }: ReceivedReviewsProps) => {
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        if (days < 7) return `${days}일 전`;
        if (days < 30) return `${days / 7}주 전`;
        if (days < 365) return `${days / 30}개월 전`;
        return `${days / 365}년 전`;
    };

    const getProgramTypeLabel = (type: string) => {
        switch (type) {
            case 'GROUP':
                return 'Group';
            case 'CAMPAIGN':
                return 'Campaign';
            case 'PROBLEMSET':
                return 'Problemset';
            default:
                return 'Other';
        }
    };

    return (
        <div className="flex flex-col items-start gap-4 w-full">
            <span
                className="text-[#050505] text-lg font-normal leading-[130%] tracking-[-0.18px]"
                style={{ fontFamily: 'IBM Plex Sans KR' }}
            >
                내가 받은 리뷰
            </span>

            <div className="flex flex-col items-start gap-3 w-full">
                {/* Empty State */}
                {totalElements === 0 ? (
                    <div className="flex w-full items-center justify-center py-10">
                        <span
                            className="text-[#9FA3AA] text-base font-medium leading-[130%]"
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            아직 받은 리뷰가 없어요
                        </span>
                    </div>
                ) : (
                    reviews.map((review) => {
                        const typeColor =
                            getProgramTypeLabel(review.programType) === 'Group'
                                ? { bg: 'bg-[#FFF3E0]', text: 'text-[#EF6C00]' } // Group: Orange
                                : getProgramTypeLabel(review.programType) === 'Campaign'
                                  ? { bg: 'bg-[#E3F2FD]', text: 'text-[#1976D2]' } // Campaign: Blue
                                  : { bg: 'bg-[#F5F5F5]', text: 'text-[#757575]' }; // Problemset: Gray

                        return (
                            <div
                                key={review.submissionId}
                                className="flex flex-col items-start gap-3 w-full p-5 rounded-2xl border border-[#F2F2F2] bg-white"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex justify-center items-center px-2 py-1 rounded-md ${typeColor.bg}`}
                                    >
                                        <span
                                            className={`${typeColor.text} text-xs font-medium leading-[130%]`}
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            {getProgramTypeLabel(review.programType)}
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#727479] text-xs font-normal leading-[130%]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        {review.programTitle}
                                    </span>
                                </div>

                                <div className="flex flex-col items-start gap-2 w-full">
                                    <span
                                        className="text-[#333] text-base font-medium leading-[130%] tracking-[-0.16px]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        {review.problemTitle}
                                    </span>
                                    <div className="flex items-start gap-2 w-full p-3 rounded-lg bg-[#F8F9FA]">
                                        <span
                                            className="text-[#333] text-sm font-normal leading-[160%]"
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            {review.content}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-[#E0E0E0] flex items-center justify-center text-[8px]">
                                        {review.nickname[0]}
                                    </div>
                                    <span
                                        className="text-[#727479] text-xs font-normal leading-[130%]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        {review.nickname}
                                    </span>
                                    <span
                                        className="text-[#9FA3AA] text-xs font-normal leading-[130%]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        {getTimeAgo(review.modifiedAt)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ReceivedReviews;
