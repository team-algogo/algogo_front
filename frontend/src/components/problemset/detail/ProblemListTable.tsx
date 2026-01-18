import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Problem } from "@type/problemset/problem.d.ts";
import GroupProblemCard from "@components/cards/group/GroupProblemCard";

interface ProblemListTableProps {
  problems: Problem[];
  isLogined?: boolean;
  isAdmin?: boolean; // ADMIN 여부
  onDelete?: (programProblemIds: number[]) => void; // 삭제 핸들러
}

export default function ProblemListTable({
  problems,
  isLogined = true,
  isAdmin = false,
  onDelete,
}: ProblemListTableProps) {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  return (
    <div className="relative min-h-[300px] w-full flex flex-col gap-4">
      {/* Admin Actions Bar */}
      {isAdmin && (
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
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
              className="h-4 w-4 rounded border-gray-300 text-primary-main focus:ring-primary-main cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">전체 선택</span>
          </div>

          {selectedIds.length > 0 && (
            <button
              onClick={() => {
                if (onDelete && selectedIds.length > 0) {
                  onDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700"
            >
              선택 삭제 ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* Problem List */}
      <div className={`w-full flex flex-col gap-4 ${!isLogined ? "pointer-events-none opacity-60 blur-[3px] select-none" : ""}`}>
        {problems.length > 0 ? (
          problems.map((item, index) => {
            const pInfo = item.problemResponseDto || item.problem;
            if (!pInfo) return null;

            return (
              <div
                key={item.programProblemId}
                className="flex items-start gap-3 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
              >
                {/* Admin Checkbox */}
                {isAdmin && (
                  <div className="pt-8 pl-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.programProblemId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, item.programProblemId]);
                        } else {
                          setSelectedIds((prev) => prev.filter((id) => id !== item.programProblemId));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary-main focus:ring-primary-main cursor-pointer"
                    />
                  </div>
                )}

                {/* Problem Card */}
                <div className="flex-1 min-w-0">
                  <GroupProblemCard
                    programProblemId={item.programProblemId}
                    title={pInfo.title}
                    startDate={item.startDate}
                    endDate={item.endDate}
                    problemLink={pInfo.problemLink}
                    difficultyViewType={item.difficultyViewType}
                    userDifficulty={item.userDifficultyType}
                    problemDifficulty={pInfo.difficultyType}
                    viewCount={item.viewCount}
                    submissionCount={item.submissionCount}
                    solvedCount={item.solvedCount}
                    showDates={false}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center border border-dashed border-gray-300 rounded-xl text-sm text-gray-400">
            등록된 문제가 없습니다.
          </div>
        )}
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
              className="rounded-lg bg-primary-main px-6 py-2.5 text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              로그인 하러가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
