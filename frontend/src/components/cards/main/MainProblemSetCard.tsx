const MainProblemSetCard = ({ img }: { img: string }) => {
  return (
    <a
      href="#"
      className="group relative flex flex-col justify-end w-full h-[220px] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 bg-gray-900"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        style={{
          backgroundImage: `url(${img})`,
        }}
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

      <div className="relative z-10 flex flex-col gap-y-2 p-5 text-white">
        <div className="transform transition-transform duration-300 group-hover:translate-x-1">
          <div className="font-headline text-lg font-bold leading-tight group-hover:text-primary-200 transition-colors">
            삼성 코딩 테스트 문제집
          </div>
          <p className="text-gray-300 text-xs mt-1 font-light line-clamp-1">
            실전 대비를 위한 최적의 문제 모음
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10 opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2 items-center text-xs text-gray-300">
            <img src="icons/bookIcon.svg" className="size-3.5 opacity-70 filter invert" alt="problems" />
            <span>30 problems</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

export default MainProblemSetCard;
