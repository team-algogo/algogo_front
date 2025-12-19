import { useState } from 'react';
import ProblemSetCard from '@components/cards/mypage/ProblemSetCard';
import Pagination from '@components/pagination/Pagination';

type TabType = '문제집' | '캠페인' | '그룹방';

const ParticipationStatus = () => {
    const [activeTab, setActiveTab] = useState<TabType>('문제집');
    const [currentPage, setCurrentPage] = useState(1);

    const mockProblems = [
        {
            id: 1,
            title: '삼성 코딩 테스트 문제집',
            category: '기업대비' as const,
            progress: 10,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        },
        {
            id: 2,
            title: '삼성 코딩 테스트 문제집',
            category: '기업대비' as const,
            progress: 10,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        },
        {
            id: 3,
            title: '2026 상반기 필수 기출 TOP 50',
            category: '알고리즘' as const,
            progress: 100,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
        },
        {
            id: 4,
            title: '삼성 코딩 테스트 문제집',
            category: '기업대비' as const,
            progress: 10,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        },
        {
            id: 5,
            title: '삼성 코딩 테스트 문제집',
            category: '기업대비' as const,
            progress: 10,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        },
        {
            id: 6,
            title: '삼성 코딩 테스트 문제집',
            category: '기업대비' as const,
            progress: 10,
            problemCount: 10,
            memberCount: 100,
            thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
        },
    ];

    return (
        <>
            <div className="flex flex-col items-start gap-10 self-stretch">
                {/* Tabs */}
                <div className="flex justify-between items-center self-stretch">
                    <button
                        onClick={() => setActiveTab('문제집')}
                        className={`flex flex-1 justify-center items-center gap-2 ${activeTab === '문제집' ? 'border-b border-[#0D6EFD]' : 'border-b border-[#E8F0FF]'
                            } py-3`}
                    >
                        <span
                            className={`text-base font-semibold leading-[130%] tracking-[-0.16px] ${activeTab === '문제집' ? 'text-[#0D6EFD]' : 'text-[#6C757D]'
                                }`}
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            문제집
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('캠페인')}
                        className={`flex flex-1 justify-center items-center gap-2 ${activeTab === '캠페인' ? 'border-b border-[#0D6EFD]' : 'border-b border-[#E8F0FF]'
                            } py-3`}
                    >
                        <span
                            className={`text-base font-semibold leading-[130%] tracking-[-0.16px] ${activeTab === '캠페인' ? 'text-[#0D6EFD]' : 'text-[#6C757D]'
                                }`}
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            캠페인
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('그룹방')}
                        className={`flex flex-1 justify-center items-center gap-2 ${activeTab === '그룹방' ? 'border-b border-[#0D6EFD]' : 'border-b border-[#E8F0FF]'
                            } py-3`}
                    >
                        <span
                            className={`text-base font-semibold leading-[130%] tracking-[-0.16px] ${activeTab === '그룹방' ? 'text-[#0D6EFD]' : 'text-[#6C757D]'
                                }`}
                            style={{ fontFamily: 'IBM Plex Sans KR' }}
                        >
                            그룹방
                        </span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col items-start gap-4 self-stretch">
                {/* Header */}
                <div className="flex justify-between items-center self-stretch">
                    <span
                        className="text-[#050505] text-base font-normal leading-[130%] tracking-[-0.16px]"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        내가 참여한 문제집 목록을 확인해 보세요🙂
                    </span>
                    <div className="flex items-center gap-4">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clipPath="url(#clip0)">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.5 15C11.7761 15 12 14.7761 12 14.5V2.70711L15.1464 5.85355C15.3417 6.04882 15.6583 6.04882 15.8536 5.85355C16.0488 5.65829 16.0488 5.34171 15.8536 5.14645L11.8536 1.14645C11.6583 0.951185 11.3417 0.951185 11.1464 1.14645L7.14645 5.14645C6.95118 5.34171 6.95118 5.65829 7.14645 5.85355C7.34171 6.04882 7.65829 6.04882 7.85355 5.85355L11 2.70711V14.5C11 14.7761 11.2239 15 11.5 15Z"
                                    fill="#727479"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.5 1C4.77614 1 5 1.22386 5 1.5V13.2929L8.14645 10.1464C8.34171 9.95118 8.65829 9.95118 8.85355 10.1464C9.04882 10.3417 9.04882 10.6583 8.85355 10.8536L4.85355 14.8536C4.65829 15.0488 4.34171 15.0488 4.14645 14.8536L0.146447 10.8536C-0.0488155 10.6583 -0.0488155 10.3417 0.146447 10.1464C0.341709 9.95118 0.658292 9.95118 0.853554 10.1464L4 13.2929V1.5C4 1.22386 4.22386 1 4.5 1Z"
                                    fill="#727479"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div className="flex items-start gap-1 rounded-lg border border-[#727479] px-2 py-1">
                            <span className="text-[#727479] text-sm font-normal leading-[130%]" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                                최신순
                            </span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 7L8 11L12 7" stroke="#727479" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <div className="flex flex-col items-start gap-6 self-stretch">
                    <div className="flex items-start gap-[9px] self-stretch flex-wrap">
                        {mockProblems.slice(0, 3).map((problem) => (
                            <ProblemSetCard
                                key={problem.id}
                                title={problem.title}
                                category={problem.category}
                                progress={problem.progress}
                                problemCount={problem.problemCount}
                                memberCount={problem.memberCount}
                                thumbnailUrl={problem.thumbnailUrl}
                                isCompleted={problem.progress === 100}
                            />
                        ))}
                    </div>
                    <div className="flex items-start gap-[9px] self-stretch flex-wrap">
                        {mockProblems.slice(3, 6).map((problem) => (
                            <ProblemSetCard
                                key={problem.id}
                                title={problem.title}
                                category={problem.category}
                                progress={problem.progress}
                                problemCount={problem.problemCount}
                                memberCount={problem.memberCount}
                                thumbnailUrl={problem.thumbnailUrl}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </>
    );
};

export default ParticipationStatus;
