import Badge from "../../badge/Badge";
import Button from "../../button/Button";

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

const MainGroupCard = () => {
  const img = images[Math.floor(Math.random() * images.length)];

  return (
    <a
      href="#"
      className="relative flex flex-col justify-between w-[255px] h-[275px] text-white px-4 py-3 bg-cover bg-center rounded-lg"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
      <div className="relative flex flex-col gap-y-4">
        <div className="flex justify-between">
          <Badge variant="orange">Hot</Badge>
          <Badge variant="white">All</Badge>
        </div>

        <div className="font-headline text-2xl">코드 문제 제목</div>
        <div>가장 많은 코멘트가 달린 리뷰!</div>

        <div className="flex gap-2">
          <div className="flex gap-2 px-1 py-3">
            <img src="/icons/reviewIconWhite.svg" />
            <div>리뷰수: 100</div>
          </div>
          <div className="flex gap-2 px-1 py-3">
            <img src="/icons/codeIcon.svg" />
            <div>Python</div>
          </div>
        </div>

        <Button variant="default">리뷰 구경하기</Button>
      </div>
    </a>
  );
};

export default MainGroupCard;
