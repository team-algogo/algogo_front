import { useNavigate } from 'react-router-dom';
import { postLogout } from '@api/auth/auth';
import useAuthStore from '@store/useAuthStore';
import UserProfileCard from './UserProfileCard';

const Sidebar = () => {
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
            onClick={() => navigate('/mypage/settings')}
            className="self-stretch overflow-hidden text-[#050505] text-ellipsis text-base font-medium leading-[130%] tracking-[-0.16px] line-clamp-1 text-left hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'IBM Plex Sans KR' }}
          >
            회원정보관리
          </button>
          <button
            onClick={handleLogout}
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
