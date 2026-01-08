import Badge from "../../badge/Badge";
import type { ProgramProblemProps } from "@api/code/codeSubmit";

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

  return (
    <a
      href={data.problemLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex max-w-sm flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
    >
      {/* 이미지 영역 */}
      <div
        className="relative h-[140px] bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        <div className="relative flex h-full flex-col justify-end p-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>{icon}</span>
            <span>{title}</span>
          </div>
          <div className="mt-1 text-xs text-white/80">{subtitle}</div>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="flex flex-col gap-2 bg-white p-4">
        <div className="text-grayscale-dark min-h-[40px] text-sm font-medium">
          [{data.platformType}] {data.title}
        </div>
        <div className="flex gap-2">
          {badges.map((badge, index) => (
            <Badge key={`custom-${index}`} variant={badge.variant}>
              {badge.text}
            </Badge>
          ))}
          <Badge variant="orange">{data.difficultyType}</Badge>
          <Badge variant="white">{data.platformType}</Badge>
        </div>
      </div>
    </a>
  );
};

export default MainProblemCard;
