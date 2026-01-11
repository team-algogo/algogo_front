import { type FC, useState } from "react";

interface CommentInputProps {
  initSelectedLine: () => void;
  onReset?: () => void;
  onSubmit: (content: string) => void;
  selectedLine: number | null;
  placeholder?: string;
  compact?: boolean;
  initialContent?: string;
}

const CommentInput: FC<CommentInputProps> = ({
  initSelectedLine,
  onReset,
  onSubmit,
  selectedLine,
  placeholder = "리뷰를 입력해주세요",
  compact = false,
  initialContent = "",
}) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = () => {
    if (!content) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <div
      className={`flex flex-col gap-4 ${compact ? "bg-white p-3" : "bg-white p-5"} rounded-lg border border-gray-200 shadow-sm transition-all`}
    >
      {!compact && (
        <label className="text-sm font-semibold text-gray-900">Write</label>
      )}

      <div
        className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 ${compact ? "" : "shadow-sm"}`}
      >
        {!compact && (
          <>
            <button
              onClick={initSelectedLine}
              className="group inline-flex items-center gap-2 rounded-lg border border-blue-300/60 bg-gradient-to-br from-blue-50 to-indigo-50/50 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-400 hover:from-blue-100 hover:to-indigo-100/50 hover:shadow-md active:scale-[0.98]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 text-blue-600"
              >
                <path
                  d="M3 2.5C2.72386 2.5 2.5 2.72386 2.5 3V11C2.5 11.2761 2.72386 11.5 3 11.5H11C11.2761 11.5 11.5 11.2761 11.5 11V5L7.5 1H3Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M7.5 1V5H11.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.5 6.5H9.5M4.5 8.5H9.5M4.5 10.5H7.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-semibold tracking-tight">
                {selectedLine ? `${selectedLine}번 줄` : "전체 리뷰"}
              </span>
            </button>
            <div className="h-5 w-px bg-gray-200"></div>
          </>
        )}
        <textarea
          placeholder={placeholder}
          className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
          autoFocus={compact}
          rows={compact ? 2 : 4}
        />
      </div>

      <div className="flex justify-end gap-2.5">
        {compact ? (
          <button
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
            onClick={onReset}
          >
            작성취소
          </button>
        ) : (
          <button
            className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setContent("")}
          >
            작성취소
          </button>
        )}

        <button
          className="flex items-center justify-center rounded-lg bg-[#0D6EFD] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0B5ED7] hover:shadow-md active:bg-[#0A56C2] active:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          작성하기
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
