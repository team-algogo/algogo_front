import type { ReceiveReviewProps } from "@api/review/manageReview";
import Badge from "../../badge/Badge";
import { Link } from "react-router-dom";

const ReviewCard = ({
  submissionId,
  problemTitle,
  programType,
  programTitle,
  nickname,
  content,
  modifiedAt,
}: ReceiveReviewProps) => {
  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.`;
    return formatted;
  };

  return (
    <Link
      to={`/review/${submissionId}`}
      className="hover:bg-grayscale-lighter flex flex-col gap-3 rounded-lg p-4 transition-colors"
    >
      {/* 배지 + 코드 제목 */}
      <div className="flex items-center gap-3">
        <Badge variant="green">{programType}</Badge>
        <span className="text-grayscale-warm-gray text-xs">
          [{programTitle}] {problemTitle}
        </span>
      </div>

      {/* 리뷰 내용 */}
      <div className="line-clamp-2 text-sm leading-relaxed">{content}</div>

      {/* 작성자 정보 + 좋아요/댓글 */}
      <div className="flex items-center justify-between">
        <div className="text-grayscale-warm-gray flex items-center gap-2 text-xs">
          <div className="bg-primary-main flex h-6 w-6 items-center justify-center rounded-full text-xs text-white">
            {nickname.charAt(0)}
          </div>
          <span>{nickname}</span>
          <span>·</span>
          <span>작성일 {formatDate(modifiedAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ReviewCard;
