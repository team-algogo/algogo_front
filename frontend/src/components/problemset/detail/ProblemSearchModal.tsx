import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProblems } from "@api/problemset/searchProblems";
import LevelBadge from "./LevelBadge";

interface ProblemSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (problemIds: number[]) => void;
  selectedProblemIds?: number[]; // 이미 추가된 문제 ID들 (제외)
}

export default function ProblemSearchModal({
  isOpen,
  onClose,
  onSelect,
  selectedProblemIds = [],
}: ProblemSearchModalProps) {
  const [keyword, setKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 문제 검색
  const { data: searchData, isLoading } = useQuery({
    queryKey: ["problemSearch", keyword],
    queryFn: () => searchProblems(keyword),
    enabled: isOpen && keyword.trim().length > 0,
  });

  const problems = searchData?.problems || [];

  // 이미 추가된 문제는 제외
  const availableProblems = problems.filter(
    (p) => !selectedProblemIds.includes(p.id),
  );

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setKeyword("");
      setSelectedIds([]);
    }
  }, [isOpen]);

  const handleToggleProblem = (problemId: number) => {
    setSelectedIds((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId],
    );
  };

  const handleSelect = () => {
    if (selectedIds.length > 0) {
      onSelect(selectedIds);
      setSelectedIds([]);
      setKeyword("");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="relative flex max-h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-[#333333]">
            문제 검색 및 추가
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="border-b border-gray-200 px-6 py-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="문제 제목을 검색하세요..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD] focus:ring-offset-0 focus:outline-none"
          />
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!keyword.trim() ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              검색어를 입력하세요
            </div>
          ) : isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#0D6EFD]"></div>
            </div>
          ) : availableProblems.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-gray-400">
              검색 결과가 없습니다
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {availableProblems.map((problem) => (
                <label
                  key={problem.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedIds.includes(problem.id)
                      ? "border-[#0D6EFD] bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(problem.id)}
                    onChange={() => handleToggleProblem(problem.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#0D6EFD] focus:ring-[#0D6EFD]"
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <LevelBadge
                      platform={problem.platformType}
                      difficulty={problem.difficultyType}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-[#333333]">
                        {problem.problemNo}. {problem.title}
                      </span>
                      <a
                        href={problem.problemLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-gray-500 hover:text-[#0D6EFD]"
                      >
                        {problem.problemLink}
                      </a>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <span className="text-sm text-gray-600">
            {selectedIds.length > 0
              ? `${selectedIds.length}개 문제 선택됨`
              : "문제를 선택하세요"}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSelect}
              disabled={selectedIds.length === 0}
              className="rounded-lg bg-[#0D6EFD] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0B5ED7] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              추가 ({selectedIds.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
