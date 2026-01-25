import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Pagination from "@components/pagination/Pagination";
import StateBadge from "@components/badge/StateBadge";
import CustomSelect, {
  type SelectOption,
} from "@components/selectbox/CustomSelect";
import {
  getProblemStatistics,
  getProblemSubmissionStats,
} from "@api/problemset/getProblemStatistics";
import { getProblemInfo } from "@api/code/codeSubmit";
import { getRequireReview } from "@api/review/manageReview";
import { getCanMoreSubmission } from "@api/submissions/getCanMoreSubmission";
import useAuthStore from "@store/useAuthStore";
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
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  const itemsPerPage = 20;
  const { userType } = useAuthStore();
  const isLogined = !!userType;

  useEffect(() => {
    if (!isLogined) {
      navigate("/intro", { state: { requireLogin: true } });
    }
  }, [isLogined, navigate]);

  // localStorage에서 programId 가져오기
  const getCachedProgramId = () => {
    if (!programProblemId) return null;
    const cachedProgramId = localStorage.getItem(
      `problemSetProgramId_${programProblemId}`,
    );
    return cachedProgramId ? Number(cachedProgramId) : null;
  };

  // localStorage에서 statistics용 programId 가져오기
  const getStatisticsProgramId = () => {
    if (!programProblemId) return null;
    const cachedProgramId = localStorage.getItem(
      `statisticsProgramId_${programProblemId}`,
    );
    return cachedProgramId ? Number(cachedProgramId) : null;
  };

  // Language options
  const languageOptions: SelectOption[] = [
    { label: "모든 언어", value: "" },
    { label: "Java", value: "Java" },
    { label: "Python", value: "Python" },
    { label: "C++", value: "C++" },
  ];

  // Sort options
  const sortOptions: SelectOption[] = [
    { label: "최신순", value: "createdAt" },
    { label: "실행 시간", value: "execTime" },
    { label: "메모리", value: "memory" },
  ];

  const { data: problemInfo } = useQuery({
    queryKey: ["problemInfo", programProblemId],
    queryFn: () => getProblemInfo(programProblemId!),
    enabled: !!programProblemId,
  });

  const { data: statisticsData } = useQuery({
    queryKey: [
      "problemStatistics",
      id,
      page,
      keyword,
      language,
      isSuccess,
      sortBy,
      sortDirection,
    ],
    queryFn: () =>
      getProblemStatistics(id, {
        page: page - 1,
        size: itemsPerPage,
        nickname: keyword || undefined,
        language: language || undefined,
        isSuccess: isSuccess !== undefined ? isSuccess : undefined,
        sortBy: sortBy || undefined,
        sortDirection: sortDirection || undefined,
      }),
    enabled: !isNaN(id),
  });

  // Fetch required reviews
  const { data: requiredReviewsData } = useQuery({
    queryKey: ["requiredReviews"],
    queryFn: () => getRequireReview(),
  });

  const requiredSubmissionIds = new Set(
    requiredReviewsData?.data?.requiredCodeReviews?.map(
      (review) => review.submission.targetSubmissionId,
    ) || [],
  );

  // Fetch submission stats
  const { data: submissionStats } = useQuery({
    queryKey: ["problemSubmissionStats", id],
    queryFn: () => getProblemSubmissionStats(id),
    enabled: !isNaN(id),
  });

  // Get programId from localStorage (쿼리 파라미터 대신)
  const statisticsProgramId = getStatisticsProgramId();

  // Check if more submissions are allowed
  const { data: canMoreSubmissionData } = useQuery({
    queryKey: ["canMoreSubmission", statisticsProgramId],
    queryFn: () => getCanMoreSubmission(Number(statisticsProgramId!)),
    enabled: !!statisticsProgramId,
  });

  const canMoreSubmission = canMoreSubmissionData?.canMoreSubmission ?? true;

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

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
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 언어를 정규화하여 일관된 형식으로 표시
  const normalizeLanguage = (lang: string): string => {
    if (!lang) return "";
    const normalized = lang.toLowerCase();
    // 더 구체적인 언어를 먼저 체크 (JavaScript가 Java보다 먼저)
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
    // 첫 글자만 대문자로 변환 후 대문자로
    return lang.toUpperCase();
  };

  // AI 점수별 뱃지 스타일 가져오기
  const getAiScoreBadgeStyle = (score: number | null) => {
    if (score === null) {
      // 측정 중
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        border: "border-gray-200",
      };
    }

    if (score < 60) {
      // 낮음 (0-60) - 노란색/크림색
      return {
        bg: "bg-yellow-50",
        text: "text-yellow-800",
        border: "border-yellow-200",
      };
    } else if (score < 80) {
      // 중간 (60-80) - 파란색/라벤더
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        border: "border-indigo-200",
      };
    } else {
      // 높음 (80-100) - 초록색
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
      };
    }
  };

  // 언어별 테마 색상 스타일 가져오기 (플랫폼 디자인 시스템에 맞춤 - LevelBadge, CategoryBadge 스타일 참고)
  const getLanguageBadgeStyle = (lang: string) => {
    const normalized = normalizeLanguage(lang);

    // 플랫폼의 다른 뱃지들과 일관성 유지: 연한 배경 + 진한 텍스트
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

  return (
    <BasePage>
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
        {/* Header */}
        <div className="flex w-full flex-row items-end justify-between border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            <div className="mb-1 flex items-center gap-3 text-gray-500">
              <button
                onClick={() => {
                  const cachedProgramId = getCachedProgramId();
                  if (cachedProgramId) {
                    navigate(`/problemset/${cachedProgramId}`);
                  } else {
                    // 캐시된 programId가 없으면 뒤로가기
                    navigate(-1);
                  }
                }}
                className="flex items-center gap-1 text-sm transition-colors hover:text-[#333333]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                문제집으로 돌아가기
              </button>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-[28px] leading-tight font-bold text-[#333333]">
                {problemInfo?.problemNo}. {problemInfo?.title}
              </h1>
              {/* 플랫폼 정보 - 문제 제목 바로 옆 */}
              {problemInfo?.platformType && (
                <span className="inline-flex items-center justify-center rounded-[4px] border border-[#d0d7de] bg-[#eff1f3] px-1.5 py-0.5 text-[11px] font-semibold text-[#1f2328]">
                  {problemInfo.platformType}
                </span>
              )}
              
              {/* Difficulty Badge */}
              {problemInfo && (() => {
                 const { difficultyViewType, difficultyType, userDifficultyType } = problemInfo;
                  if (difficultyViewType === "PROBLEM_DIFFICULTY") {
                    return (
                      <span className="inline-flex items-center justify-center rounded-[4px] border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-600">
                        {difficultyType}
                      </span>
                    );
                  } else {
                    let style = "text-gray-600 bg-gray-50 border border-gray-200";
                    const diff = userDifficultyType?.toLowerCase();
                    if (diff === "easy") style = "text-green-600 bg-green-50 border border-green-200";
                    else if (diff === "medium") style = "text-yellow-600 bg-yellow-50 border border-yellow-200";
                    else if (diff === "hard") style = "text-red-600 bg-red-50 border border-red-200";
                    return (
                      <span className={`inline-flex items-center justify-center rounded-[4px] border px-1.5 py-0.5 text-[11px] font-semibold ${style}`}>
                        {userDifficultyType}
                      </span>
                    );
                  }
              })()}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Secondary Button - 문제 원본 보기 */}
            <button
              onClick={() => window.open(problemInfo?.problemLink, "_blank")}
              className="flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100"
            >
              문제 보기
            </button>
            {/* Primary Button - 문제 풀러 가기 */}
            <button
              onClick={() => {
                if (!canMoreSubmission) {
                  setShowAlertBanner(true);
                  setTimeout(() => {
                    setShowAlertBanner(false);
                  }, 5000);
                  return;
                }
                navigate(`/code/${programProblemId}`);
              }}
              className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 ${
                !canMoreSubmission
                  ? "bg-gray-100 text-gray-400 cursor-pointer opacity-60"
                  : "bg-[#0D6EFD] text-white hover:bg-[#0B5ED7] hover:shadow-md active:bg-[#0A56C2] active:shadow-sm"
              }`}
            >
              문제 풀기
            </button>
          </div>
        </div>

        {/* Top Statistics Bar */}
        <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-6 px-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-500">전체 제출</span>
            <span className="text-2xl font-bold text-[#333333]">
              {submissionStats?.submissionCount.toLocaleString() || "-"}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-500">정답 제출</span>
            <span className="text-2xl font-bold text-[#333333]">
              {submissionStats?.successCount.toLocaleString() || "-"}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-500">오답 제출</span>
            <span className="text-2xl font-bold text-[#333333]">
              {submissionStats?.failureCount.toLocaleString() || "-"}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-gray-200"></div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-500">정답률</span>
            <span className="text-2xl font-bold text-[#0D6EFD]">
              {submissionStats?.successRate !== undefined
                ? `${submissionStats.successRate}%`
                : "- %"}
            </span>
          </div>
        </div>

        {/* Main Content: Full Width Table */}
        <div className="flex w-full flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-[#F9FAFB] p-4">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Result Filter */}
                <div className="flex h-[36px] items-center gap-2 rounded-lg bg-gray-100 px-1">
                  <button
                    onClick={() => {
                      setIsSuccess(undefined);
                      setPage(1);
                    }}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isSuccess === undefined ? "bg-white text-[#333333] shadow-sm" : "text-gray-600 hover:text-[#333333]"}`}
                  >
                    전체
                    {isSuccess === undefined && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-200 px-1.5 text-[11px] font-medium text-gray-600">
                        {totalSubmissions}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsSuccess(true);
                      setPage(1);
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isSuccess === true ? "bg-white text-[#333333] shadow-sm" : "text-gray-600 hover:text-[#333333]"}`}
                  >
                    성공
                  </button>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setPage(1);
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${isSuccess === false ? "bg-white text-[#333333] shadow-sm" : "text-gray-600 hover:text-[#333333]"}`}
                  >
                    실패
                  </button>
                </div>

                {/* Language Filter */}
                <CustomSelect
                  value={language}
                  onChange={(value) => {
                    setLanguage(value);
                    setPage(1);
                  }}
                  options={languageOptions}
                  placeholder="모든 언어"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <CustomSelect
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setPage(1);
                  }}
                  options={sortOptions}
                />
                <button
                  onClick={handleSortToggle}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-lg bg-gray-100 transition-colors hover:bg-gray-200"
                  title={sortDirection === "asc" ? "오름차순" : "내림차순"}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`transform transition-transform duration-200 ${sortDirection === "asc" ? "rotate-180" : ""}`}
                  >
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
                className="h-[40px] w-full rounded border border-gray-200 bg-white pr-4 pl-10 text-sm transition-colors focus:border-blue-500 focus:outline-none"
              />
              <svg
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M11.7422 10.3439C12.5329 9.2673 13 7.9382 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13C7.93858 13 9.26801 12.5327 10.3448 11.7415L10.3439 11.7422C10.3734 11.7822 10.4062 11.8204 10.4424 11.8566L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L11.8566 10.4424C11.8204 10.4062 11.7822 10.3734 11.7422 10.3439ZM11 6.5C11 8.98528 8.98528 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5Z"
                  fill="currentColor"
                />
              </svg>
            </form>
          </div>

          <div className="flex w-full flex-col rounded-[12px] border border-[#F4F4F5]">
            {" "}
            {/* Removed overflow-hidden to allow tooltips */}
            {/* Table Header */}
            <div className="flex h-[50px] w-full flex-row items-center rounded-t-[12px] border-b border-gray-100 bg-[#F9FAFB]">
              <div className="w-[80px] text-center text-sm font-medium text-gray-500">
                순위
              </div>
              <div className="w-[160px] text-center text-sm font-medium text-gray-500">
                사용자
              </div>
              <div className="w-[100px] text-center text-sm font-medium text-gray-500">
                결과
              </div>
              <div className="w-[100px] text-center text-sm font-medium text-gray-500">
                메모리
              </div>
              <div className="w-[100px] text-center text-sm font-medium text-gray-500">
                시간
              </div>
              <div className="w-[100px] text-center text-sm font-medium text-gray-500">
                언어
              </div>
              <div className="min-w-[200px] flex-[2] text-center text-sm font-medium text-gray-500">
                알고리즘
              </div>
              <div className="w-[120px] text-center text-sm font-medium text-gray-500">
                AI 점수
              </div>
              <div className="w-[80px] text-center text-sm font-medium text-gray-500">
                제출 시간
              </div>
              <div className="w-[120px] text-center text-sm font-medium text-gray-500">
                코드
              </div>
            </div>
            {/* Rows */}
            {submissions.map((item: SubmissionItem, index: number) => {
              const rank = (page - 1) * itemsPerPage + index + 1;
              const {
                userSimpleResponseDto: user,
                submissionResponseDto: sub,
              } = item;
              const aiScoreDisplay = sub.aiScore !== null ? sub.aiScore : null;
              const aiScoreText =
                sub.aiScore !== null ? `${sub.aiScore}` : "측정 중";

              return (
                <div
                  key={sub.submissionId}
                  className="flex min-h-[56px] w-full flex-row items-center border-b border-gray-50 bg-white py-3 transition-colors last:rounded-b-[12px] hover:bg-gray-50"
                >
                  <div className="w-[80px] text-center text-sm font-medium text-[#333333]">
                    {rank}
                  </div>
                  <div className="w-[160px] truncate px-2 text-center text-sm font-medium text-[#333333]">
                    {user.nickname}
                  </div>
                  <div className="flex w-[100px] justify-center">
                    <StateBadge hasText={true} isPassed={sub.isSuccess} />
                  </div>
                  <div className="w-[100px] text-center text-sm text-[#666666]">
                    {sub.memory} KB
                  </div>
                  <div className="w-[100px] text-center text-sm font-medium text-[#E54D2E]">
                    {sub.execTime} ms
                  </div>
                  <div className="flex w-[100px] justify-center">
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
                  <div className="group relative flex min-w-[200px] flex-[2] cursor-help flex-wrap justify-center gap-1.5 px-2">
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
                        {/* Tooltip for Algorithm - Show all algorithms on hover */}
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
                  <div className="group relative flex w-[120px] cursor-help justify-center">
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
                  <div className="flex w-[120px] justify-center">
                    <button
                      onClick={() => navigate(`/review/${sub.submissionId}`)}
                      className="relative flex items-center justify-center text-gray-500 transition-colors hover:text-[#0D6EFD]"
                      title="리뷰 보기"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Document icon with folded corner */}
                        <path
                          d="M4 2C3.44772 2 3 2.44772 3 3V15C3 15.5523 3.44772 16 4 16H14C14.5523 16 15 15.5523 15 15V6L10 1H4Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        {/* Folded corner */}
                        <path
                          d="M10 1V6H15"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          fill="none"
                        />
                        {/* Three horizontal lines */}
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
                      {/* Red dot indicator for required reviews */}
                      {requiredSubmissionIds.has(sub.submissionId) && (
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
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

      {/* Alert Banner - Fixed at top */}
      {mounted && showAlertBanner && createPortal(
        <div
          className="fixed top-0 left-0 right-0 z-[1001] flex items-center justify-center p-4"
          style={{
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <div className="w-full max-w-[500px] bg-white border border-amber-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 flex items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Message */}
            <div className="flex-1 flex flex-col">
              <p className="text-sm font-bold text-gray-900 break-keep">
                {problemInfo?.title || "문제"}의 필수 리뷰를 작성 후 새로운 제출을 해주세요!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAlertBanner(false)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>,
        document.body
      )}
    </BasePage>
  );
}
