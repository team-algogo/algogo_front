import type { ReactNode } from "react";

type CategoryVariant = 'enterprise' | 'algorithm';

interface CategoryBadgeProps {
    variant?: CategoryVariant;
    children: ReactNode;
}

const getVariantStyle = (variant: CategoryVariant) => {
    const variantStyles = {
        enterprise: "bg-[#EFF6FF] text-[#1D4ED8]", // Blue-50 bg, Blue-700 text (inferred from previous hardcode)
        algorithm: "bg-[#F0FDFA] text-[#0F766E]",   // Teal-50 bg, Teal-700 text (inferred typical pairing)
    };
    return variantStyles[variant];
};

const CategoryBadge = ({ variant = "enterprise", children }: CategoryBadgeProps) => {
    const badgeStyle = getVariantStyle(variant);
    return (
        <div className={`flex flex-row justify-center items-center px-2 py-[6px] rounded-[100px] ${badgeStyle}`}>
            <span className="font-sans font-medium text-[12px] leading-[130%] flex items-center text-center tracking-[-0.01em]">
                {children}
            </span>
        </div>
    );
};

export default CategoryBadge;
