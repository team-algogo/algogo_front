import UserProfileCard from './UserProfileCard';

const Sidebar = () => {
  return (
    <aside className="flex w-[280px] flex-col items-start gap-10">
      <UserProfileCard />

      {/* Settings */}
      <div className="flex flex-col items-start gap-3 self-stretch">
        <h3
          className="self-stretch overflow-hidden text-[#777A80] text-ellipsis text-xs font-normal leading-[130%] tracking-[-0.12px] line-clamp-1"
          style={{ fontFamily: 'IBM Plex Sans KR' }}
        >
          계정 관리
        </h3>
        <div className="flex flex-col items-start gap-4 self-stretch">
          <button
            className="self-stretch overflow-hidden text-[#050505] text-ellipsis text-base font-medium leading-[130%] tracking-[-0.16px] line-clamp-1 text-left hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'IBM Plex Sans KR' }}
          >
            회원정보관리
          </button>
          <button
            className="self-stretch overflow-hidden text-[#050505] text-ellipsis text-base font-medium leading-[130%] tracking-[-0.16px] line-clamp-1 text-left hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'IBM Plex Sans KR' }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
