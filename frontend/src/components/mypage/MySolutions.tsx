import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@components/pagination/Pagination";
import StateBadge from "@components/badge/StateBadge";
import {
    getMySubmissions,
    type MySubmissionItem,
} from "@api/submissions/getMySubmissions";
import { format } from "date-fns";

export default function MySolutions() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    const { data: mySubmissionsData } = useQuery({
        queryKey: ["mySubmissions", page],
        queryFn: () =>
            getMySubmissions({
                page: page - 1,
                size: itemsPerPage,
            }),
    });

    const submissions = mySubmissionsData?.data?.submissions || [];
    const pageInfo = mySubmissionsData?.data?.page;
    const totalPages = pageInfo?.totalPages || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // 언어를 정규화하여 일관된 형식으로 표시 (ProblemStatisticsPage reuse)
    const normalizeLanguage = (lang: string): string => {
        if (!lang) return "";
        const normalized = lang.toLowerCase();
        if (normalized.includes("javascript") || normalized.includes("js"))
            return "JAVASCRIPT";
        if (normalized.includes("typescript") || normalized.includes("ts"))
            return "TYPESCRIPT";
        if (normalized.includes("cpp") || normalized.includes("c++")) return "C++";
        if (normalized.includes("java")) return "JAVA";
        if (normalized.includes("python")) return "PYTHON";
        if (normalized.includes("kotlin")) return "KOTLIN";
        if (normalized.includes("swift")) return "SWIFT";
        if (normalized.includes("go")) return "GO";
        if (normalized.includes("rust")) return "RUST";
        return lang.toUpperCase();
    };

    // AI 점수별 뱃지 스타일 가져오기 (ProblemStatisticsPage reuse)
    const getAiScoreBadgeStyle = (score: number | null) => {
        if (score === null) {
            return {
                bg: "bg-gray-50",
                text: "text-gray-600",
                border: "border-gray-200",
            };
        }
        if (score < 60) {
            return {
                bg: "bg-yellow-50",
                text: "text-yellow-800",
                border: "border-yellow-200",
            };
        } else if (score < 80) {
            return {
                bg: "bg-indigo-50",
                text: "text-indigo-700",
                border: "border-indigo-200",
            };
        } else {
            return {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
            };
        }
    };

    // 언어별 테마 색상 스타일 가져오기 (ProblemStatisticsPage reuse)
    const getLanguageBadgeStyle = (lang: string) => {
        const normalized = normalizeLanguage(lang);
        const styles: Record<string, { bg: string; text: string; border: string }> =
        {
            JAVA: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
            },
            PYTHON: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
            },
            "C++": {
                bg: "bg-slate-50",
                text: "text-slate-700",
                border: "border-slate-200",
            },
            JAVASCRIPT: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                border: "border-yellow-200",
            },
            TYPESCRIPT: {
                bg: "bg-indigo-50",
                text: "text-indigo-700",
                border: "border-indigo-200",
            },
            KOTLIN: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
            },
            SWIFT: {
                bg: "bg-orange-50",
                text: "text-orange-700",
                border: "border-orange-200",
            },
            GO: {
                bg: "bg-cyan-50",
                text: "text-cyan-700",
                border: "border-cyan-200",
            },
            RUST: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
            },
        };

        return (
            styles[normalized] || {
                bg: "bg-gray-50",
                text: "text-gray-700",
                border: "border-gray-200",
            }
        );
    };

    // Program Type Badge Text mapping
    const getProgramTypeBadgeText = (type: string) => {
        switch (type) {
            case "PROBLEMSET":
                return "문제집";
            case "GROUP":
                return "그룹";
            default:
                return "그룹";
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-start gap-6 bg-white flex-1">
            {/* Header */}
            <h2 className="text-xl font-bold text-[#333333]">내가 푼 문제</h2>

            {/* Main Content: Full Width Table */}
            <div className="flex w-full flex-col gap-4 flex-1">
                <div className="flex w-full flex-col rounded-[12px] border border-[#F4F4F5]">
                    {/* Table Header */}
                    <div className="flex h-[50px] w-full flex-row items-center rounded-t-[12px] border-b border-gray-100 bg-[#F9FAFB]">
                        {/* Changed columns here */}
                        <div className="w-[140px] text-center text-sm font-medium text-gray-500">
                            프로그램명
                        </div>
                        <div className="w-[180px] text-center text-sm font-medium text-gray-500">
                            문제명
                        </div>
                        <div className="w-[80px] text-center text-sm font-medium text-gray-500">
                            결과
                        </div>
                        <div className="w-[90px] text-center text-sm font-medium text-gray-500">
                            메모리
                        </div>
                        <div className="w-[90px] text-center text-sm font-medium text-gray-500">
                            시간
                        </div>
                        <div className="w-[90px] text-center text-sm font-medium text-gray-500">
                            언어
                        </div>
                        <div className="min-w-[150px] flex-[1] text-center text-sm font-medium text-gray-500">
                            알고리즘
                        </div>
                        <div className="w-[100px] text-center text-sm font-medium text-gray-500">
                            AI 점수
                        </div>
                        <div className="w-[80px] text-center text-sm font-medium text-gray-500">
                            제출 시간
                        </div>
                        <div className="w-[80px] text-center text-sm font-medium text-gray-500">
                            코드
                        </div>
                    </div>
                    {/* Rows */}
                    {submissions.map((item: MySubmissionItem) => {
                        const {
                            submissionResponseDto: sub,
                            problemResponseDto: problem,
                            programResponseDto: program,
                        } = item;
                        const aiScoreDisplay = sub.aiScore !== null ? sub.aiScore : null;
                        const aiScoreText =
                            sub.aiScore !== null ? `${sub.aiScore}` : "측정 중";

                        return (
                            <div
                                key={sub.submissionId}
                                className="flex min-h-[56px] w-full flex-row items-center border-b border-gray-50 bg-white py-3 transition-colors last:rounded-b-[12px] hover:bg-gray-50"
                            >
                                {/* Program Name & Badge */}
                                <div
                                    className="w-[140px] flex flex-col items-center justify-center gap-1 px-2 cursor-pointer hover:bg-gray-100 rounded-md py-1 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (program.programType.name === 'PROBLEMSET') {
                                            navigate(`/problemset/${program.id}`);
                                        } else {
                                            navigate(`/group/${program.id}`);
                                        }
                                    }}
                                >
                                    <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                        {getProgramTypeBadgeText(program.programType.name)}
                                    </span>
                                    <span className="truncate w-full text-center text-sm font-medium text-[#333333] hover:text-[#0D6EFD]" title={program.title}>
                                        {program.title}
                                    </span>
                                </div>
                                {/* Problem Name */}
                                <div className="w-[180px] truncate px-2 text-center text-sm font-medium text-[#333333]" title={problem.title}>
                                    {problem.title}
                                </div>
                                <div className="flex w-[80px] justify-center">
                                    <StateBadge hasText={true} isPassed={sub.isSuccess} />
                                </div>
                                <div className="w-[90px] text-center text-sm text-[#666666]">
                                    {sub.memory} KB
                                </div>
                                <div className="w-[90px] text-center text-sm font-medium text-[#E54D2E]">
                                    {sub.execTime} ms
                                </div>
                                <div className="flex w-[90px] justify-center">
                                    {(() => {
                                        const lang = normalizeLanguage(sub.language);
                                        const style = getLanguageBadgeStyle(sub.language);
                                        return (
                                            <div
                                                className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-tight ${style.bg} ${style.text} ${style.border}`}
                                            >
                                                {lang}
                                            </div>
                                        );
                                    })()}
                                </div>
                                {/* Algorithm */}
                                <div className="group relative flex min-w-[150px] flex-[1] cursor-help flex-wrap justify-center gap-1.5 px-2">
                                    {sub.algorithmList?.length > 0 ? (
                                        <>
                                            {sub.algorithmList.slice(0, 2).map((algo) => (
                                                <span
                                                    key={algo.id}
                                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold tracking-tight whitespace-nowrap text-slate-700"
                                                >
                                                    {algo.name}
                                                </span>
                                            ))}
                                            {sub.algorithmList.length > 2 && (
                                                <span className="inline-flex items-center justify-center px-1 text-sm font-medium text-gray-600">
                                                    ...
                                                </span>
                                            )}
                                            <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-[300px] -translate-x-1/2 transform rounded-lg bg-gray-800 p-3 text-xs text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                                                <div className="flex flex-wrap justify-center gap-1.5">
                                                    {sub.algorithmList.map((algo) => (
                                                        <span
                                                            key={algo.id}
                                                            className="inline-flex items-center justify-center rounded-full border border-gray-600 bg-gray-700 px-2.5 py-1 text-[10px] font-medium text-gray-200"
                                                        >
                                                            {algo.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-300">-</span>
                                    )}
                                </div>
                                {/* AI Score */}
                                <div className="group relative flex w-[100px] cursor-help justify-center">
                                    <div
                                        className={`inline-flex w-fit items-center justify-center rounded-md px-2.5 py-1 text-[12px] font-semibold tracking-tight ${getAiScoreBadgeStyle(aiScoreDisplay).bg} ${getAiScoreBadgeStyle(aiScoreDisplay).text}`}
                                    >
                                        {aiScoreText}
                                    </div>
                                    {sub.aiScoreReason && (
                                        <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 transform rounded-lg bg-gray-800 p-3 text-xs text-white opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                                            {sub.aiScoreReason}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="w-[80px] text-center text-sm font-medium text-[#333333]">
                                    {format(new Date(sub.createAt), "MM/dd")}
                                </div>
                                <div className="flex w-[80px] justify-center">
                                    {/* Link to code view - Assuming /review/:submissionId is appropriate used in previous code */}
                                    <button
                                        onClick={() => navigate(`/review/${sub.submissionId}`)}
                                        className="relative flex items-center justify-center text-gray-500 transition-colors hover:text-[#0D6EFD]"
                                        title="코드 보기"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M4 2C3.44772 2 3 2.44772 3 3V15C3 15.5523 3.44772 16 4 16H14C14.5523 16 15 15.5523 15 15V6L10 1H4Z"
                                                stroke="currentColor"
                                                strokeWidth="1.2"
                                                fill="none"
                                            />
                                            <path
                                                d="M10 1V6H15"
                                                stroke="currentColor"
                                                strokeWidth="1.2"
                                                fill="none"
                                            />
                                            <line
                                                x1="5.5"
                                                y1="8"
                                                x2="12.5"
                                                y2="8"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            />
                                            <line
                                                x1="5.5"
                                                y1="10.5"
                                                x2="12.5"
                                                y2="10.5"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            />
                                            <line
                                                x1="5.5"
                                                y1="13"
                                                x2="10.5"
                                                y2="13"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {submissions.length === 0 && (
                        <div className="flex h-[200px] w-full flex-col items-center justify-center gap-2 border-t border-gray-100 text-gray-400">
                            <svg
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 17H15M9 13H15M9 9H13M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <p className="text-sm">제출 내역이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {pageInfo && totalPages > 0 && (
                <div className="mt-auto py-4 w-full flex justify-center">
                    <Pagination
                        pageInfo={pageInfo}
                        currentPage={page}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
