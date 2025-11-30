import StateBadge from "../badge/StateBadge";

interface HistoryProps {
  isPassed: boolean;
  createdAt: string;
  language: string;
}

const HistoryItem = ({ isPassed }: HistoryProps) => {
  return (
    <div className="flex gap-1 p-1">
      <div className="flex items-center h-6">
        <StateBadge hasText={false} isPassed={isPassed} />
      </div>
      <div className="flex flex-col gap-y-1 py-1">
        <div className="px-3 text-grayscale-warm-gray">
          Submit on 2025.10.24.
        </div>
        <div className="flex gap-1 px-3 text-grayscale-warm-gray">
          <div>Java</div>
          <div>·</div>
          <div>28ms</div>
          <div>·</div>
          <div>12345KB</div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
