import { useState, useEffect } from 'react';

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            tag: 'EVENT',
            title: '친구들과 함께하는\n알고리즘 스터디',
            description: '코드 리뷰 매칭으로 함께 성장하세요'
        },
        {
            tag: 'NEW',
            title: '기업 대비부터\n자격증 준비까지',
            description: '맞춤형 문제집으로 목표 달성하기'
        },
        {
            tag: 'COMMUNITY',
            title: '그룹원들과\n실시간 코드 리뷰',
            description: '커스텀 방에서 함께 성장하세요'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden">
            <div className="container mx-auto px-6 py-16 md:py-20">
                <div className="max-w-2xl">
                    <div className="inline-block px-3 py-1 bg-blue-700/50 rounded-full text-xs font-medium mb-4">
                        {slides[currentSlide].tag}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4 whitespace-pre-line leading-tight">
                        {slides[currentSlide].title}
                    </h1>

                    <p className="text-blue-100 text-base mb-6">
                        {slides[currentSlide].description}
                    </p>


                </div>

                <div className="absolute bottom-6 right-6 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                                }`}
                            aria-label={`슬라이드 ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
