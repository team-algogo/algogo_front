interface MyGroupListCardProps {
  title: string;
  description: string;
  memberCount: number;
  problemCount: number; // API에는 없지만 디자인에 있어서 props로 둠 (없으면 0 처리)
  role: "ADMIN" | "USER" | "MANAGER" | string; // 그룹장 여부 구분
  onClick?: () => void;
  onCancel?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  variant?: "default" | "mypage";
  hideRoleBadge?: boolean;
}

const MyGroupListCard = ({
  title,
  description,
  memberCount,
  problemCount = 0,
  role,
  onClick,
  onCancel,
  onAccept,
  onReject,
  variant = "default",
  hideRoleBadge = false,
}: MyGroupListCardProps) => {
  const containerClasses =
    variant === "mypage"
      ? `group w-full bg-white rounded-xl p-3 flex flex-col justify-between gap-2 shadow-sm border border-gray-100`
      : "group w-full bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md hover:border-primary-main transition-all duration-300 cursor-pointer relative overflow-hidden";

  return (
    <div
      onClick={() => {
        if (onClick) onClick();
      }}
      className={containerClasses}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary-main opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header: Title & Badge */}
      <div className="flex justify-between items-start gap-3">
        <h3 className={`font-bold text-gray-900 line-clamp-1 break-all group-hover:text-primary-main transition-colors ${variant === 'mypage' ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        {!hideRoleBadge && (
          role === "ADMIN" ? (
            <span className="shrink-0 px-2 py-1 bg-blue-50 text-blue-600 text-[10px] uppercase font-bold tracking-wider rounded-md">
              ADMIN
            </span>
          ) : role === "MANAGER" ? (
            <span className="shrink-0 px-2 py-1 bg-yellow-50 text-yellow-600 text-[10px] uppercase font-bold tracking-wider rounded-md">
              MANAGER
            </span>
          ) : (
            <span className="shrink-0 px-2 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider rounded-md">
              MEMBER
            </span>
          )
        )}
      </div>


      {/* Description */}
      <p className={`text-gray-700 leading-relaxed ${variant === 'mypage' ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2 h-[46px]'}`}>
        {description}
      </p>


      {/* Footer: Stats */}
      <div className="flex items-center gap-4 text-xs font-medium text-gray-500 min-h-[36px]">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span className="group-hover:text-gray-700 transition-colors">{memberCount} 명</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span className="group-hover:text-gray-700 transition-colors">{problemCount} 문제</span>
        </div>
        {onCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="ml-auto px-3 py-1.5 text-xs font-medium text-white bg-[#FF6B6B] hover:bg-[#FA5252] rounded-md transition-colors"
            style={{ fontFamily: 'Pretendard-Medium' }}
          >
            신청취소
          </button>
        )}
        {onAccept && onReject && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReject();
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              style={{ fontFamily: 'Pretendard-Medium' }}
            >
              거절
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-primary-main hover:bg-primary-dark rounded-md transition-colors"
              style={{ fontFamily: 'Pretendard-Medium' }}
            >
              수락
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroupListCard;