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
  const getBadgeStyle = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-grayscale-dark-gray text-white";
      case "medium":
        return "bg-grayscale-warm-gray text-white"; // 예시 색상
      case "hard":
      case "high":
        return "bg-primary-main text-white";
      default:
        return "bg-grayscale-default text-grayscale-dark-gray";
    }
  };

  const formattedDate = new Date(addedAt).toLocaleDateString("ko-KR");

  return (
    <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl p-5 flex justify-between items-center hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // 카드 클릭 이벤트 전파 방지 (혹시 있다면)
                onDelete();
              }}
              className="text-gray-300 hover:text-red-500 transition-colors"
              title="문제 삭제"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          <h3 className="font-headline text-lg text-grayscale-dark-gray">
            {title}
          </h3>

          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${getBadgeStyle(
              difficulty
            )}`}
          >
            {difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-grayscale-warm-gray">
          <span>추가일: {formattedDate}</span>
          <span className="w-[1px] h-3 bg-grayscale-warm-gray opacity-50"></span>
          <span>
            해결: {solvedCount} / {totalMembers}명
          </span>
        </div>
      </div>

      <div>
        <Button
          variant="primary"
          className="!h-9 !px-4 text-sm" // 버튼 크기 살짝 작게 조절
          onClick={() => window.open(problemLink, "_blank")}
        >
          <span className="mr-1">&lt;&gt;</span> 풀기
        </Button>
      </div>
    </div>
  );
};

export default GroupProblemCard;