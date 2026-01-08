import Button from "../../button/Button";

interface GroupProblemCardProps {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string; // 난이도
  addedAt: string; // 추가일
  solvedCount: number; // 푼 사람 수
  totalMembers: number; // 전체 멤버 수
  problemLink?: string; // 문제 링크 (있다면)
  onDelete?: () => void; // 삭제 핸들러 (옵션)
}

const GroupProblemCard = ({
  title,
  difficulty,
  addedAt,
  solvedCount,
  totalMembers,
  problemLink = "#",
  onDelete,
}: GroupProblemCardProps) => {

  // 난이도별 뱃지 스타일
  // 난이도별 뱃지 스타일 (심플/테크니컬 버전)
  const getBadgeStyle = (diff: string | undefined) => {
    if (!diff) return "text-gray-600 bg-gray-50 border border-gray-200";

    switch (diff.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50 border border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border border-yellow-200";
      case "hard":
      case "high":
        return "text-red-600 bg-red-50 border border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border border-gray-200";
    }
  };

  const formattedDate = new Date(addedAt).toLocaleDateString("ko-KR");

  return (
    <div
      className="w-full border-b border-gray-200 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-default px-2"
      onClick={() => window.open(problemLink, "_blank")}
    >
      {/* Left: Check/Status info could go here if needed */}

      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span
          className={`px-2 py-[2px] rounded text-[10px] font-bold uppercase tracking-wide ${getBadgeStyle(
            difficulty
          )}`}
        >
          {difficulty}
        </span>

        <h3 className="text-sm font-medium text-gray-900 truncate flex-1 hover:text-primary-main hover:underline cursor-pointer">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-500 shrink-0 ml-4">
        <div className="flex items-center gap-1.5 w-24 justify-end">
          <span>해결</span>
          <span className="font-bold text-gray-700">{solvedCount} / {totalMembers}</span>
        </div>
        <span className="text-gray-400 w-20 text-right">{formattedDate}</span>

        {/* Actions */}
        <div className="flex items-center gap-2 w-auto justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            className="!h-7 !px-2.5 !text-xs !border-gray-300"
            onClick={() => window.open(problemLink, "_blank")}
          >
            문제풀기
          </Button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupProblemCard;