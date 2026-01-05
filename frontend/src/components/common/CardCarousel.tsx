import { type ReactNode } from "react";

interface CardCarouselProps {
    children: ReactNode;
    onPrev: () => void;
    onNext: () => void;
    currentIndex: number;
    totalItems: number;
}

const CardCarousel = ({
    children,
    onPrev,
    onNext,
    currentIndex,
    totalItems,
}: CardCarouselProps) => {
    if (totalItems <= 1) return <>{children}</>;

    return (
        <div className="group relative flex items-center">
            {/* Previous Button */}
            <button
                onClick={onPrev}
                className="bg-grayscale-white border-grayscale-light text-grayscale-dark hover:bg-grayscale-lighter absolute -left-4 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all group-hover:flex"
                aria-label="Previous"
            >
                ‹
            </button>

            {/* Card Content */}
            <div className="w-full transition-all duration-300 ease-in-out">
                {children}
            </div>

            {/* Next Button */}
            <button
                onClick={onNext}
                className="bg-grayscale-white border-grayscale-light text-grayscale-dark hover:bg-grayscale-lighter absolute -right-4 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-md transition-all group-hover:flex"
                aria-label="Next"
            >
                ›
            </button>

            {/* Dots Indicator (Optional, can be removed if not needed for space) */}
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1">
                {Array.from({ length: Math.min(totalItems, 5) }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full ${idx === currentIndex % 5 ? 'bg-primary-main' : 'bg-grayscale-light'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardCarousel;
