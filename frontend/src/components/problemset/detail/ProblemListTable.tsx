import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Problem } from "@type/problemset/problem.d.ts";
import LevelBadge from "./LevelBadge";

interface ProblemListTableProps {
  problems: Problem[];
  page: number;
  itemsPerPage?: number;
  isLogined?: boolean;
  programId?: number;
  isAdmin?: boolean; // ADMIN 여부
  onDelete?: (programProblemIds: number[]) => void; // 삭제 핸들러
}

export default function ProblemListTable({
  problems,
  page,
  itemsPerPage = 20,
  isLogined = true,
  programId,
  isAdmin = false,
  onDelete,
}: ProblemListTableProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <div className="relative min-h-[300px] w-full">
      {/* Table Content */}
      <div
        className={`w-full transition-all duration-300 ${!isLogined ? "pointer-events-none opacity-60 blur-[3px] select-none" : ""}`}
      >
        {/* Table Card Container */}
        <div className="flex w-full flex-col rounded-[12px] border border-[#F4F4F5]">
          {/* Delete Button Bar (Admin only, shown when items are selected) */}
          {isAdmin && selectedIds.length > 0 && (
            <div className="flex items-center justify-between border-b border-red-200 bg-red-50 px-6 py-3">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.length}개 문제 선택됨
              </span>
              <button
                onClick={() => {
                  if (onDelete && selectedIds.length > 0) {
                    onDelete(selectedIds);
                    setSelectedIds([]);
                  }
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                선택한 문제 삭제
              </button>
            </div>
          )}

          {/* Table Header */}
          <div className="flex h-[50px] w-full flex-row items-center rounded-t-[12px] border-b border-gray-100 bg-[#F9FAFB]">
            {isAdmin && (
              <div className="flex w-[50px] items-center justify-center px-4">
                <input
                  type="checkbox"
                  checked={
                    problems.length > 0 &&
                    selectedIds.length === problems.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(problems.map((p) => p.programProblemId));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-[#0D6EFD] focus:ring-[#0D6EFD]"
                />
              </div>
            )}
            <div className="w-[60px] text-center text-sm font-medium text-gray-500">
              #
            </div>
            <div className="w-[120px] text-center text-sm font-medium text-gray-500">
              난이도
            </div>
            <div className="min-w-[200px] flex-1 px-4 text-left text-sm font-medium text-gray-500">
              제목
            </div>
            <div className="hidden w-[100px] text-center text-sm font-medium text-gray-500 tabular-nums lg:flex lg:items-center lg:justify-center">
              제출 수
            </div>
            <div className="hidden w-[100px] text-center text-sm font-medium text-gray-500 tabular-nums lg:flex lg:items-center lg:justify-center">
              조회 수
            </div>
            <div className="hidden w-[100px] text-center text-sm font-medium text-gray-500 tabular-nums md:flex md:items-center md:justify-center">
              참여자 수
            </div>
            <div className="w-[80px] text-center text-sm font-medium text-gray-500">
              정답률
            </div>
            <div className="w-[80px] text-center text-sm font-medium text-gray-500">
              문제풀기
            </div>
            <div className="w-[80px] text-center text-sm font-medium text-gray-500">
              통계보기
            </div>
          </div>

          {/* Table Rows */}
          {problems.map((item, index) => {
            const pInfo = item.problemResponseDto || item.problem;
            if (!pInfo) return null;

            return (
              <div
                key={item.programProblemId}
                className="flex min-h-[56px] w-full flex-row items-center border-b border-gray-50 bg-white py-3 transition-colors last:rounded-b-[12px] hover:bg-gray-50"
              >
                {isAdmin && (
                  <div className="flex w-[50px] items-center justify-center px-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.programProblemId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [
                            ...prev,
                            item.programProblemId,
                          ]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== item.programProblemId),
                          );
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-gray-300 text-[#0D6EFD] focus:ring-[#0D6EFD]"
                    />
                  </div>
                )}
                <div className="w-[60px] text-center text-sm font-medium text-[#333333]">
                  {(page - 1) * itemsPerPage + index + 1}
                </div>
                <div className="flex w-[120px] justify-center">
                  <LevelBadge
                    platform={pInfo.platformType}
                    difficulty={pInfo.difficultyType}
                  />
                </div>
                <div className="min-w-[200px] flex-1 truncate px-4 text-left text-sm font-medium text-[#333333]">
                  {pInfo.title}
                </div>
                <div className="hidden w-[100px] text-center text-sm font-medium text-[#333333] tabular-nums lg:flex lg:items-center lg:justify-center">
                  {item.submissionCount.toLocaleString()}
                </div>
                <div className="hidden w-[100px] text-center text-sm font-medium text-[#333333] tabular-nums lg:flex lg:items-center lg:justify-center">
                  {item.viewCount.toLocaleString()}
                </div>
                <div className="hidden w-[100px] text-center text-sm font-medium text-[#333333] tabular-nums md:flex md:items-center md:justify-center">
                  {item.participantCount.toLocaleString()}
                </div>
                <div className="w-[80px] text-center text-sm text-[#666666]">
                  {item.submissionCount > 0
                    ? Math.round(
                        (item.solvedCount / item.submissionCount) * 100,
                      )
                    : 0}
                  %
                </div>
                <div className="flex w-[80px] justify-center">
                  <button
                    onClick={() => navigate(`/code/${item.programProblemId}`)}
                    className="flex items-center justify-center rounded-lg bg-[#0D6EFD] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#0B5ED7] hover:shadow-md active:bg-[#0A56C2] active:shadow-sm"
                  >
                    이동
                  </button>
                </div>
                <div className="flex w-[80px] justify-center">
                  <button
                    onClick={() =>
                      navigate(
                        `/statistics/${item.programProblemId}${programId ? `?programId=${programId}` : ""}`,
                      )
                    }
                    className="relative flex items-center justify-center text-gray-500 transition-colors hover:text-[#0D6EFD]"
                    title="통계 보기"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Chart/Graph icon */}
                      <path
                        d="M2 14H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M3 14V10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 14V7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M11 14V5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M15 14V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
          {problems.length === 0 && (
            <div className="flex h-[200px] w-full items-center justify-center rounded-b-[12px] text-sm text-gray-400">
              등록된 문제가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Login Required Overlay */}
      {!isLogined && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-8">
            <p className="text-[16px] font-medium text-[#333]">
              로그인이 필요한 서비스입니다.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-[#0D6EFD] px-6 py-2.5 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-[#0b5ed7]"
            >
              로그인 하러가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
