import Badge from "../../badge/Badge";
import Button from "../../button/Button";

const MainGroupCard = ({ img }: { img: string }) => {
  return (
    <a
      href="#"
      className="flex flex-col justify-between w-[255px] h-[255px] text-white px-4 py-3 bg-cover bg-center rounded-lg"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
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
    </a>
  );
};

export default MainGroupCard;
