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
    category: "카테고리",
    title: "문제집 소개글이나 홍보",
    gradient: "from-cyan-400 to-cyan-300",
  },
  {
    id: 2,
    category: "알고리즘",
    title: "코딩테스트 대비 문제집",
    gradient: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    category: "이벤트",
    title: "신규 회원 가입 이벤트",
    gradient: "from-teal-400 to-cyan-300",
  },
];

const Banner = ({
  items = defaultBanners,
  autoPlayInterval = 4000,
}: BannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    goToSlide(nextIndex);
  }, [currentIndex, items.length, goToSlide]);

  // 자동 슬라이드
  useEffect(() => {
    if (autoPlayInterval <= 0) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, goToNext]);

  return (
    <div className="w-full h-[261px] relative overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={`w-full h-full shrink-0 bg-linear-to-r ${item.gradient} p-8 flex flex-col justify-center`}
          >
            <div className="flex items-start gap-3">
              <div className="w-1 h-16 bg-white/50 rounded-full" />
              <div className="flex flex-col gap-3">
                <h2 className="text-white text-2xl font-bold">{item.title}</h2>
                <a
                  href="#"
                  className="text-white/80 text-sm hover:text-white transition-colors"
                >
                  CTA 버튼 →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-6 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-white"
                : "w-4 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
