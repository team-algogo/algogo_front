import { useState, useRef, useEffect } from "react";

interface Algorithm {
  id: number;
  name: string;
}

interface AlgorithmTagListProps {
  algorithms: Algorithm[];
}

const AlgorithmTagList = ({ algorithms }: AlgorithmTagListProps) => {
  const [visibleCount, setVisibleCount] = useState<number>(algorithms.length);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current || algorithms.length === 0) {
      setVisibleCount(algorithms.length);
      return;
    }

    const calculateVisibleCount = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const gap = 8; // gap-2 = 8px
      const moreButtonWidth = moreButtonRef.current?.offsetWidth || 50; // +N 버튼 예상 너비

      let totalWidth = 0;
      let count = 0;

      // 모든 태그를 먼저 렌더링하고 측정
      for (let i = 0; i < algorithms.length; i++) {
        const tagElement = tagRefs.current[i];
        if (!tagElement) {
          // 아직 렌더링되지 않았으면 잠시 후 다시 시도
          setTimeout(calculateVisibleCount, 50);
          return;
        }

        const tagWidth = tagElement.offsetWidth;
        const currentGap = count > 0 ? gap : 0;
        const nextTotalWidth = totalWidth + tagWidth + currentGap;

        // 마지막 태그가 아니면 +N 버튼 공간도 고려
        if (i < algorithms.length - 1) {
          // 다음 태그를 넣을 공간이 있는지 확인 (+N 버튼 포함)
          if (nextTotalWidth + moreButtonWidth + gap > containerWidth) {
            break;
          }
        } else {
          // 마지막 태그면 +N 버튼 불필요
          if (nextTotalWidth > containerWidth) {
            break;
          }
        }

        totalWidth = nextTotalWidth;
        count++;
      }

      // 최소 4개는 보여주도록 보장
      setVisibleCount(Math.max(4, count));
    };

    // 초기 계산
    calculateVisibleCount();

    // ResizeObserver로 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCount();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [algorithms]);

  const visibleAlgorithms = algorithms.slice(0, visibleCount);
  const hiddenCount = algorithms.length - visibleCount;
  const hasHidden = hiddenCount > 0;

  // 태그가 2개 이하면 축약 UI 숨김
  const shouldShowMore = hasHidden && algorithms.length > 2;

  return (
    <div className="relative flex items-center">
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-hidden"
        style={{ flexWrap: "nowrap" }}
      >
        {/* 표시되는 태그들 */}
        {algorithms.map((algo, index) => {
          const isVisible = index < visibleCount;
          return (
            <span
              key={algo.id}
              ref={(el) => {
                tagRefs.current[index] = el;
              }}
              className={`inline-flex shrink-0 items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-medium text-[#656d76] whitespace-nowrap ${
                isVisible ? "" : "absolute opacity-0 pointer-events-none"
              }`}
              style={isVisible ? {} : { visibility: "hidden" }}
            >
              {algo.name}
            </span>
          );
        })}

        {/* +N 버튼 */}
        {shouldShowMore && (
          <button
            ref={moreButtonRef}
            className="relative inline-flex shrink-0 items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-medium text-[#656d76] whitespace-nowrap hover:bg-[#e6e9ed] transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            +{hiddenCount}
          </button>
        )}
      </div>

      {/* Tooltip - 전체 알고리즘 목록 */}
      {showTooltip && shouldShowMore && (
        <div
          className="absolute right-0 top-full z-50 mt-2 max-w-[300px] rounded-md border border-[#d0d7de] bg-white p-3 shadow-lg"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="mb-2 text-xs font-semibold text-[#656d76]">
            전체 알고리즘 ({algorithms.length}개)
          </div>
          <div className="flex flex-wrap gap-2">
            {algorithms.map((algo) => (
              <span
                key={algo.id}
                className="inline-flex items-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-medium text-[#656d76]"
              >
                {algo.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmTagList;

