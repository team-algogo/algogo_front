import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import HistoryAlgorithmPopover from "./HistoryAlgorithmPopover";

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
  const [showPopover, setShowPopover] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (algorithmList.length > 0) {
      setShowPopover(true);
    }
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPopover(false);
    }, 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (algorithmList.length > 0) {
      setShowPopover(!showPopover);
    }
  };

  return (
    <>
      <div className="relative">
        <Link
          to={`/review/${submissionId}`}
          className={`group flex flex-col gap-2.5 rounded-lg border bg-white px-3.5 py-3 transition-all ${
            isCurrent
              ? "border-[#0969da]/40 bg-[#f0f7ff] shadow-sm"
              : "border-[#e1e4e8] hover:border-[#d0d7de] hover:shadow-sm"
          }`}
        >
          {/* Header: Date and Status Badges */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-[#1f2328]">
              {formatDate(createdAt)}
            </span>
            <div className="flex flex-shrink-0 items-center gap-1.5">
              {isCurrent && (
                <span className="inline-flex items-center rounded-md border border-[#0969da]/30 bg-[#e6f6ff] px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-[#0969da]">
                  Current
                </span>
              )}
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${
                  isSuccess
                    ? "border-[#1a7f37]/30 bg-[#dafbe1] text-[#1a7f37]"
                    : "border-[#cf222e]/30 bg-[#ffebe9] text-[#cf222e]"
                }`}
              >
                {isSuccess ? "Success" : "Failed"}
              </span>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="flex items-center gap-3 text-sm text-[#656d76]">
            {/* Execution Time */}
            <div className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#656d76]"
              >
                <path
                  d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM8 13C5.24 13 3 10.76 3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13Z"
                  fill="currentColor"
                />
                <path
                  d="M8.5 4.5V8.5L11 10.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{execTime} ms</span>
            </div>

            {/* Memory */}
            <div className="flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[#656d76]"
              >
                <path
                  d="M2 2.5H14C14.2761 2.5 14.5 2.72386 14.5 3V13C14.5 13.2761 14.2761 13.5 14 13.5H2C1.72386 13.5 1.5 13.2761 1.5 13V3C1.5 2.72386 1.72386 2.5 2 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 3.5H13V4.5H3V3.5ZM3 5.5H13V6.5H3V5.5ZM3 7.5H9V8.5H3V7.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>{formatMemory(memory)}</span>
            </div>

            {/* 알고리즘 버튼 */}
            {algorithmList.length > 0 && (
              <button
                ref={triggerRef}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="ml-auto flex items-center gap-1 text-[12px] font-medium text-[#656d76] transition-colors hover:text-[#1f2328]"
                type="button"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-[#656d76]"
                >
                  <path
                    d="M3 3.5H13C13.2761 3.5 13.5 3.72386 13.5 4V12C13.5 12.2761 13.2761 12.5 13 12.5H3C2.72386 12.5 2.5 12.2761 2.5 12V4C2.5 3.72386 2.72386 3.5 3 3.5Z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 6.5H10.5M5.5 8.5H10.5M5.5 10.5H8.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
                <span>알고리즘 ({algorithmList.length})</span>
              </button>
            )}
          </div>
        </Link>
      </div>

      {/* Portal 기반 Popover */}
      {algorithmList.length > 0 && (
        <HistoryAlgorithmPopover
          algorithms={algorithmList}
          triggerElement={triggerRef.current}
          isOpen={showPopover}
          onClose={() => setShowPopover(false)}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default HistoryItem;
