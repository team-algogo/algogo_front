const MainProblemSetCard = ({ img }: { img: string }) => {
  return (
    <a
      href="#"
      className="relative flex flex-col justify-end w-75 h-52 text-black p-6 bg-cover bg-center rounded-lg overflow-hidden"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="absolute inset-0 bg-white/80"></div>

      <div className="relative flex flex-col gap-y-4">
        <div className="font-title text-lg">삼성 코딩 테스트 문제집</div>

        <div className="flex gap-2 px-1">
          <img src="icons/bookIcon.svg" />
          <div className="font-body text-sm">30개</div>
        </div>
      </div>
    </a>
  );
};

export default MainProblemSetCard;
