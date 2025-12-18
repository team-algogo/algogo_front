import type { ReactNode } from 'react';

type CategoryType = '기업대비' | '알고리즘';

interface CategoryBadgeProps {
  category: CategoryType;
  children?: ReactNode;
}

const getCategoryStyles = (category: CategoryType) => {
  const styles = {
    '기업대비': 'bg-[#EFF6FF] text-[#1D4ED8]',
    '알고리즘': 'bg-[#F0FDFA] text-[#0F766E]',
  };
  return styles[category];
};

const CategoryBadge = ({ category, children }: CategoryBadgeProps) => {
  const badgeStyles = getCategoryStyles(category);
  
  return (
    <div className={`inline-flex px-2 py-1.5 justify-center items-center rounded-full ${badgeStyles}`}>
      <span className="text-center text-xs font-medium leading-[130%] tracking-[-0.12px]" style={{ fontFamily: 'IBM Plex Sans KR' }}>
        {children || category}
      </span>
    </div>
  );
};

export default CategoryBadge;
