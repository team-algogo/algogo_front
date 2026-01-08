import { Link } from "react-router-dom";

interface MainProblemSetCardProps {
  programId: number;
  img: string;
  title?: string;
  count?: number;
}

const MainProblemSetCard = ({
  programId,
  img,
  title = "삼성 코딩 테스트 문제집",
  count = 30,
}: MainProblemSetCardProps) => {
  return (
    <Link
      to={`/problemset/${programId}`}
      className="relative flex h-[160px] w-[200px] shrink-0 flex-col justify-end overflow-hidden rounded-lg bg-cover bg-center p-4 text-white"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="relative flex flex-col gap-y-2">
        <div className="text-sm leading-tight font-semibold">{title}</div>
        <div className="flex items-center gap-1.5">
          <img src="/icons/bookIcon.svg" className="h-4 w-4 invert" />
          <span className="text-xs text-white/80">{count}개</span>
        </div>
      </div>
    </Link>
  );
};

export default MainProblemSetCard;
