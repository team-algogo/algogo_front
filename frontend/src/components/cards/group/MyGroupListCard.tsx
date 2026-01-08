interface MyGroupListCardProps {
  title: string;
  description: string;
  memberCount: number;
  problemCount: number; // API에는 없지만 디자인에 있어서 props로 둠 (없으면 0 처리)
  role: "ADMIN" | "USER"; // 그룹장 여부 구분
  onClick?: () => void;
}

const MyGroupListCard = ({
  title,
  description,
  memberCount,
  problemCount = 0,
  role,
  onClick,
}: MyGroupListCardProps) => {
  return (
    <div
      onClick={() => {
        console.log("MyGroupListCard clicked");
        if (onClick) onClick();
      }}
      className="w-full bg-primary-50 border-2 border-primary-main rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >

      {/* Header: Title & Badge */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-headline text-lg text-grayscale-dark-gray line-clamp-1 break-all">
          {title}
        </h3>
        {role === "ADMIN" ? (
          <span className="px-2 py-1 bg-primary-main text-white text-[10px] font-bold rounded-md shrink-0">
            그룹장
          </span>
        ) : (
          <span className="px-2 py-1 bg-primary-200 text-primary-main text-[10px] font-bold rounded-md shrink-0">
            멤버
          </span>
        )}
      </div>

      {/* Description */}
      <p className="font-body text-sm text-grayscale-dark-gray line-clamp-2 h-[40px]">
        {description}
      </p>

      {/* Stats (Member & Problem) */}
      <div className="flex items-center gap-3 text-sm text-grayscale-dark-gray">
        <div className="flex items-center gap-1">
          {/* 사람 아이콘 SVG */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" fill="#5F6368" />
          </svg>
          <span>{memberCount}명</span>
        </div>
        <div className="flex items-center gap-1">
          {/* 책/문제 아이콘 SVG */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H12V14.5C12 14.78 11.78 15 11.5 15H2.5C2.22 15 2 14.78 2 14.5V2H0V14.5C0 15.88 1.12 17 2.5 17H11.5C12.88 17 14 15.88 14 14.5V2ZM14 0H4C2.9 0 2 0.9 2 2V12H14V0Z" fill="#5F6368" />
          </svg>
          <span>{problemCount}문제</span>
        </div>
      </div>

      {/* Avatars (Mockup based on design) */}
      <div className="flex items-center -space-x-2 pt-2">
        {/* 디자인처럼 동그라미 겹치기 (3개만 예시로 보여줌) */}
        <div className="size-8 rounded-full bg-primary-main text-white flex items-center justify-center text-[10px] border-2 border-white font-bold">김</div>
        <div className="size-8 rounded-full bg-primary-main text-white flex items-center justify-center text-[10px] border-2 border-white font-bold">이</div>
        <div className="size-8 rounded-full bg-primary-main text-white flex items-center justify-center text-[10px] border-2 border-white font-bold">박</div>
        <div className="size-8 rounded-full bg-grayscale-default text-grayscale-dark-gray flex items-center justify-center text-[10px] border-2 border-white font-bold">
          +{memberCount > 3 ? memberCount - 3 : 0}
        </div>
      </div>
    </div>
  );
};

export default MyGroupListCard;