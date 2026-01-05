import { useNavigate } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";
import { postLogout } from "@api/auth/auth";
import useAuthStore from "@store/useAuthStore";
import UserProfileCard from "./UserProfileCard";

type ViewMode = "참여 현황" | "활동 내역" | "작성 리뷰";

interface SidebarProps {
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const Sidebar = ({ setViewMode }: SidebarProps) => {
  const navigate = useNavigate();

  // Wait, I recall useAuthStore has setAuthorization and setUserType. I should check if it has a logout action or just manually clear.
  // Checking store file previously: setAuthorization, setUserType. No explicit logout action.
  // So I'll manually distinct them.

  const handleLogout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("Logout API failed", error);
      // creating a robust logout even if API fails
    } finally {
      useAuthStore.getState().setAuthorization("");
      useAuthStore.getState().setUserType(null);
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <aside className="flex w-[280px] flex-col items-start gap-10">
      <UserProfileCard setViewMode={setViewMode} />

      {/* Settings */}
      <div className="flex flex-col items-start gap-3 self-stretch">
        <h3
          className="line-clamp-1 self-stretch overflow-hidden text-xs leading-[130%] font-normal tracking-[-0.12px] text-ellipsis text-[#777A80]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          계정 관리
        </h3>
        <div className="flex flex-col items-start gap-4 self-stretch">
          <button
            onClick={() => navigate("/mypage/settings")}
            className="line-clamp-1 self-stretch overflow-hidden text-left text-base leading-[130%] font-medium tracking-[-0.16px] text-ellipsis text-[#050505] transition-opacity hover:opacity-70"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            회원정보관리
          </button>
          <button
            onClick={handleLogout}
            className="line-clamp-1 self-stretch overflow-hidden text-left text-base leading-[130%] font-medium tracking-[-0.16px] text-ellipsis text-[#050505] transition-opacity hover:opacity-70"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
