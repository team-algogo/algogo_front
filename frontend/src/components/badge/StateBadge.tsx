interface BadgeProps {
  isPassed: boolean;
  hasText: boolean;
}

const StateBadge = ({ isPassed, hasText }: BadgeProps) => {
  const bgColor = isPassed ? "bg-primary-main" : "bg-status-error";

  return hasText ? (
    <div
      className={`${bgColor} text-white flex justify-center items-center h-6 min-w-[60px] px-3 py-0.5 rounded-lg text-xs font-medium`}
    >
      {isPassed ? "통과" : "실패"}
    </div>
  ) : (
    <div className={`${bgColor} w-4 h-4 rounded-full`} />
  );
};

export default StateBadge;
