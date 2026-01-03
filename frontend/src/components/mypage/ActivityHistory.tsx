import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from '@components/pagination/Pagination';
import { getReceivedReviews } from '../../api/mypage';

const ActivityHistory = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { data } = useQuery({
        queryKey: ['receivedReviews', currentPage],
        queryFn: () => getReceivedReviews(currentPage, pageSize),
    });

    const reviews = data?.receiveCodeReviews || [];
    const totalPages = data?.pageInfo.totalPages || 1;
    const totalElements = data?.pageInfo.totalElements || 0;

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return `${days}일 전`;
    };

    const getProgramTypeLabel = (type: string) => {
        switch (type) {
            case 'group':
                return '그룹방';
            case 'campaign':
                return '캠페인';
            case 'problem':
                return '문제집';
            default:
                return '기타';
        }
    };

    return (
        <div className="flex flex-col items-start gap-10 w-full">
            {/* Review Requests Section */}
            <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex items-center gap-2">
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
                            4
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-3 w-full p-5 rounded-2xl border border-[#EBEBEB] bg-white shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2">
                        <div className="flex justify-center items-center px-2 py-1 rounded-md bg-[#E8F5E9]">
                            <span
                                className="text-[#2E7D32] text-xs font-medium leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                Group
                            </span>
                        </div>
                        <div className="flex justify-center items-center px-2 py-1 rounded-md bg-[#FFEBEE]">
                            <span
                                className="text-[#D32F2F] text-xs font-medium leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                오늘마감
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                        <span
                            className="text-[#333] text-base font-semibold leading-[130%] tracking-[-0.16px]"
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            [Python] 다익스트라 알고리즘 구현 리뷰
                        </span>
                        <div className="flex items-start gap-1">
                            <span
                                className="text-[#727479] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                #성능개선
                            </span>
                            <span
                                className="text-[#727479] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                #중급
                            </span>
                            <span
                                className="text-[#727479] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                #다익스트라
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full border-t border-[#F2F2F2] pt-3 mt-1">
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M5.33334 2V14"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M14 5.33333H5.33334"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className="text-[#9FA3AA] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                180 lines
                            </span>
                        </div>
                        <div className="w-px h-3 bg-[#EBEBEB]"></div>
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M14 11.3333C14 12.0697 13.403 12.6667 12.6667 12.6667H4.66667L2 15.3333V3.33333C2 2.59695 2.59695 2 3.33333 2H12.6667C13.403 2 14 2.59695 14 3.33333V11.3333Z"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className="text-[#9FA3AA] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                17
                            </span>
                        </div>
                        <div className="w-px h-3 bg-[#EBEBEB]"></div>
                        <div className="flex items-center gap-1">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M8.00001 8.00001C9.47277 8.00001 10.6667 6.8061 10.6667 5.33334C10.6667 3.86058 9.47277 2.66667 8.00001 2.66667C6.52725 2.66667 5.33334 3.86058 5.33334 5.33334C5.33334 6.8061 6.52725 8.00001 8.00001 8.00001Z"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.82 13.82C13.238 12.3789 12.0838 11.2335 10.6402 10.6611C9.79973 10.3276 8.89201 10.3276 8.05151 10.6611C6.60795 11.2335 5.45371 12.3789 4.87167 13.82"
                                    stroke="#9FA3AA"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className="text-[#9FA3AA] text-xs font-normal leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                180 lines
                            </span>
                        </div>
                        <div className="w-px h-3 bg-[#EBEBEB]"></div>
                        <div className="flex items-center gap-1 ml-auto">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path
                                    d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                                    stroke="#FF3B30"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M8 4V8L10.6667 9.33333"
                                    stroke="#FF3B30"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span
                                className="text-[#FF3B30] text-xs font-medium leading-[130%]"
                                style={{ fontFamily: 'IBM Plex Sans KR' }}
                            >
                                02:14:03 남음
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-[#F2F2F2]"></div>

            {/* Received Reviews Section */}
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
                                getProgramTypeLabel(review.programType) === '그룹방'
                                    ? { bg: 'bg-[#F3E5F5]', text: 'text-[#7B1FA2]' }
                                    : getProgramTypeLabel(review.programType) === '캠페인'
                                      ? { bg: 'bg-[#E3F2FD]', text: 'text-[#1976D2]' }
                                      : { bg: 'bg-[#E8F5E9]', text: 'text-[#2E7D32]' };

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

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ActivityHistory;
