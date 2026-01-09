import { Link } from "react-router-dom";
import { format } from "date-fns";

interface HistoryProps {
  submissionId: number;
  isSuccess: boolean;
  createdAt: string;
  execTime: number;
  memory: number;
  isCurrent: boolean;
  algorithmList?: { id: number; name: string }[];
}

const HistoryItem = ({
  submissionId,
  isSuccess,
  createdAt,
  execTime,
  memory,
  isCurrent,
  algorithmList = [],
}: HistoryProps) => {
  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  const formatMemory = (memoryKB: number) => {
    if (memoryKB >= 1024) {
      return `${(memoryKB / 1024).toFixed(1)} MB`;
    }
    return `${memoryKB} KB`;
  };

  return (
    <Link
      to={`/review/${submissionId}`}
      className={`group flex flex-col gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
        isCurrent
          ? "border-purple-400/60 bg-gradient-to-br from-purple-50/80 to-purple-50/40 shadow-md"
          : "border-gray-200/60 bg-white shadow-sm hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-md"
      }`}
    >
      {/* Header: Date and Status Badges */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex-shrink-0 text-xs font-semibold text-gray-500">
          {formatDate(createdAt)}
        </span>
        <div className="flex flex-shrink-0 items-center gap-1.5">
          {isCurrent && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 shadow-sm whitespace-nowrap">
              현재
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap ${
              isSuccess
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isSuccess ? "성공" : "실패"}
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="flex items-center gap-4">
        {/* Execution Time */}
        <div className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500"
          >
            <path
              d="M7 1.75C4.10051 1.75 1.75 4.10051 1.75 7C1.75 9.89949 4.10051 12.25 7 12.25C9.89949 12.25 12.25 9.89949 12.25 7C12.25 4.10051 9.89949 1.75 7 1.75ZM7 11.375C4.72233 11.375 2.875 9.52767 2.875 7.25C2.875 4.97233 4.72233 3.125 7 3.125C9.27767 3.125 11.125 4.97233 11.125 7.25C11.125 9.52767 9.27767 11.375 7 11.375Z"
              fill="currentColor"
            />
            <path
              d="M7.4375 4.375H6.5625V7.21875L9.15625 8.53125L9.625 7.78125L7.4375 6.71875V4.375Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-700">
            {execTime} ms
          </span>
        </div>

        {/* Memory */}
        <div className="flex items-center gap-1.5">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-500"
          >
            <path
              d="M2.625 2.625V11.375C2.625 11.8582 3.01675 12.25 3.5 12.25H10.5C10.9832 12.25 11.375 11.8582 11.375 11.375V2.625C11.375 2.14175 10.9832 1.75 10.5 1.75H3.5C3.01675 1.75 2.625 2.14175 2.625 2.625ZM3.5 2.625H10.5V11.375H3.5V2.625Z"
              fill="currentColor"
            />
            <path
              d="M4.375 3.5H9.625V4.375H4.375V3.5ZM4.375 5.25H9.625V6.125H4.375V5.25ZM4.375 7H7.875V7.875H4.375V7Z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-700">
            {formatMemory(memory)}
          </span>
        </div>
      </div>

      {/* Algorithms */}
      {algorithmList.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {algorithmList.map((algo) => (
            <span
              key={algo.id}
              className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm"
            >
              {algo.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default HistoryItem;
