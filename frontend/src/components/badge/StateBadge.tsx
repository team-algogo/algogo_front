interface BadgeProps {
  isPassed: boolean;
  hasText: boolean;
}

const StateBadge = ({ isPassed, hasText }: BadgeProps) => {
  if (hasText) {
    if (isPassed) {
      return (
        <div className="flex h-6 min-w-[60px] items-center justify-center rounded-md bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700">
          성공
        </div>
      );
    } else {
      return (
        <div className="flex h-6 min-w-[60px] items-center justify-center rounded-md bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-700">
          실패
        </div>
      );
    }
  } else {
    const bgColor = isPassed ? "bg-primary-main" : "bg-status-error";
    return <div className={`${bgColor} h-4 w-4 rounded-full`} />;
  }
};

export default StateBadge;
