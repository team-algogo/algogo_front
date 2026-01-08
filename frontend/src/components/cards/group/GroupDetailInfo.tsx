interface GroupDetailInfoProps {
  title: string;
  description: string;
  memberCount: number;
  problemCount: number;
  createdAt: string;
  rightContent?: React.ReactNode; // [NEW] 우측 상단 버튼 영역
}

const GroupDetailInfo = ({
  title,
  description,
  memberCount,
  problemCount,
  createdAt,
  rightContent,
}: GroupDetailInfoProps) => {
  // 날짜 포맷팅
  const formattedDate = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-primary-main tracking-wider uppercase">
              SSAFY 14기 알고리즘
            </span>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {title}
            </h1>
          </div>
          {/* 우측 상단 컨텐츠 (버튼 등) */}
          {rightContent && <div>{rightContent}</div>}
        </div>

        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap max-w-4xl text-sm">
          {description}
        </p>
      </div>

      {/* Stats Row (Simple Text) */}
      <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">멤버</span>
          <span>{memberCount}명</span>
        </div>
        <div className="w-[1px] h-3 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">문제</span>
          <span>{problemCount}개</span>
        </div>
        <div className="w-[1px] h-3 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">생성일</span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailInfo;