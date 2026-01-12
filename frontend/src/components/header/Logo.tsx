/**
 * Logo Component - Modern Korean Brand Style
 *
 * 디자인 철학:
 * - 한글 로고의 우수 사례(토스, 당근마켓 등) 참고
 * - 캘리그라피 느낌의 부드러운 곡선 + 모던한 깔끔함의 균형
 * - 심볼과 텍스트의 완전한 통합으로 하나의 로고 단위 형성
 * - 워드마크: "알고가자" - Mabinogi Classic 폰트로 캘리그라피 느낌
 * - 전체적으로 브랜드 아이덴티티가 강한 통합 로고
 */

export default function Logo() {
  return (
    <a
      href="/"
      className="flex h-full items-center whitespace-nowrap transition-opacity duration-200 hover:opacity-90"
      aria-label="알고가자 홈으로 이동"
    >
      <div className="flex items-baseline gap-2">
        {/* 심볼: 알고리즘/코드를 연상시키는 "<>" - 텍스트와 시각적으로 통합 */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-0.5 flex-shrink-0"
          aria-hidden="true"
        >
          {/* "<>" 기호 - 텍스트 높이와 조화를 이루도록 조정 */}
          <path
            d="M6 6L3.5 10L6 14M14 6L16.5 10L14 14"
            stroke="#0D6EFD"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* 워드마크: "알고가자" - 캘리그라피 느낌의 세련된 한글 (Mabinogi Classic) */}
        <span
          className="logo-text flex items-center text-[22px] leading-[1.15] tracking-[-0.025em]"
          style={{
            fontFamily: '"Mabinogi_Classic", system-ui, sans-serif',
            fontWeight: 400,
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          }}
        >
          <span className="text-[#1F2937]">알고</span>
          <span className="text-[#0D6EFD]">가자</span>
        </span>
      </div>
    </a>
  );
}
