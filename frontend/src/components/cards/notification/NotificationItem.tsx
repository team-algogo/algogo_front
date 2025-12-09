interface NotificationItemProps {
  isRead?: boolean; // 읽었는지 여부
  title: string;
  tags?: string[];
  problemName: string;
  createdAt: string;
}

const NotificationItem = ({
  isRead = false,
  title,
  tags = [],
  problemName,
  createdAt,
}: NotificationItemProps) => {
  return (
    <div
      className={`flex items-start p-2 gap-0.5 ${
        isRead ? "bg-grayscale-default" : "bg-white"
      }`}
    >
      {/* 왼쪽 아이콘 */}
      <div className="mr-3">
        {isRead ? (
          <img src="/icons/alarmReplyIcon.svg" className="w-8 h-8" />
        ) : (
          <img src="/icons/alarmReviewIcon.svg" className="w-8 h-8" />
        )}
      </div>

      {/* 내용부 */}
      <div className="flex-1 gap-0.5">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-grayscale-warm-gray">
          {tags.map((t) => (
            <span key={t}>#{t} </span>
          ))}
        </p>
        <p className="text-sm text-grayscale-warm-gray">
          {problemName} · {createdAt}
        </p>
      </div>

      {/* X 버튼 */}
      <button className="size-4">
        <img src="/icons/xIcon.svg" />
      </button>
    </div>
  );
};

export default NotificationItem;
