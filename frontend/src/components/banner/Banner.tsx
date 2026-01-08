import { useState, useEffect, useCallback } from "react";

interface BannerItem {
  id: number;
  category: string;
  title: string;
  gradient: string;
}

interface BannerProps {
  items?: BannerItem[];
  autoPlayInterval?: number;
}

const defaultBanners: BannerItem[] = [
  {
    id: 1,
    category: "New Feature",
    title: "알고가자와 함께하는\n코딩 테스트 완전 정복",
    gradient: "from-[#2C3E50] to-[#4CA1AF]", // Deep Blue -> Teal
  },
  {
    id: 2,
    category: "Algorithm",
    title: "매일 새로운 문제로\n실력을 키워보세요",
    gradient: "from-[#4568DC] to-[#B06AB3]", // Royal Blue -> Purple
  },
  {
    id: 3,
    category: "Event",
    title: "친구들과 함께하는\n알고리즘 스터디",
    gradient: "from-[#000428] to-[#004e92]", // Midnight -> Deep Blue
  },
];

const Banner = ({
  items = defaultBanners,
  autoPlayInterval = 5000,
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 700); // slightly longer for smoothness
    },
    [isTransitioning, currentIndex]
  );

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex);
  }, [currentIndex, items.length, goToSlide]);

  useEffect(() => {
    if (autoPlayInterval <= 0) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, goToNext]);

  return (
    <div className="w-full h-[320px] relative overflow-hidden shadow-lg mb-8 rounded-xl mx-auto max-w-7xl mt-6">
      <div
        className="flex h-full transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`w-full h-full shrink-0 bg-gradient-to-r ${item.gradient} relative overflow-hidden`}
          >
            {/* Background Pattern Overlay (Optional) */}
            <div className="absolute inset-0 opacity-10 bg-[url('/patterns/grid.svg')] bg-center bg-repeat mix-blend-overlay"></div>

            <div className="relative z-10 h-full max-w-4xl mx-auto flex flex-col justify-center px-8 md:px-16">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white border border-white/30 rounded-full w-fit bg-white/10 backdrop-blur-sm uppercase">
                {item.category}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-md whitespace-pre-line">
                {item.title}
              </h2>
              <div className="mt-8">
                <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5">
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-8 flex gap-3 z-20">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${index === currentIndex
              ? "w-8 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
