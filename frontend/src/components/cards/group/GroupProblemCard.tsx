import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "../../button/Button";

interface GroupProblemCardProps {
  title: string;
  startDate: string; // 시작일
  endDate: string; // 마감일
  problemLink?: string; // 문제 링크 (있다면)
  onDelete?: () => void; // 삭제 핸들러 (옵션)
  programProblemId?: number;

  // New Difficulty Props
  difficultyViewType: "USER_DIFFICULTY" | "PROBLEM_DIFFICULTY" | string;
  userDifficulty: "Easy" | "Medium" | "Hard" | string;
  problemDifficulty: string; // Tier e.g. "GOLD_1"

  // Statistics
  viewCount: number;
  submissionCount: number;
  solvedCount: number;
  showDates?: boolean;
  canMoreSubmission?: boolean; // 추가 제출 가능 여부
  programId?: number; // 문제집 ID
}

const GroupProblemCard = ({
  title,
  startDate,
  endDate,
  problemLink = "#",
  onDelete,
  programProblemId,
  difficultyViewType,
  userDifficulty,
  problemDifficulty,
  viewCount,
  submissionCount,
  solvedCount,
  showDates = true,
  canMoreSubmission = true,
  programId,
}: GroupProblemCardProps) => {
  const navigate = useNavigate();
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, ".").replace(/\.$/, "");
  };

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // 상태 계산
  let status: "BEFORE" | "PROGRESS" | "ENDED" = "BEFORE";
  if (now < start) status = "BEFORE";
  else if (now >= start && now <= end) status = "PROGRESS";
  else status = "ENDED";

  // 상태 뱃지 스타일
  const getStatusBadgeStyle = (status: "BEFORE" | "PROGRESS" | "ENDED") => {
    switch (status) {
      case "BEFORE":
        return "bg-gray-100 text-gray-600";
      case "PROGRESS":
        return "bg-green-100 text-green-700 font-semibold";
      case "ENDED":
        return "bg-red-100 text-red-600";
    }
  };

  const getStatusText = (status: "BEFORE" | "PROGRESS" | "ENDED") => {
    switch (status) {
      case "BEFORE": return "진행전";
      case "PROGRESS": return "진행중";
      case "ENDED": return "마감";
    }
  };

  // 난이도 뱃지 렌더링
  const renderDifficultyBadge = () => {
    if (difficultyViewType === "PROBLEM_DIFFICULTY") {
      // Problem Difficulty (Tier)
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-medium">
          {problemDifficulty}
        </span>
      );
    } else {
      // User Difficulty (Generic)
      let style = "text-gray-600 bg-gray-50 border border-gray-200";
      const diff = userDifficulty?.toLowerCase();
      if (diff === "easy") style = "text-green-600 bg-green-50 border border-green-200";
      else if (diff === "medium") style = "text-yellow-600 bg-yellow-50 border border-yellow-200";
      else if (diff === "hard") style = "text-red-600 bg-red-50 border border-red-200";

      return (
        <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] ${style}`}>
          {userDifficulty}
        </span>
      );
    }
  };

  const handleCardClick = () => {
    // canMoreSubmission이 false이면 카드 클릭으로 제출 페이지 이동 방지
    if (!canMoreSubmission) {
      return;
    }
    if (programProblemId) {
      navigate(`/code/${programProblemId}`);
    } else {
      window.open(problemLink, "_blank");
    }
  };

  return (
    <div
      className={`group w-full bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${canMoreSubmission ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={handleCardClick}
    >
      {/* Left: Info */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          {showDates && (
            <span className={`px-2 py-0.5 rounded text-[11px] ${getStatusBadgeStyle(status)}`}>
              {getStatusText(status)}
            </span>
          )}

          <h3 className="text-base font-bold text-gray-900 truncate hover:text-primary-main hover:underline">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {/* Date Range */}
          {showDates && (
            <>
              <div className="flex items-center gap-1">
                <span>{formatDate(startDate)}</span>
                <span>~</span>
                <span className={status === 'ENDED' ? 'text-red-500 font-medium' : ''}>{formatDate(endDate)}</span>
              </div>
              <div className="w-[1px] h-3 bg-gray-300"></div>
            </>
          )}

          {/* Difficulty */}
          <div className="flex items-center gap-1">
            <span>난이도:</span>
            {renderDifficultyBadge()}
          </div>

          <div className="w-[1px] h-3 bg-gray-300"></div>

          {/* Statistics */}
          <div className="flex items-center gap-3 text-gray-400">
            <div className="flex items-center gap-1" title="조회수">
              <span className="text-[11px] font-medium">조회</span>
              <span className="text-xs font-semibold text-gray-600">{viewCount}</span>
            </div>
            <div className="flex items-center gap-1" title="제출수">
              <span className="text-[11px] font-medium">제출</span>
              <span className="text-xs font-semibold text-gray-600">{submissionCount}</span>
            </div>
            <div className="flex items-center gap-1" title="정답수">
              <span className="text-[11px] font-medium">정답</span>
              <span className="text-xs font-semibold text-gray-600">{solvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
        {/* Statistics Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (programProblemId) {
              navigate(`/statistics/${programProblemId}`);
            }
          }}
          className="relative flex items-center justify-center text-gray-400 transition-colors hover:text-primary-main p-1.5"
          title="통계 보기"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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

        {status !== 'ENDED' && (
          <>
            <Button
              variant="secondary"
              className={`!h-8 !px-3 !text-xs ${!canMoreSubmission ? 'opacity-60 cursor-pointer' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!canMoreSubmission) {
                  // 비활성화된 버튼 클릭 시 안내 배너 표시
                  setShowAlertBanner(true);
                  // 5초 후 자동으로 닫힘
                  setTimeout(() => {
                    setShowAlertBanner(false);
                  }, 5000);
                  return;
                }
                if (programProblemId) {
                  navigate(`/code/${programProblemId}`);
                } else {
                  window.open(problemLink, "_blank");
                }
              }}
            >
              문제풀기
            </Button>
            {/* 안내 배너 - 화면 상단에 고정 */}
            {mounted && showAlertBanner && createPortal(
              <div
                className="fixed top-0 left-0 right-0 z-[1001] flex items-center justify-center p-4"
                style={{
                  animation: "slideDown 0.3s ease-out",
                }}
              >
                <div className="w-full max-w-2xl bg-amber-50 border-l-4 border-amber-400 rounded-lg shadow-lg p-4 flex items-center gap-3">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-600"
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
                  
                  {/* 메시지 */}
                  <p className="flex-1 text-sm font-medium text-amber-800">
                    문제집의 요구된 리뷰를 작성 후 다른 문제를 제출해주세요!
                  </p>
                  
                  {/* 닫기 버튼 */}
                  <button
                    onClick={() => setShowAlertBanner(false)}
                    className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-amber-100 flex items-center justify-center text-amber-600 hover:text-amber-800 transition-colors"
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
          </>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
            title="삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupProblemCard;