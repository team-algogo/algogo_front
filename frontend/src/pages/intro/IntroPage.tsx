import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "@components/main/landing/HeroSection";
import { FeatureSection } from "@components/main/landing/FeatureSection";
import { HowItWorksSection } from "@components/main/landing/HowItWorksSection";
import { GroupFeatureSection } from "@components/main/landing/GroupFeatureSection";
import { ProblemSetFeatureSection } from "@components/main/landing/ProblemSetFeatureSection";

const IntroPage = () => {
    const { state } = useLocation();
    const [showLoginRequiredBanner, setShowLoginRequiredBanner] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(false);

    // 로그인 필요 배너 표시
    useEffect(() => {
        if (state?.requireLogin) {
            setShowLoginRequiredBanner(true);
            setBannerVisible(true);
            // Clear state so banner doesn't show on refresh
            window.history.replaceState({}, document.title);

            // 4초 후 배너 fade-out 시작
            const fadeTimer = setTimeout(() => {
                setBannerVisible(false);
            }, 4000);

            // fade-out 애니메이션 후 완전히 제거
            const removeTimer = setTimeout(() => {
                setShowLoginRequiredBanner(false);
            }, 4500);

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [state]);

    return (
        <>
            {/* 로그인 필요 안내 배너 */}
            {showLoginRequiredBanner && (
                <div
                    className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] px-4 transition-opacity duration-500 ${bannerVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-lg">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-blue-600"
                            >
                                <path
                                    d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className="flex-1 text-sm font-medium text-gray-700 leading-relaxed">
                            로그인이 필요한 서비스입니다.
                        </p>
                        <button
                            onClick={() => {
                                setBannerVisible(false);
                                setTimeout(() => setShowLoginRequiredBanner(false), 500);
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 6L6 18M6 6l12 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full">
                <HeroSection />
                <FeatureSection />
                <HowItWorksSection />
                <ProblemSetFeatureSection />
                <GroupFeatureSection />
            </div>
        </>
    );
};

export default IntroPage;
