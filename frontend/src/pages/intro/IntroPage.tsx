
import { HeroSection } from "@components/main/landing/HeroSection";
import { FeatureSection } from "@components/main/landing/FeatureSection";
import { HowItWorksSection } from "@components/main/landing/HowItWorksSection";
import { GroupFeatureSection } from "@components/main/landing/GroupFeatureSection";
import { CTASection } from "@components/main/landing/CTASection";

const IntroPage = () => {
    return (
        <div className="w-full">
            <HeroSection />
            <FeatureSection />
            <HowItWorksSection />
            <GroupFeatureSection />
            <CTASection />
        </div>
    );
};

export default IntroPage;
