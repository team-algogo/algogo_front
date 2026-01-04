import React from 'react';
import type { RequiredCodeReview } from '../../type/mypage/RequiredReviews';

interface ReviewRequestsProps {
    requests: RequiredCodeReview[];
    totalCount: number;
}

// Helper Component for Timer
const CountdownTimer = ({ createAt }: { createAt?: string }) => {
    const [timeLeft, setTimeLeft] = React.useState('');

    React.useEffect(() => {
        if (!createAt) return;

        const calculateTimeLeft = () => {
            const createdDate = new Date(createAt);
            const deadline = new Date(createdDate.getTime() + 48 * 60 * 60 * 1000); // +2 days
            const now = new Date();
            const difference = deadline.getTime() - now.getTime();

            if (difference > 0) {
                // Calculate time components
                const totalHours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                const formatted = `${String(totalHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                setTimeLeft(formatted);
            } else {
                setTimeLeft('00:00:00');
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [createAt]);

    if (!timeLeft) return null;

    return (
        <div className="flex items-center gap-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <circle cx="8" cy="8" r="6" stroke="#FF3B30" strokeWidth="1.5" />
                <path
                    d="M8 4V8L10.5 10.5"
                    stroke="#FF3B30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span
                className="text-[#FF3B30] text-sm font-normal leading-[130%]"
                style={{ fontFamily: 'IBM Plex Sans KR' }}
            >
                {timeLeft} 남음
            </span>
        </div>
    );
};

const ReviewRequests = ({ requests, totalCount }: ReviewRequestsProps) => {
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
            <div className="flex items-center gap-2 w-full">
                <span
                    className="text-[#050505] text-xl font-bold leading-[130%] tracking-[-0.2px]"
                    style={{ fontFamily: 'IBM Plex Sans KR' }}
                >
                    리뷰요청이 왔어요!
                </span>
                <div className="flex justify-center items-center gap-2.5 px-2 py-0.5 rounded-[100px] bg-[#FF3B30]">
                    <span
                        className="text-white text-xs font-bold leading-[130%]"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        {totalCount}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-start gap-3 w-full p-5 rounded-2xl border border-[#EBEBEB] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
                {requests.length === 0 ? (
                    <div className="flex w-full items-center justify-center py-4">
                        <span className="text-[#9FA3AA]">요청된 리뷰가 없습니다.</span>
                    </div>
                ) : (
                    requests.map((req, idx) => {
                        const typeColor =
                            getProgramTypeLabel(req.programType) === 'Group'
                                ? { bg: 'bg-[#FFF3E0]', text: 'text-[#EF6C00]' } // Group: Orange
                                : getProgramTypeLabel(req.programType) === 'Campaign'
                                  ? { bg: 'bg-[#E3F2FD]', text: 'text-[#1976D2]' } // Campaign: Blue
                                  : { bg: 'bg-[#F5F5F5]', text: 'text-[#757575]' }; // Problemset: Gray

                        return (
                            <div key={idx} className="flex flex-col items-start gap-3 w-full">
                                {/* Header Badges */}
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`flex justify-center items-center px-2 py-1 rounded-md ${typeColor.bg}`}
                                    >
                                        <span
                                            className={`${typeColor.text} text-xs font-medium leading-[130%]`}
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            {getProgramTypeLabel(req.programType)}
                                        </span>
                                    </div>
                                    <span
                                        className="text-[#727479] text-xs font-normal leading-[130%]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        {req.programTitle}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="flex flex-col items-start gap-1 w-full">
                                    <span
                                        className="text-[#333] text-base font-semibold leading-[130%] tracking-[-0.16px]"
                                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                                    >
                                        [{req.submission?.language ?? 'Unknown'}] {req.problemTitle}{' '}
                                        리뷰
                                    </span>
                                    {/* Tags */}
                                    <div className="flex items-start gap-1">
                                        <span
                                            className="text-[#727479] text-xs font-normal leading-[130%]"
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            #{req.problemPlatform}
                                        </span>
                                        {req.submission?.algorithmList?.map((algo) => (
                                            <span
                                                key={algo.id}
                                                className="text-[#727479] text-xs font-normal leading-[130%]"
                                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                                            >
                                                #{algo.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Info Row */}
                                <div className="flex items-center gap-4 w-full border-t border-[#F2F2F2] pt-3 mt-1">
                                    {/* Review Count */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-[16px] h-[16px] bg-[#727479]"
                                            style={{
                                                maskImage: 'url("/icons/reviewComentIcon.svg")',
                                                maskRepeat: 'no-repeat',
                                                maskSize: 'contain',
                                                maskPosition: 'center',
                                                WebkitMaskImage:
                                                    'url("/icons/reviewComentIcon.svg")',
                                                WebkitMaskRepeat: 'no-repeat',
                                                WebkitMaskSize: 'contain',
                                            }}
                                        />
                                        <span
                                            className="text-[#727479] text-sm font-normal leading-[130%]"
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            {req.submission?.reviewCount ?? 0}
                                        </span>
                                    </div>

                                    {/* View Count */}
                                    <div className="flex items-center gap-1">
                                        <div
                                            className="w-[18px] h-[18px] bg-[#727479]"
                                            style={{
                                                maskImage: 'url("/icons/viewOkIcon.svg")',
                                                maskRepeat: 'no-repeat',
                                                maskSize: 'contain',
                                                maskPosition: 'center',
                                                WebkitMaskImage: 'url("/icons/viewOkIcon.svg")',
                                                WebkitMaskRepeat: 'no-repeat',
                                                WebkitMaskSize: 'contain',
                                            }}
                                        />
                                        <span
                                            className="text-[#727479] text-sm font-normal leading-[130%]"
                                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                                        >
                                            {req.submission?.viewCount ?? 0}
                                        </span>
                                    </div>

                                    {/* Timer */}
                                    <CountdownTimer createAt={req.submission?.createAt} />
                                </div>
                                {idx < requests.length - 1 && (
                                    <div className="w-full h-px bg-[#F2F2F2] my-2"></div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ReviewRequests;
