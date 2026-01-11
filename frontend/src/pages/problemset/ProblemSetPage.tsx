import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoryList } from "@api/problemset/getCategoryList";
import { getCheckUser } from "@api/auth/auth";
import { deleteProblemSet } from "@api/problemset/deleteProblemSet";
import ProblemSetList from "@components/problemset/ProblemSetList";
import CustomSelect, {
  type SelectOption,
} from "@components/selectbox/CustomSelect";
import Button from "@components/button/Button";
import useAuthStore from "@store/useAuthStore";
import { useModalStore } from "@store/useModalStore";
import AlertModal from "@components/modal/alarm/AlertModal";
import BasePage from "@pages/BasePage";

export default function ProblemSetPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection] = useState("desc");

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const { data: categoryList } = useQuery({
    queryKey: ["categoryList"],
    queryFn: getCategoryList,
  });

  const { userType } = useAuthStore();
  const isLogined = !!userType;

  // 사용자 정보 조회 (ADMIN 확인용)
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => getCheckUser(),
    enabled: isLogined,
  });

  const tabs = ["전체", ...(categoryList?.map((c) => c.name) || [])];
  const sortOptions: SelectOption[] = [
    { label: "최신순", value: "createdAt" },
    { label: "인기순", value: "popular" },
  ];

  const isAdmin = meData?.data?.userRole === "ADMIN";
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProblemSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problemSets"] });
      closeModal();
      setDeleteTargetId(null);
    },
    onError: (error: any) => {
      console.error("삭제 실패:", error);
      closeModal();
      setDeleteTargetId(null);
    },
  });

  // 수정 핸들러
  const handleEdit = (programId: number) => {
    navigate(`/problemset/${programId}/edit`);
  };

  // 삭제 핸들러
  const handleDelete = (programId: number) => {
    setDeleteTargetId(programId);
    openModal("alert");
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteMutation.mutate(deleteTargetId);
    }
  };

  return (
    <BasePage>
      {/* Layout 통일: 두 번째 페이지(ProblemSetDetailPage) 기준 - max-w-[1200px], p-[40px_0px_80px], gap-8 */}
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
        {/* Header Section - 두 번째 페이지와 동일한 구조: items-end justify-between, border-b border-gray-200 pb-6 */}
        <div className="flex w-full flex-row items-end justify-between border-b border-gray-200 pb-6">
          <div className="flex flex-col gap-2">
            {/* Navigation Button - 두 번째 페이지와 동일한 위치와 스타일 */}
            <div className="mb-1 flex items-center gap-3 text-gray-500">
              <button
                onClick={() => navigate("/")}
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
                메인으로 돌아가기
              </button>
            </div>
            {/* Title - 두 번째 페이지 스타일: text-[28px] font-bold text-[#333333] */}
            <h1 className="text-[28px] font-bold text-[#333333]">문제집</h1>
            {/* Subtitle - 두 번째 페이지 스타일: text-sm font-normal text-gray-500 leading-[130%] */}
            <p className="text-sm leading-[130%] font-normal text-gray-500">
              다양한 알고리즘 문제집을 풀어보세요.
            </p>
          </div>
          {/* ADMIN일 때만 문제집 생성 버튼 표시 */}
          {isAdmin && (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate("/problemset/create")}
            >
              문제집 생성
            </Button>
          )}
        </div>

        {/* Content Section: Tabs + List */}
        <div className="flex w-full flex-col items-start gap-6">
          {/* Controls Row: Category Tabs + Sort Select */}
          <div className="flex w-full flex-row items-center justify-between">
            {/* Tabs Group - 두 번째 페이지 톤으로 스타일 조정 */}
            <div className="no-scrollbar -mb-px flex gap-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`border-b-2 pb-4 text-base font-medium whitespace-nowrap transition-colors ${
                    category === tab
                      ? "border-[#0D6EFD] text-[#0D6EFD]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sort Select - 두 번째 페이지와 동일한 CustomSelect 사용 */}
            <CustomSelect
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>

          {/* List */}
          <div className="w-full">
            <ProblemSetList
              category={category}
              sortBy={sortBy}
              sortDirection={sortDirection}
              keyword=""
              page={page}
              onPageChange={setPage}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteTargetId !== null && (
        <AlertModal.Content autoCloseDelay={0} modalType="alert">
          <div className="mb-4 text-4xl">⚠️</div>
          <AlertModal.Message className="text-lg font-semibold">
            문제집을 삭제하시겠습니까?
          </AlertModal.Message>
          <p className="mt-2 text-sm text-gray-600">
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                closeModal();
                setDeleteTargetId(null);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </AlertModal.Content>
      )}
    </BasePage>
  );
}
