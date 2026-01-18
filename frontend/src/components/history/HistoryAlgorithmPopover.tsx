import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Algorithm {
  id: number;
  name: string;
}

interface HistoryAlgorithmPopoverProps {
  algorithms: Algorithm[];
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const HistoryAlgorithmPopover = ({
  algorithms,
  triggerElement,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: HistoryAlgorithmPopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!isOpen || !triggerElement) return;

    const updatePosition = () => {
      const rect = triggerElement.getBoundingClientRect();
      const popover = popoverRef.current;
      if (!popover) return;

      const popoverWidth = 280;
      const popoverHeight = 240;
      const gap = 8;

      // 기본: 오른쪽에 표시
      let left = rect.right + gap;
      let top = rect.top;

      // 화면 오른쪽 밖으로 나가면 왼쪽에 표시
      if (left + popoverWidth > window.innerWidth) {
        left = rect.left - popoverWidth - gap;
      }

      // 화면 왼쪽 밖으로 나가면 다시 오른쪽 (최소한 보이게)
      if (left < 0) {
        left = rect.right + gap;
      }

      // 화면 아래로 나가면 위에 표시
      if (top + popoverHeight > window.innerHeight) {
        top = rect.bottom - popoverHeight;
      }

      // 화면 위로 나가면 아래에 표시
      if (top < 0) {
        top = rect.bottom + gap;
      }

      setPosition({ top, left });
    };

    updatePosition();

    // 스크롤이나 리사이즈 시 위치 업데이트
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, triggerElement]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerElement &&
        !triggerElement.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    // 약간의 딜레이를 주어 클릭 이벤트가 처리되도록
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose, triggerElement]);

  if (!isOpen || !triggerElement) return null;

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed z-[1000] max-h-[240px] w-[280px] overflow-y-auto rounded-md border border-[#d0d7de] bg-white p-3 shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        onMouseEnter?.();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        onMouseLeave?.();
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-[#656d76]">
          알고리즘 ({algorithms.length}개)
        </div>
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center rounded text-[#656d76] hover:bg-[#f6f8fa] hover:text-[#1f2328]"
          aria-label="닫기"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {algorithms.map((algo) => (
          <span
            key={algo.id}
            className="inline-flex h-[22px] items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-xs font-medium text-[#656d76]"
          >
            {algo.name}
          </span>
        ))}
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
};

export default HistoryAlgorithmPopover;

