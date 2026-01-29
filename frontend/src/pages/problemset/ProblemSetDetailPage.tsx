import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CustomSelect, {
  type SelectOption,
} from "@components/selectbox/CustomSelect";
import { getProblemSetDetail } from "@api/problemset/getProblemSetDetail";
import { getProblemSetProblems } from "@api/problemset/getProblemSetProblems";
import { getCheckUser } from "@api/auth/auth";
import { addProblems } from "@api/problemset/addProblems";
import { removeProblems } from "@api/problemset/removeProblems";
import { getCanMoreSubmission } from "@api/submissions/getCanMoreSubmission";
import ProblemSetDetailHeader from "@components/problemset/detail/ProblemSetDetailHeader";
import ProblemListTable from "@components/problemset/detail/ProblemListTable";
import ProblemSearchModal from "@components/problemset/detail/ProblemSearchModal";
import Pagination from "@components/pagination/Pagination";
import Button from "@components/button/Button";
import useAuthStore from "@store/useAuthStore";
import BasePage from "@pages/BasePage";

export default function ProblemSetDetailPage() {
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);
  const navigate = useNavigate();

  // Pagination State - Read from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortOptions: SelectOption[] = [
    { label: "최신순", value: "startDate" },
    { label: "참여자순", value: "participantCount" },
    { label: "제출순", value: "submissionCount" },
    { label: "정답순", value: "solvedCount" },
  ];

  const { data: detail } = useQuery({
    queryKey: ["problemSetDetail", id],
    queryFn: () => getProblemSetDetail(id),
    enabled: !isNaN(id),
  });

  const { data: problemsData, isLoading: isProblemsLoading } = useQuery({
    queryKey: ["problemSetProblems", id, page, sortBy, sortDirection],
    queryFn: () => getProblemSetProblems(id, page, 10, sortBy, sortDirection),
    enabled: !isNaN(id),
  });

  const problems = problemsData?.problemList || [];
  const pageInfo = problemsData?.page;
  const totalPages = pageInfo?.totalPages || 1;
  const { userType } = useAuthStore();
  const isLogined = !!userType;

  // 추가 제출 가능 여부 조회
  const { data: canMoreSubmissionData } = useQuery({
    queryKey: ["canMoreSubmission", id],
    queryFn: () => getCanMoreSubmission(id),
    enabled: !isNaN(id) && isLogined,
  });

  useEffect(() => {
    if (!isLogined) {
      navigate("/intro", { state: { requireLogin: true } });
    }
  }, [isLogined, navigate]);

  // Scroll to top when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params, { replace: true });
    window.scrollTo(0, 0);
  }, [page]);

  const canMoreSubmission = canMoreSubmissionData?.canMoreSubmission ?? true;

  // 사용자 정보 조회 (ADMIN 확인용)
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => getCheckUser(),
    enabled: isLogined,
  });

  const isAdmin = meData?.data?.userRole === "ADMIN";
  const queryClient = useQueryClient();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [existingProblemIds, setExistingProblemIds] = useState<number[]>([]);

  // 기존 문제 ID 수집 (이미 추가된 문제는 검색 결과에서 제외)
  useEffect(() => {
    if (problems && problems.length > 0) {
      // Problem 타입의 problemResponseDto 또는 problem에서 id를 추출
      const ids = problems
        .map((p) => p.problemResponseDto?.id || p.problem?.id)
        .filter((id): id is number => id !== undefined);
      setExistingProblemIds(ids);
    }
  }, [problems]);

  // 문제 추가 mutation
  const addProblemsMutation = useMutation({
    mutationFn: (problemIds: number[]) => addProblems(id, problemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["problemSetProblems", id],
      });
      setIsSearchModalOpen(false);
    },
    onError: (error: any) => {
      console.error("문제 추가 실패:", error);
    },
  });

  // 문제 삭제 mutation
  const removeProblemsMutation = useMutation({
    mutationFn: (programProblemIds: number[]) =>
      removeProblems(id, programProblemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["problemSetProblems", id],
      });
    },
    onError: (error: any) => {
      console.error("문제 삭제 실패:", error);
    },
  });

  const handleAddProblems = (problemIds: number[]) => {
    addProblemsMutation.mutate(problemIds);
  };

  const handleDeleteProblems = (programProblemIds: number[]) => {
    if (
      window.confirm(
        `선택한 ${programProblemIds.length}개 문제를 삭제하시겠습니까?`,
      )
    ) {
      removeProblemsMutation.mutate(programProblemIds);
    }
  };

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSortToggle = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <BasePage>
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
        {/* Header Section */}
        {detail && (
          <div className="flex w-full flex-row items-end justify-between border-b border-gray-200 pb-6">
            <div className="flex flex-col gap-2">
              <div className="mb-1 flex items-center gap-3 text-gray-500">
                <button
                  onClick={() => navigate("/problemset")}
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
                  다른 문제집 살펴보기
                </button>
              </div>
              <ProblemSetDetailHeader
                title={detail.title}
                description={detail.description}
                categories={detail.categories}
              />
            </div>
            {/* ADMIN일 때만 문제 추가 버튼 표시 */}
            {isAdmin && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsSearchModalOpen(true)}
              >
                문제 추가
              </Button>
            )}
          </div>
        )}

        {/* Content Section: Table + Controls */}
        <div className="flex w-full flex-col items-start gap-6">
          {/* Controls Header */}
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="text-lg font-bold text-[#333333]">문제 리스트</h2>

            <div className="flex flex-row items-center gap-2">
              {/* Sort Controls */}
              <CustomSelect
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
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

          {/* Table */}
          <ProblemListTable
            problems={problems}
            isLogined={isLogined}
            isAdmin={isAdmin}
            onDelete={handleDeleteProblems}
            canMoreSubmission={canMoreSubmission}
            programId={id}
            programTitle={detail?.title ?? ""}
            isLoading={isProblemsLoading}
          />

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

      {/* 문제 검색 모달 */}
      <ProblemSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleAddProblems}
        selectedProblemIds={existingProblemIds}
      />
    </BasePage>
  );
}
