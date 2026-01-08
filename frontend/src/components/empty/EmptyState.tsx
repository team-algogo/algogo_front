interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
}

const EmptyState = ({
  icon = "📭",
  title,
  description,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <div className="font-medium text-grayscale-dark mb-2">{title}</div>
      {description && (
        <div className="text-sm text-grayscale-warm-gray">{description}</div>
      )}
    </div>
  );
};

export default EmptyState;

