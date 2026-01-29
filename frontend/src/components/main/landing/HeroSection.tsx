import { useState, useEffect } from 'react';

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            tag: 'EVENT',
            title: '친구들과 함께하는\n알고리즘 스터디',
            description: '코드 리뷰 매칭으로 함께 성장하세요',
            image: '/assets/banner_1.jpg',
            bgColor: '#1A3AA1' // Periwinkle to match banner_1
        },
        {
            tag: 'NEW',
            title: '기업 대비부터\n자격증 준비까지',
            description: '맞춤형 문제집으로 목표 달성하기',
            image: '/assets/banner_2.jpg',
            bgColor: '#1A3AA1' // Periwinkle to match banner_2
        },
        {
            tag: 'COMMUNITY',
            title: '그룹원들과\n실시간 코드 리뷰',
            description: '커스텀 방에서 함께 성장하세요',
            image: '/assets/banner_3.jpg',
            bgColor: '#1A3AA1' // Periwinkle to match banner_3
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section
            className="relative w-full overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: slides[currentSlide].bgColor }}
        >
            <div className="relative mx-auto h-auto min-[952px]:h-[400px] max-w-7xl flex flex-col-reverse justify-between items-center px-4 sm:px-6 lg:px-8 min-[952px]:flex-row min-[952px]:py-0 py-16">
                {/* Left Content */}
                <div className="flex flex-col items-center min-[952px]:items-start z-10 w-full min-[952px]:max-w-[30%] text-center min-[952px]:text-left pt-6 min-[952px]:pt-0">
                    <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-4 backdrop-blur-sm text-white border border-white/10">
                        {slides[currentSlide].tag}
                    </div>

                    <h1 className="text-3xl min-[952px]:text-[40px] font-bold text-white mb-4 whitespace-pre-line leading-[1.3] tracking-tight">
                        {slides[currentSlide].title}
                    </h1>

                    <p className="text-white/90 text-base min-[952px]:text-lg mb-8 font-medium">
                        {slides[currentSlide].description}
                    </p>
                </div>

                {/* Right Image */}
                <div className="w-full min-[952px]:absolute min-[952px]:left-[64%] min-[952px]:-translate-x-1/2 min-[952px]:top-1/2 min-[952px]:-translate-y-1/2 min-[952px]:w-[600px] h-[300px] min-[952px]:h-full flex items-center justify-center">
                    <img
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        className="object-contain h-full w-full animate-fade-in pb-4 min-[952px]:pb-0"
                    />
                </div>

                <div className="absolute bottom-4 right-4 sm:right-6 lg:right-8 flex gap-2 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`슬라이드 ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
