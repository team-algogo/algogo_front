import type { ProgramProblemProps } from "@api/code/codeSubmit";
import { useNavigate } from "react-router-dom";
import { getProblemSetSearchByProblems } from "@api/problemset/getProblemSetSearchByProblems";

import main1 from "@assets/images/MainCard/MainCard1.jpg";
import main2 from "@assets/images/MainCard/MainCard2.jpg";
import main3 from "@assets/images/MainCard/MainCard3.jpg";
import main4 from "@assets/images/MainCard/MainCard4.jpg";
import main5 from "@assets/images/MainCard/MainCard5.jpg";
import main6 from "@assets/images/MainCard/MainCard6.jpg";
import main7 from "@assets/images/MainCard/MainCard7.jpg";
import main8 from "@assets/images/MainCard/MainCard8.jpg";
import main9 from "@assets/images/MainCard/MainCard9.jpg";
import main10 from "@assets/images/MainCard/MainCard10.jpg";

const images = [
  main1,
  main2,
  main3,
  main4,
  main5,
  main6,
  main7,
  main8,
  main9,
  main10,
];

interface MainProblemCardProps {
  data: ProgramProblemProps;
  icon: string;
  title: string;
  subtitle: string;
  badges?: { text: string; variant: "orange" | "green" | "white" }[];
}

const MainProblemCard = ({
  data,
  icon,
  title,
  subtitle,
  badges = [],
}: MainProblemCardProps) => {
  const img = images[Math.floor(Math.random() * images.length)];
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    // 문제 제목으로 문제집 검색
    try {
      const result = await getProblemSetSearchByProblems(data.title, 0, 1);
      if (result.problemSetList.length > 0) {
        // 첫 번째 문제집으로 이동
        navigate(`/problemset/${result.problemSetList[0].programId}`);
      } else {
        // 검색 결과가 없으면 문제집 목록 페이지로 이동
        navigate("/problemset");
      }
    } catch (error) {
      console.error("Failed to find problem set:", error);
      // 에러 발생 시 문제집 목록 페이지로 이동
      navigate("/problemset");
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="group relative flex h-[210px] w-full max-w-[300px] flex-col overflow-hidden rounded-xl bg-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {/* 배경 이미지 - 존재감 낮추기 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.02]"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* 오버레이 - 더 어둡게 처리하여 이미지 비중 줄이기 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/90"></div>

      {/* 컨텐츠 영역 - 컴팩트한 패딩 */}
      <div className="relative z-10 flex h-full flex-col p-4 text-white">
        {/* 1️⃣ 상단 고정 영역: 섹션 라벨 + 배지 */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-semibold tracking-tight text-white/90">
              {title}
            </span>
          </div>
          {badges.length > 0 && (
            <div className="flex flex-col gap-1">
              {badges.map((badge, index) => (
                <span
                  key={`badge-${index}`}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
                    badge.variant === "orange"
                      ? "bg-orange-500 text-white"
                      : badge.variant === "green"
                        ? "bg-green-500 text-white"
                        : "bg-white/95 text-gray-900"
                  }`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2️⃣ 타이틀 영역: 메인 타이틀 + 서브 설명 (컴팩트) */}
        <div className="mb-4 flex min-h-[60px] flex-col justify-center">
          <p className="mb-1.5 line-clamp-2 text-[15px] leading-tight font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]">
            {data.title}
          </p>
          <p className="line-clamp-1 text-xs leading-tight font-normal text-white/60">
            {subtitle}
          </p>
        </div>

        {/* 3️⃣ 태그/메타 영역: pill 형태 한 줄 정렬 (컴팩트) */}
        <div className="mb-3 flex min-h-[12px] flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {data.difficultyType}
          </span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
            {data.platformType}
          </span>
        </div>

        {/* 4️⃣ 하단 CTA 영역: 문제 보기 + 화살표 (컴팩트) */}
        <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/85">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <span>문제 보기</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-all group-hover:bg-white/30">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MainProblemCard;
