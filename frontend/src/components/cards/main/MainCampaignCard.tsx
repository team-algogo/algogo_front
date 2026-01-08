import Badge from "../../badge/Badge";
import Button from "../../button/Button";

import main1 from "../../../assets/images/MainCard/MainCard1.jpg";
import main2 from "../../../assets/images/MainCard/MainCard2.jpg";
import main3 from "../../../assets/images/MainCard/MainCard3.jpg";
import main4 from "../../../assets/images/MainCard/MainCard4.jpg";
import main5 from "../../../assets/images/MainCard/MainCard5.jpg";

const images = [main1, main2, main3, main4, main5];

interface MainCampaignCardProps {
  badge?: { text: string; variant: "orange" | "green" | "white" };
  title?: string;
  description?: string;
  reviewCount?: number;
}

const MainCampaignCard = ({
  badge = { text: "HOT", variant: "orange" },
  title = "[JS] Js로 구현한 TFS",
  description = "🔥 현재 가장 인기있는 코멘트",
  reviewCount = 5,
}: MainCampaignCardProps) => {
  const img = images[Math.floor(Math.random() * images.length)];

  return (
    <a
      href="#"
      className="relative flex flex-col justify-between w-full h-[280px] text-white p-5 bg-cover bg-center rounded-lg overflow-hidden"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />

      <div className="relative">
        <Badge variant={badge.variant}>{badge.text}</Badge>
      </div>

      <div className="relative flex flex-col gap-3">
        <div className="font-semibold text-lg">{title}</div>
        <div className="text-sm text-white/80">{description}</div>
        <div className="text-sm">리뷰수: {reviewCount}</div>
        <Button variant="primary" className="w-fit">
          리뷰 구경하기
        </Button>
      </div>
    </a>
  );
};

export default MainCampaignCard;

