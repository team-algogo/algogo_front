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
      className={`flex flex-col gap-3 ${compact ? "bg-grayscale-default p-3" : "bg-gray-50 p-4"} rounded-lg border border-gray-200 transition-colors`}
    >
      {!compact && (
        <label className="text-sm font-bold text-gray-900">Write</label>
      )}

      <div
        className={`flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 ${compact ? "focus-within:border-primary-main focus-within:ring-1 focus-within:ring-sky-200" : ""}`}
      >
        {!compact && (
          <>
            <button
              onClick={initSelectedLine}
              className="text-primary-300 rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap"
            >
              &lt;/&gt; {selectedLine ? `${selectedLine}번 줄` : "전체 리뷰"}
            </button>
            <div className="mx-1 h-4 w-px bg-gray-300"></div>
          </>
        )}
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoFocus={compact}
        />
      </div>

      <div className="flex justify-end gap-2 text-sm">
        {compact ? (
          <button
            className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-gray-500 hover:bg-gray-100"
            onClick={onReset}
          >
            작성취소
          </button>
        ) : (
          <button
            className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-gray-500 hover:bg-gray-100"
            onClick={() => setContent("")}
          >
            작성취소
          </button>
        )}

        <button
          className="bg-primary-main hover:bg-primary-300 flex items-center gap-1 rounded-full px-4 py-1.5 font-medium text-white"
          onClick={handleSubmit}
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
