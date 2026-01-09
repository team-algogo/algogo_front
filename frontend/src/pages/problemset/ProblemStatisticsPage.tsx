import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Pagination from "@components/pagination/Pagination";
import StateBadge from "@components/badge/StateBadge";
import { getProblemStatistics } from "@api/problemset/getProblemStatistics";
import { getProblemInfo } from "@api/code/codeSubmit";
import { format } from "date-fns";
import type { SubmissionItem } from "@type/problemset/statistics";

export default function ProblemStatisticsPage() {
    const { programProblemId } = useParams<{ programProblemId: string }>();
    const id = Number(programProblemId);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [language, setLanguage] = useState("");
    const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDirection, setSortDirection] = useState("desc");

    const itemsPerPage = 20;

    const { data: problemInfo } = useQuery({
        queryKey: ["problemInfo", programProblemId],
        queryFn: () => getProblemInfo(programProblemId!),
        enabled: !!programProblemId,
    });

    const { data: statisticsData } = useQuery({
        queryKey: ["problemStatistics", id, page, keyword, language, isSuccess, sortBy, sortDirection],
        queryFn: () => getProblemStatistics(id, {
            page: page - 1,
            size: itemsPerPage,
        }),
        enabled: !isNaN(id),
    });

    const submissions = statisticsData?.submissions || [];
    const pageInfo = statisticsData?.page;
    const totalPages = pageInfo?.totalPages || 1;
    const totalSubmissions = pageInfo?.totalElements || 0;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(searchTerm);
        setPage(1);
    };

    const handleSortToggle = () => {
        setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    };

    return (
        <BasePage>
            <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
                {/* Header */}
                <div className="flex w-full flex-row justify-between items-end border-b border-gray-200 pb-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-gray-500 mb-1">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-1 text-sm hover:text-[#333333] transition-colors"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                문제집으로 돌아가기
                            </button>
                        </div>
                        <h1 className="text-[28px] font-bold text-[#333333] flex items-center gap-3">
                            {problemInfo?.problemNo}. {problemInfo?.title}
                            <span className="text-[16px] font-normal text-gray-400">통계</span>
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => window.open(problemInfo?.problemLink, '_blank')}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
                        >
                            문제 원본 보기
                        </button>
                        <button
                            onClick={() => navigate(`/code/${programProblemId}`)}
                            className="px-4 py-2 rounded-lg bg-[#0D6EFD] text-white font-medium hover:bg-blue-600 transition-colors text-sm"
                        >
                            문제 풀러 가기
                        </button>
                    </div>
                </div>

                {/* Top Statistics Bar */}
                <div className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-6 px-10">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-500">전체 제출</span>
                        <span className="text-2xl font-bold text-[#333333]">{totalSubmissions.toLocaleString()}</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-500">정답 제출</span>
                        <span className="text-2xl font-bold text-[#333333]">-</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-500">오답 제출</span>
                        <span className="text-2xl font-bold text-[#333333]">-</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-medium text-gray-500">정답률</span>
                        <span className="text-2xl font-bold text-[#0D6EFD]">- %</span>
                    </div>
                </div>

                {/* Main Content: Full Width Table */}
                <div className="w-full flex flex-col gap-4">
                    {/* Filters */}
                    <div className="flex flex-col gap-3 p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex gap-2 items-center">
                                {/* Language Filter */}
                                <select
                                    value={language}
                                    onChange={(e) => {
                                        setLanguage(e.target.value);
                                        setPage(1);
                                    }}
                                    className="h-[36px] px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-[#333333] focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">모든 언어</option>
                                    <option value="Java">Java</option>
                                    <option value="Python">Python</option>
                                    <option value="C++">C++</option>
                                </select>

                                {/* Result Filter */}
                                <div className="flex bg-white rounded border border-gray-200 overflow-hidden h-[36px]">
                                    <button
                                        onClick={() => { setIsSuccess(undefined); setPage(1); }}
                                        className={`px-3 text-sm transition-colors ${isSuccess === undefined ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        전체
                                    </button>
                                    <div className="w-[1px] bg-gray-200"></div>
                                    <button
                                        onClick={() => { setIsSuccess(true); setPage(1); }}
                                        className={`px-3 text-sm transition-colors ${isSuccess === true ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        성공
                                    </button>
                                    <div className="w-[1px] bg-gray-200"></div>
                                    <button
                                        onClick={() => { setIsSuccess(false); setPage(1); }}
                                        className={`px-3 text-sm transition-colors ${isSuccess === false ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        실패
                                    </button>
                                </div>
                            </div>

                            {/* Sort Controls */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setPage(1);
                                    }}
                                    className="h-[36px] px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-[#333333] focus:outline-none focus:border-blue-500"
                                >
                                    <option value="createdAt">최신순</option>
                                    <option value="execTime">실행 시간</option>
                                    <option value="memory">메모리</option>
                                </select>
                                <button
                                    onClick={handleSortToggle}
                                    className="flex items-center justify-center h-[36px] w-[36px] bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                                    title={sortDirection === "asc" ? "오름차순" : "내림차순"}
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transform transition-transform duration-200 ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
                                        <path d="M6 9L2 5H10L6 9Z" fill="#666666" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="사용자명 검색"
                                className="w-full h-[40px] pl-10 pr-4 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM11 6.5C11 8.98528 8.98528 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5Z" fill="currentColor" />
                            </svg>
                        </form>
                    </div>

                    <div className="flex flex-col w-full rounded-[12px] border border-[#F4F4F5]"> {/* Removed overflow-hidden to allow tooltips */}
                        {/* Table Header */}
                        <div className="flex flex-row w-full h-[50px] bg-[#F9FAFB] border-b border-gray-100 items-center rounded-t-[12px]">
                            <div className="w-[80px] text-center text-sm font-medium text-gray-500">순위</div>
                            <div className="w-[160px] text-center text-sm font-medium text-gray-500">사용자</div>
                            <div className="w-[100px] text-center text-sm font-medium text-gray-500">결과</div>
                            <div className="w-[100px] text-center text-sm font-medium text-gray-500">메모리</div>
                            <div className="w-[100px] text-center text-sm font-medium text-gray-500">시간</div>
                            <div className="w-[100px] text-center text-sm font-medium text-gray-500">언어</div>
                            <div className="flex-1 text-center text-sm font-medium text-gray-500">알고리즘</div>
                            <div className="w-[120px] text-center text-sm font-medium text-gray-500">AI 점수</div>
                            <div className="w-[120px] text-center text-sm font-medium text-gray-500">제출 시간</div>
                            <div className="w-[120px] text-center text-sm font-medium text-gray-500">코드</div>
                        </div>

                        {/* Rows */}
                        {submissions.map((item: SubmissionItem, index: number) => {
                            const rank = (page - 1) * itemsPerPage + index + 1;
                            const { userSimpleResponseDto: user, submissionResponseDto: sub } = item;
                            const aiScore = sub.aiScore !== null ? `${sub.aiScore}점` : '-';

                            return (
                                <div key={sub.submissionId} className="flex flex-row w-full min-h-[56px] bg-white border-b border-gray-50 items-center hover:bg-gray-50 transition-colors py-3 last:rounded-b-[12px]">
                                    <div className="w-[80px] text-center text-sm text-[#333333] font-medium">{rank}</div>
                                    <div className="w-[160px] text-center text-sm text-[#333333] truncate px-2 font-medium">{user.nickname}</div>
                                    <div className="w-[100px] flex justify-center">
                                        <StateBadge hasText={true} isPassed={sub.isSuccess} />
                                    </div>
                                    <div className="w-[100px] text-center text-sm text-[#666666]">{sub.memory} KB</div>
                                    <div className="w-[100px] text-center text-sm text-[#E54D2E] font-medium">{sub.execTime} ms</div>
                                    <div className="w-[100px] text-center text-sm text-[#333333] px-2 truncate" title={sub.language}>{sub.language}</div>
                                    {/* Algorithm */}
                                    <div className="flex-1 flex justify-center gap-1 flex-wrap px-2 relative group cursor-help">
                                        {sub.algorithmList?.length > 0 ? (
                                            <>
                                                {sub.algorithmList.map(algo => (
                                                    <span key={algo.id} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 truncate max-w-[80px]">
                                                        {algo.name}
                                                    </span>
                                                ))}
                                                {/* Tooltip for Algorithm */}
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                                                    <div className="flex flex-wrap gap-1 justify-center">
                                                        {sub.algorithmList.map(algo => (
                                                            <span key={algo.id} className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-200 rounded border border-gray-600">
                                                                {algo.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="text-gray-300 text-xs">-</span>
                                        )}
                                    </div>
                                    {/* AI Score */}
                                    <div className="w-[120px] flex justify-center group relative cursor-help">
                                        <span className={`text-sm font-bold ${sub.aiScore !== null ? 'text-[#0D6EFD]' : 'text-gray-300'}`}>
                                            {aiScore}
                                        </span>
                                        {sub.aiScoreReason && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                                                {sub.aiScoreReason}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-[120px] text-center text-sm text-gray-400">
                                        {format(new Date(sub.createAt), "MM. dd.")}
                                    </div>
                                    <div className="w-[120px] flex justify-center">
                                        <button
                                            onClick={() => navigate(`/reviews/${sub.submissionId}`)}
                                            className="text-sm font-medium text-gray-500 hover:text-[#0D6EFD] underline decoration-gray-300 hover:decoration-[#0D6EFD] underline-offset-2 transition-colors"
                                        >
                                            리뷰 보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {submissions.length === 0 && (
                            <div className="w-full h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 border-t border-gray-100">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 17H15M9 13H15M9 9H13M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <p className="text-sm">제출 내역이 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {pageInfo && totalPages > 0 && (
                        <Pagination
                            pageInfo={pageInfo}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </BasePage>
    );
}
