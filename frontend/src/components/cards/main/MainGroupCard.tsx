import Badge from "../../badge/Badge";

import main1 from "../../../assets/images/MainCard/MainCard1.jpg";
import main2 from "../../../assets/images/MainCard/MainCard2.jpg";
import main3 from "../../../assets/images/MainCard/MainCard3.jpg";
import main4 from "../../../assets/images/MainCard/MainCard4.jpg";
import main5 from "../../../assets/images/MainCard/MainCard5.jpg";
import main6 from "../../../assets/images/MainCard/MainCard6.jpg";
import main7 from "../../../assets/images/MainCard/MainCard7.jpg";
import main8 from "../../../assets/images/MainCard/MainCard8.jpg";
import main9 from "../../../assets/images/MainCard/MainCard9.jpg";
import main10 from "../../../assets/images/MainCard/MainCard10.jpg";

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

interface MainGroupCardProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  codeTitle?: string;
  badges?: { text: string; variant: "orange" | "green" | "white" }[];
}

const MainGroupCard = ({
  icon = "🔥",
  title = "지금 가장 많은 코멘트가 달린 코드 확인하기",
  subtitle = "코드 몇 줄로 메모리 단축!",
  codeTitle = "[Python] 다익스트라 알고리즘 구현 리뷰",
  badges = [
    { text: "HOT", variant: "orange" },
    { text: "All", variant: "white" },
  ],
}: MainGroupCardProps) => {
  const img = images[Math.floor(Math.random() * images.length)];

  return (
    <a
      href="#"
      className="group relative flex flex-col justify-between w-[260px] h-[340px] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
    >
      {/* Background Image with Zoom Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />

      {/* Sophisticated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full p-5 text-white">

        {/* Top Badges */}
        <div className="flex justify-between items-start opacity-90 group-hover:opacity-100 transition-opacity">
          <Badge variant="orange" className="shadow-sm">Hot</Badge>
          <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium border border-white/10">
            All
          </div>
        </div>

        {/* Bottom Content */}
        <div className="mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          {/* Meta Info Row */}
          <div className="flex items-center gap-3 text-xs text-gray-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span>Active</span>
            </div>
            <div className="flex gap-1 items-center">
              <span>Python</span>
            </div>
          </div>

          <h3 className="font-headline text-xl font-bold mb-2 leading-tight group-hover:text-primary-200 transition-colors line-clamp-2">
            2025 Kakao Recruitment
          </h3>

          <p className="text-gray-300 text-xs mb-4 line-clamp-2 font-light">
            카카오 기출 문제들을 모아놓은 공식 문제집입니다. 함께 풀어봐요!
          </p>

          {/* Icon Stats Row */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex gap-3 text-xs text-gray-400 group-hover:text-white transition-colors">
              <div className="flex items-center gap-1">
                <img src="/icons/reviewIconWhite.svg" className="w-3 opacity-70" alt="review" />
                <span>120</span>
              </div>
              <div className="flex items-center gap-1">
                <img src="/icons/groupIcon.svg" className="w-3 opacity-70 filter invert" alt="users" />
                <span>24</span>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MainGroupCard;
