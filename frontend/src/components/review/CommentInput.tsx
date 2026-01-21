import { type FC, useState, useRef, useEffect } from "react";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // textarea 높이 자동 조절 상수
  const MIN_HEIGHT = 48; // 2줄
  const MAX_HEIGHT = 220; // 9줄

  const handleSubmit = () => {
    if (!content) return;
    onSubmit(content);
    setContent("");
  };

  const handleCancel = () => {
    if (compact && onReset) {
      onReset();
    } else {
      setContent("");
    }
  };

  // compact 모드는 기존 스타일 유지 (댓글 답글용)
  if (compact) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-[#d0d7de] bg-white p-3">
        <textarea
          placeholder={placeholder}
          className="flex-1 resize-none bg-transparent text-sm text-[#1f2328] placeholder-[#656d76] outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
          autoFocus={true}
          rows={2}
        />
        <div className="flex justify-end gap-2">
          <button
            className="inline-flex h-8 items-center justify-center rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3 text-sm font-medium text-[#1f2328] transition-colors hover:bg-[#e6e9ed]"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="inline-flex h-8 items-center justify-center rounded-md bg-[#0969da] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0550ae] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Comment
          </button>
        </div>
      </div>
    );
  }

  // textarea 높이 자동 조절 (min: 96px, max: 220px) - 전체 박스 높이도 함께 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || compact) return;

    // requestAnimationFrame으로 리플로우 최소화
    const adjustHeight = () => {
      // 초기 높이 설정
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;

      // min과 max 사이에서 높이 조절
      if (scrollHeight < MIN_HEIGHT) {
        textarea.style.height = `${MIN_HEIGHT}px`;
        textarea.style.overflowY = "hidden";
      } else if (scrollHeight > MAX_HEIGHT) {
        textarea.style.height = `${MAX_HEIGHT}px`;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      }
    };

    requestAnimationFrame(adjustHeight);
  }, [content, compact]);

  // 메인 댓글 작성 UI - 세련된 스타일
  return (
    <div className="rounded-xl border border-[#d0d7de] bg-white transition-all duration-300 focus-within:border-[#0969da]">
      <div className="grid grid-cols-[1fr_140px] items-stretch gap-3 p-3">
        {/* 좌측: textarea 영역 */}
        <div className="flex flex-col gap-2">
          {/* 줄 선택 버튼 */}
          <button
            onClick={initSelectedLine}
            className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#c8e1ff] bg-gradient-to-br from-[#f0f7ff] via-[#e8f4ff] to-[#e0f0ff] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#0969da] shadow-[0_1px_2px_rgba(9,105,218,0.08)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#96c8ff] hover:from-[#e0f0ff] hover:via-[#d8ecff] hover:to-[#d0e8ff] hover:shadow-[0_2px_4px_rgba(9,105,218,0.12)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(9,105,218,0.08)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 text-[#0969da] transition-transform duration-200 group-hover:scale-110"
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
            <span className="tracking-tight">
              {selectedLine ? `${selectedLine}번 줄` : "전체 리뷰"}
            </span>
          </button>
          {/* textarea */}
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            className="resize-none bg-transparent text-sm leading-6 text-[#1f2328] placeholder-[#8b949e] transition-all outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
            style={{
              minHeight: `${MIN_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
              overflowY: "auto",
            }}
          />
        </div>

        {/* 우측: 버튼 컬럼 (고정 폭) - 세로 중앙 정렬 */}
        <div className="flex shrink-0 flex-col justify-center gap-2">
          <button
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-[#0969da] text-xs font-semibold text-white shadow-[0_1px_2px_rgba(9,105,218,0.2)] transition-colors duration-200 hover:bg-[#0550ae] hover:shadow-[0_2px_4px_rgba(9,105,218,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Comment
          </button>
          <button
            className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-[#d1d9e0] bg-white text-xs font-medium text-[#24292f] shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-[#c1c9d1] hover:bg-[#f6f8fa] hover:shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:bg-[#f0f2f5]"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
