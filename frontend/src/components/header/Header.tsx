import { postLogout } from "@api/auth/auth";
import { useQueryClient } from "@tanstack/react-query";
import TextLink from "@components/textLink/TextLink";
import useAuthStore from "@store/useAuthStore";

import NotificationContainer from "@components/notification/NotificationContainer";
import AlertModal from "@components/modal/alarm/AlertModal";
import { useModalStore } from "@store/useModalStore";

const Header = () => {
  const { userType, setUserType, setAuthorization } = useAuthStore();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await postLogout();
      if (response.status == 200) {
        // Clear notifications cache to prevent data leakage between users
        queryClient.removeQueries({ queryKey: ["notifications"] });

        setUserType(null);
        setAuthorization("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCampaignClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal("campaign");
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 transition-colors">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 items-center h-full">
            <a href="/" className="text-xl font-bold tracking-tight h-full flex items-center">
              <span className="text-logo text-2xl">알고가자</span>
            </a>

            <nav className="hidden md:flex gap-1 h-full items-center">
              <TextLink src="/problemset" className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                문제집
              </TextLink>
              <button
                onClick={handleCampaignClick}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium transition-colors text-base"
              >
                캠페인
              </button>
              <TextLink src="/group" className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md font-medium transition-colors">
                그룹방
              </TextLink>
            </nav>
          </div>

          <div className="flex gap-4 items-center">
            <a href="/search" className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-full transition-colors flex items-center justify-center">
              <img src="/icons/searchIconBlack.svg" className="size-5" alt="Search" />
            </a>

            <div className="h-4 w-px bg-gray-300 mx-1 hidden sm:block"></div>

            <div className="flex gap-2 items-center">
              {userType == "User" ? (
                <>
                  <NotificationContainer />
                  <TextLink src="/mypage" className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    마이페이지
                  </TextLink>
                  <TextLink src="/" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" onClick={logout}>
                    로그아웃
                  </TextLink>
                </>
              ) : (
                <TextLink src="/login" variant="secondary" className="px-4 py-2 text-sm font-medium">
                  로그인
                </TextLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Campaign Feature Alert */}
      <AlertModal.Content modalType="campaign" autoCloseDelay={2000}>
        <div className="text-4xl mb-4">🚧</div>
        <AlertModal.Message className="font-semibold text-lg text-gray-900 mb-2">
          캠페인 기능은 준비 중입니다!
        </AlertModal.Message>
        <p className="text-gray-500 text-sm mb-6">
          조금만 기다려주세요.
        </p>
        <button
          onClick={closeModal}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-black transition-colors font-medium w-full"
        >
          확인
        </button>
      </AlertModal.Content>
    </>
  );
};

export default Header;
