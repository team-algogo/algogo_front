interface BadgeProps {
    isPassed: boolean;
    hasText: boolean;
}

const StateBadge = ({ isPassed, hasText }: BadgeProps) => {
  const bgColor = isPassed ? 'bg-primary-main' : 'bg-alert-error';

  return hasText ? (
    <div className={`${bgColor} text-white text-center h-6 w-15 px-3 py-0.5 rounded-lg`}>
      {isPassed ? '통과' : '실패'}
    </div>
  ) : (
    <div className={`${bgColor} w-4 h-4 rounded-full`} />
  );
};

export default StateBadge;