import type { ReactNode } from "react";

type CategoryVariant = 'enterprise' | 'algorithm';

interface CategoryBadgeProps {
  variant?: CategoryVariant;
  children: ReactNode;
}


const getVariantStyle = (variant: string) => {
  // Exact match mapping
  const variantStyles: Record<string, string> = {
    'enterprise': "bg-[#EFF6FF] text-[#1D4ED8]",
    'algorithm': "bg-[#F0FDFA] text-[#0F766E]",
    '기업 대비': "bg-[#EFF6FF] text-[#1D4ED8]", // Blue
    '자격증': "bg-[#FFF7ED] text-[#C2410C]",     // Orange
    '알고리즘별': "bg-[#F0FDFA] text-[#0F766E]",   // Teal
  };

  return variantStyles[variant] || "bg-[#F3F4F6] text-[#6B7280]"; // Default Gray
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
