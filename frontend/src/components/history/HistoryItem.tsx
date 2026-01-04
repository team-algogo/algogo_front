import { Link } from "react-router-dom";
import StateBadge from "../badge/StateBadge";

interface HistoryProps {
  submissionId: number;
  isSuccess: boolean;
  createdAt: string;
  language: string;
  execTime: number;
  memory: number;
  isCurrent: boolean;
}

const HistoryItem = ({
  submissionId,
  isSuccess,
  createdAt,
  language,
  execTime,
  memory,
  isCurrent,
}: HistoryProps) => {
  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.`;
    return formatted;
  };

  return (
    <div className="flex gap-1 p-1">
      <div className="flex h-6 items-center">
        <StateBadge hasText={false} isPassed={isSuccess} />
      </div>
      <Link
        to={`/review/${submissionId}`}
        className={`flex cursor-pointer flex-col text-base font-light ${isCurrent ? "text-primary-main" : "text-grayscale-warm-gray hover:text-grayscale-dark-gray"}`}
      >
        <div className="px-3">Submit on {formatDate(createdAt)}</div>
        <div className="flex gap-1 px-3">
          <div>{language}</div>
          <div>·</div>
          <div>{execTime}ms</div>
          <div>·</div>
          <div>{memory}KB</div>
        </div>
      </Link>
    </div>
  );
};

export default HistoryItem;
