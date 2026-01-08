import { useNavigate } from 'react-router-dom';
import { postLogout } from '@api/auth/auth';
import useAuthStore from '@store/useAuthStore';
import UserProfileCard from './UserProfileCard';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      useAuthStore.getState().setAuthorization("");
      useAuthStore.getState().setUserType(null);
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <aside className="sticky top-24 flex w-full max-w-[280px] flex-col gap-6">
      <UserProfileCard />

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
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-status-error rounded-md transition-colors font-medium text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
