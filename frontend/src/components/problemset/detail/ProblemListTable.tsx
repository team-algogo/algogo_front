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
        <div className="relative w-full min-h-[300px]">
            {/* Table Content */}
            <div className={`w-full transition-all duration-300 ${!isLogined ? 'blur-[3px] opacity-60 pointer-events-none select-none' : ''}`}>
                {/* Table Header */}
                <div className="flex flex-row w-full h-[56px] bg-[#F9FAFB] border-b border-gray-100 text-[14px] text-[#555]">
                    <div className="w-[60px] shrink-0 flex items-center justify-center font-medium">#</div>
                    <div className="w-[120px] shrink-0 flex items-center justify-center font-medium">난이도</div>
                    <div className="flex-1 min-w-[200px] flex items-center justify-start px-4 font-medium">제목</div>
                    <div className="w-[100px] shrink-0 hidden lg:flex items-center justify-center font-medium">제출 수</div>
                    <div className="w-[100px] shrink-0 hidden lg:flex items-center justify-center font-medium">조회 수</div>
                    <div className="w-[100px] shrink-0 hidden md:flex items-center justify-center font-medium">참여자 수</div>
                    <div className="w-[80px] shrink-0 flex items-center justify-center font-medium">정답률</div>
                    <div className="w-[80px] shrink-0 flex items-center justify-center font-medium">문제풀기</div>
                    <div className="w-[80px] shrink-0 flex items-center justify-center font-medium">통계보기</div>
                </div>

                {/* Table Rows */}
                {problems.map((item, index) => {
                    const pInfo = item.problemResponseDto || item.problem;
                    if (!pInfo) return null;

                    return (
                        <div key={item.programProblemId} className="flex flex-row w-full h-[56px] bg-white border-b border-[#F5F5F5] hover:bg-gray-50 transition-colors text-[14px]">
                            <div className="w-[60px] shrink-0 flex items-center justify-center text-[#333]">
                                {(page - 1) * itemsPerPage + index + 1}
                            </div>
                            <div className="w-[120px] shrink-0 flex items-center justify-center">
                                <LevelBadge platform={pInfo.platformType} difficulty={pInfo.difficultyType} />
                            </div>
                            <div className="flex-1 min-w-[200px] flex items-center justify-start px-4 text-[#333] truncate font-medium">
                                {pInfo.title}
                            </div>
                            <div className="w-[100px] shrink-0 hidden lg:flex items-center justify-center text-[#555]">
                                {item.submissionCount.toLocaleString()}
                            </div>
                            <div className="w-[100px] shrink-0 hidden lg:flex items-center justify-center text-[#555]">
                                {item.viewCount.toLocaleString()}
                            </div>
                            <div className="w-[100px] shrink-0 hidden md:flex items-center justify-center text-[#555]">
                                {item.participantCount.toLocaleString()}
                            </div>
                            <div className="w-[80px] shrink-0 flex items-center justify-center text-[#555]">
                                {item.submissionCount > 0
                                    ? Math.round((item.solvedCount / item.submissionCount) * 100)
                                    : 0}%
                            </div>
                            <div className="w-[80px] shrink-0 flex items-center justify-center">
                                <button
                                    onClick={() => navigate(`/code/${item.programProblemId}`)}
                                    className="flex items-center justify-center px-3 py-1.5 border border-[#0D6EFD] rounded-[6px] text-[#0D6EFD] text-[12px] font-medium hover:bg-blue-50 transition-colors"
                                >
                                    이동
                                </button>
                            </div>
                            <div className="w-[80px] shrink-0 flex items-center justify-center">
                                <button
                                    onClick={() => navigate(`/statistics/${item.programProblemId}`)}
                                    className="flex items-center justify-center px-3 py-1.5 border border-[#0D6EFD] rounded-[6px] text-[#0D6EFD] text-[12px] font-medium hover:bg-blue-50 transition-colors"
                                >
                                    통계
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

            {/* Login Required Overlay */}
            {!isLogined && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-4 p-8">
                        <p className="text-[#333] text-[16px] font-medium">로그인이 필요한 서비스입니다.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2.5 bg-[#0D6EFD] hover:bg-[#0b5ed7] text-white text-[14px] font-medium rounded-lg transition-colors shadow-sm"
                        >
                            로그인 하러가기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
