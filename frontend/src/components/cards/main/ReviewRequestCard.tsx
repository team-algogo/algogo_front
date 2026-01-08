import type { RequiredCodeReview } from "@api/review/manageReview";
import Badge from "../../badge/Badge";
import { Link } from "react-router-dom";

const ReviewRequestCard = ({
  problemTitle,
  problemPlatform,
  programType,
  programTitle,
  submission,
}: RequiredCodeReview) => {
  return (
    <Link
      to={`review/${submission.targetSubmissionId}`}
      className="hover:bg-grayscale-lighter flex flex-col gap-3 rounded-lg p-4 transition-colors"
    >
      <div className="flex gap-1">
        {programType && <Badge variant="green">{programType}</Badge>}
        {problemPlatform && <Badge variant="orange">{problemPlatform}</Badge>}
      </div>

      {/* 제목 */}
      <div className="text-sm font-medium">
        [{programTitle}] {problemTitle}
      </div>

      {/* 태그 */}
      <div className="text-grayscale-warm-gray flex gap-2 text-xs">
        {submission.algorithmList.map((tag, index) => (
          <span key={index}>#{tag.name}</span>
        ))}
      </div>
    </Link>
  );
};

export default ReviewRequestCard;
