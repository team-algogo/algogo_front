import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

import UserProfileCard from "./UserProfileCard";

type ViewMode = "참여 현황" | "내가 푼 문제" | "리뷰 요청" | "받은 리뷰" | "작성 리뷰" | "초대/신청 현황";

interface SidebarProps {
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const Sidebar = ({ setViewMode }: SidebarProps) => {
  const navigate = useNavigate();



  return (
    <aside className="sticky top-24 flex w-full max-w-[280px] flex-col gap-6">
      <UserProfileCard setViewMode={setViewMode} />

      {/* My Activity */}
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-500 text-xs font-semibold px-2">
          내 활동
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setViewMode("참여 현황")}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors font-medium text-sm"
          >
            참여 현황
          </button>
          <button
            onClick={() => setViewMode("내가 푼 문제")}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors font-medium text-sm"
          >
            내가 푼 문제
          </button>
          <button
            onClick={() => setViewMode("초대/신청 현황")}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors font-medium text-sm"
          >
            초대 / 신청
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col gap-2">
        <h3 className="text-gray-500 text-xs font-semibold px-2">
          계정 관리
        </h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate('/mypage/settings')}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-md transition-colors font-medium text-sm"
          >
            회원정보관리
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
