const MainProblemSetCard = ({ img }: { img: string }) => {
  return (
    <a
      href="#"
      className="flex flex-col justify-end w-75 h-52 text-black p-6 bg-cover bg-center rounded-lg"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="flex flex-col gap-y-4">
        <div className="text-lg">삼성 코딩 테스트 문제집</div>
        <div className="flex gap-2 px-1">
          <img src="icons/bookIcon.svg" />
          <div>30개</div>
        </div>
      </div>
    </a>
  );
};

export default MainProblemSetCard;
