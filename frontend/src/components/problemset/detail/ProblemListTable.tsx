import { useNavigate } from "react-router-dom";
import type { Problem } from "@type/problemset/problem.d.ts";
import LevelBadge from "./LevelBadge";

interface ProblemListTableProps {
    problems: Problem[];
    page: number;
    itemsPerPage?: number;
    isLogined?: boolean;
}

export default function ProblemListTable({ problems, page, itemsPerPage = 20, isLogined = true }: ProblemListTableProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full rounded-[12px] bg-white border border-[#F4F4F5] overflow-hidden overflow-x-auto relative">
            {!isLogined && (
                <div className="absolute bottom-0 w-full h-[calc(100%-168px)] z-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/60 to-white/90 backdrop-blur-[1px]">
                    <div className="flex flex-col items-center gap-[12px]">
                        <span className="font-sans font-black text-[16px] leading-[130%] text-[#333333]">
                            더 많은 문제를 보려면<br />
                            로그인이 필요합니다 🔒
                        </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex flex-row justify-center items-center px-[24px] py-[12px] bg-[#0D6EFD] rounded-[8px] hover:bg-[#0b5ed7] transition-colors"
                        >
                            <span className="font-ibm font-bold text-[16px] leading-[100%] text-white">
                                로그인하기
                            </span>
                        </button>
                    </div>
                </div>
            )}
            <div className={`min-w-[1200px] ${!isLogined ? 'select-none pointer-events-none' : ''}`}>
                {/* Table Header */}
                <div className="flex flex-row w-full h-[56px] bg-[#F9FAFB] border-b border-gray-100">
                    <div className="w-[88px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">#</div>
                    <div className="w-[163px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">난이도</div>
                    <div className="flex-1 min-w-[300px] flex items-center justify-start px-6 text-[16px] font-medium text-[#333333]">제목</div>
                    <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">제출 수</div>
                    <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">조회 수</div>
                    <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">참여자 수</div>
                    <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">정답률</div>
                    <div className="w-[110px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">문제풀기</div>
                    <div className="w-[110px] shrink-0 flex items-center justify-center text-[16px] font-medium text-[#333333]">통계보기</div>
                </div>

                {/* Table Rows */}
                {problems.map((item, index) => {
                    const pInfo = item.problemResponseDto || item.problem;
                    if (!pInfo) return null;

                    return (
                        <div key={item.programProblemId} className="flex flex-row w-full h-[56px] bg-white border-b border-[#F5F5F5] hover:bg-gray-50 transition-colors">
                            <div className="w-[88px] shrink-0 flex items-center justify-center text-[16px] text-[#333333]">
                                {(page - 1) * itemsPerPage + index + 1}
                            </div>
                            <div className="w-[163px] shrink-0 flex items-center justify-center">
                                <LevelBadge platform={pInfo.platformType} difficulty={pInfo.difficultyType} level={item.userDifficultyType} />
                            </div>
                            <div className="flex-1 min-w-[300px] flex items-center justify-start px-6 text-[16px] text-[#333333] truncate">
                                {pInfo.title}
                            </div>
                            <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] text-[#333333]">
                                {item.submissionCount.toLocaleString()}명
                            </div>
                            <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] text-[#333333]">
                                {item.viewCount.toLocaleString()}명
                            </div>
                            <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] text-[#333333]">
                                {item.participantCount.toLocaleString()}명
                            </div>
                            <div className="w-[158px] shrink-0 flex items-center justify-center text-[16px] text-[#333333]">
                                {item.submissionCount > 0
                                    ? Math.round((item.solvedCount / item.submissionCount) * 100)
                                    : 0}%
                            </div>
                            <div className="w-[110px] shrink-0 flex items-center justify-center">
                                <button
                                    onClick={() => window.open(pInfo.problemLink, '_blank')}
                                    className="flex items-center justify-center px-3 py-2 border border-[#0D6EFD] rounded-[8px] text-[#0D6EFD] text-[14px] font-medium hover:bg-blue-50"
                                >
                                    이동
                                </button>
                            </div>
                            <div className="w-[110px] shrink-0 flex items-center justify-center">
                                <button
                                    className="flex items-center justify-center px-3 py-2 border border-[#0D6EFD] rounded-[8px] text-[#0D6EFD] text-[14px] font-medium hover:bg-blue-50"
                                >
                                    이동
                                </button>
                            </div>
                        </div>
                    );
                })}
                {problems.length === 0 && (
                    <div className="w-full h-[200px] flex items-center justify-center text-gray-400">
                        등록된 문제가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
