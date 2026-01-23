import { postLogout, getCheckUser } from "@api/auth/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TextLink from "@components/textLink/TextLink";
import useAuthStore from "@store/useAuthStore";
import Logo from "@components/header/Logo";

import NotificationContainer from "@components/notification/NotificationContainer";
import AlertModal from "@components/modal/alarm/AlertModal";
import { useModalStore } from "@store/useModalStore";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userType, setUserType, setAuthorization } = useAuthStore();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();
  const navigate = useNavigate();

  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCheckUser,
    enabled: !!userType, // Only fetch if user is logged in
  });

  const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await postLogout();
      if (response.status == 200) {
        // Clear notifications cache to prevent data leakage between users
        queryClient.removeQueries({ queryKey: ["notifications"] });
        queryClient.removeQueries({ queryKey: ["currentUser"] });

        setUserType(null);
        setAuthorization("");
        navigate("/intro");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCampaignClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal("campaign");
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-center gap-8">
            <Logo />

            <nav className="hidden h-full items-center gap-1 md:flex">
              {/* Navigation items - Unified typography: 15px for consistent Korean font rendering, font-medium (500), letter-spacing -0.01em, line-height 1.5 */}
              <TextLink
                src="/problemset"
                className="nav-menu-item hover:text-primary-600 rounded-md px-4 py-2 text-[15px] leading-[1.5] font-medium tracking-[-0.01em] text-gray-700 transition-colors hover:bg-gray-50"
              >
                문제집
              </TextLink>
              <button
                onClick={handleCampaignClick}
                className="nav-menu-item hover:text-primary-600 rounded-md px-4 py-2 text-[15px] leading-[1.5] font-medium tracking-[-0.01em] text-gray-700 transition-colors hover:bg-gray-50"
              >
                캠페인
              </button>
              <TextLink
                src="/group"
                className="nav-menu-item hover:text-primary-600 rounded-md px-4 py-2 text-[15px] leading-[1.5] font-medium tracking-[-0.01em] text-gray-700 transition-colors hover:bg-gray-50"
              >
                그룹방
              </TextLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/search"
              className="hover:text-primary-600 flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-50"
            >
              <img
                src="/icons/searchIconBlack.svg"
                className="size-5"
                alt="Search"
              />
            </a>

            <div className="mx-1 hidden h-4 w-px bg-gray-300 sm:block"></div>

            <div className="flex items-center gap-2">
              {userType == "User" ? (
                <>
                  {userData?.data && (
                    <div className="flex items-center mr-0.5">
                      <span className="text-[15px] font-bold text-gray-900 tracking-tight">
                        {userData.data.nickname}
                      </span>
                      <span className="text-sm font-medium text-gray-500 ml-0.5">
                        님
                      </span>
                    </div>
                  )}
                  <NotificationContainer />
                  <TextLink
                    src="/mypage"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    마이페이지
                  </TextLink>
                  <TextLink
                    src="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    onClick={logout}
                  >
                    로그아웃
                  </TextLink>
                </>
              ) : (
                <TextLink
                  src="/login"
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium"
                >
                  로그인
                </TextLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Campaign Feature Alert */}
      <AlertModal.Content modalType="campaign" autoCloseDelay={2000}>
        <div className="mb-4 text-4xl">🚧</div>
        <AlertModal.Message className="mb-2 text-lg font-semibold text-gray-900">
          캠페인 기능은 준비 중입니다!
        </AlertModal.Message>
        <p className="mb-6 text-sm text-gray-500">조금만 기다려주세요.</p>
        <button
          onClick={closeModal}
          className="w-full rounded-md bg-gray-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-black"
        >
          확인
        </button>
      </AlertModal.Content>
    </>
  );
};

export default Header;
