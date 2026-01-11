import { useNavigate } from "react-router-dom";
import img2 from "@assets/images/MainCard/MainCard2.jpg";

interface ProblemSearchResultCardProps {
  programId: number;
  thumbnail: string;
  title: string;
  description: string;
  problemCount: number;
  categories: string[];
  searchKeyword: string;
}

const ProblemSearchResultCard = ({
  programId,
  thumbnail,
  title,
  description,
  problemCount,
  categories,
  searchKeyword,
}: ProblemSearchResultCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/problemset/${programId}`)}
      className="group relative flex h-[220px] w-full transform flex-col justify-end overflow-hidden rounded-xl bg-gray-900 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
        style={{
          backgroundImage: `url(${thumbnail || img2})`,
        }}
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

      <div className="relative z-10 flex flex-col gap-y-2 p-5 text-white">
        <div className="transform transition-transform duration-300 group-hover:translate-x-1">
          <div className="font-headline group-hover:text-primary-200 text-lg leading-tight font-bold transition-colors">
            {title}
          </div>
          <p className="mt-1 line-clamp-1 text-xs font-light text-gray-300">
            {description}
          </p>
        </div>

        {/* Search Match Indicator */}
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-blue-500/20 backdrop-blur-sm px-2.5 py-1.5 text-xs text-white">
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14L11.1 11.1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium line-clamp-1">
            &quot;{searchKeyword}&quot; 포함 문제 발견
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3 opacity-80 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <img
              src="/icons/bookIcon.svg"
              className="size-3.5 opacity-70 invert filter"
              alt="problems"
            />
            <span>{problemCount || 0} problems</span>
          </div>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white group-hover:text-black">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSearchResultCard;
