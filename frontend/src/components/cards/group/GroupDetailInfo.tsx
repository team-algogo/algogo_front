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
    <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl p-6 flex flex-col gap-4 shadow-sm bg-transparent border-none p-0 shadow-none">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-grayscale-warm-gray font-bold">
            SSAFY 14기 알고리즘
          </span>
          <h1 className="font-headline text-2xl text-grayscale-dark-gray">
            {title}
          </h1>
        </div>
        {/* 우측 상단 컨텐츠 (버튼 등) */}
        {rightContent && <div>{rightContent}</div>}
      </div>

      <p className="font-body text-grayscale-dark-gray whitespace-pre-wrap">
        {description}
      </p>

      <div className="flex items-center gap-6 text-sm text-grayscale-dark-gray mt-2">
        <div className="flex items-center gap-1.5">
          <img src="/icons/groupIcon.svg" className="size-5 opacity-60" alt="member" />
          <span>멤버 {memberCount}명</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/icons/bookIcon.svg" className="size-5 opacity-60" alt="problem" />
          <span>문제 {problemCount}개</span>
        </div>
        <div className="flex items-center gap-1.5">
          <img src="/icons/clockIcon.svg" className="size-5 opacity-60" alt="date" />
          <span>생성일 {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailInfo;