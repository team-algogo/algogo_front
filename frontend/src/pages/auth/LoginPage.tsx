import { useState, useEffect } from "react";
import PasswordResetModal from "@components/modal/auth/PasswordResetModal";

import BasePage from "@pages/BasePage";
import Toast from "@components/toast/Toast";

import Button from "@components/button/Button";
import TextLink from "@components/textLink/TextLink";

import { postLogin } from "@api/auth/auth";
import useAuthStore from "@store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "@components/modal/alarm/AlertModal";
import { useModalStore } from "@store/useModalStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [showLoginRequiredBanner, setShowLoginRequiredBanner] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const { setUserType, setAuthorization } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setShowToast(true);
      // Clear state so toast doesn't show on refresh
      window.history.replaceState({}, document.title);
    }
    if (location.state?.requireLogin) {
      setShowLoginRequiredBanner(true);
      setBannerVisible(true);
      setRedirectTo(location.state.redirectTo || null);
      // Clear state so banner doesn't show on refresh
      window.history.replaceState({}, document.title);

      // 3초 후 배너 fade-out 시작
      const fadeTimer = setTimeout(() => {
        setBannerVisible(false);
      }, 3000);

      // fade-out 애니메이션 후 완전히 제거
      const removeTimer = setTimeout(() => {
        setShowLoginRequiredBanner(false);
      }, 3500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [location]);

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await postLogin(email, password);
      const accessToken = response.headers.authorization;
      setUserType("User");
      setAuthorization(accessToken);
      // 리다이렉트 경로가 있으면 해당 경로로, 없으면 메인으로
      navigate(redirectTo || "/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(true);
      openModal("alert");
    }
  };

  return (
    <BasePage>
      {showToast && (
        <Toast
          message="회원가입이 완료되었습니다. 로그인을 진행해주세요."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
      {showToast && (
        <Toast
          message="회원가입이 완료되었습니다. 로그인을 진행해주세요."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Password Reset Modal */}
      {isResetModalOpen && (
        <PasswordResetModal onClose={() => setIsResetModalOpen(false)} />
      )}

      {/* 로그인 필요 안내 배너 - fixed position으로 레이아웃 shift 방지 */}
      {showLoginRequiredBanner && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4 transition-opacity duration-500 ${bannerVisible ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-600 flex-shrink-0"
            >
              <path
                d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm font-medium text-blue-900">
              로그인이 필요한 서비스입니다.
            </p>
          </div>
        </div>
      )}
      <div className="w-full min-h-[calc(100vh-200px)] flex justify-center items-center py-10">
        <form
          onSubmit={onSubmitLogin}
          className="flex flex-col gap-8 w-full max-w-[420px] px-8 py-10 bg-white shadow-card rounded-lg border border-gray-100"
        >
          {/** title */}
          <div className="text-center">
            <h1 className="font-headline text-2xl text-gray-900 mb-2">로그인</h1>
            <p className="text-gray-500 text-sm">서비스 이용을 위해 로그인해주세요.</p>
          </div>

          {/** login input */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  placeholder="이메일 또는 아이디 입력"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  autoComplete="email"
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-sm placeholder-gray-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="비밀번호 입력"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  autoComplete="current-password"
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-sm placeholder-gray-400"
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-sm text-status-error animate-in fade-in slide-in-from-top-1">
                  <img src="/icons/errorIcon.svg" className="size-4" alt="error" />
                  <span>이메일 혹은 비밀번호를 확인해주세요</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" size="lg">로그인</Button>
          </div>

          {/** etc */}
          <div className="flex flex-col gap-6">

            {/** find login info / join */}
            <div className="flex justify-center gap-4 text-gray-500 text-sm">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                비밀번호 재설정
              </button>

              <div className="h-4 w-px bg-gray-300 my-auto"></div>

              <TextLink src="/join">
                <span className="text-primary-600 font-medium hover:text-primary-700">회원가입</span>
              </TextLink>
            </div>
          </div>
        </form>
      </div >

      <AlertModal.Content autoCloseDelay={0}>
        <div className="text-4xl mb-4">😢</div>
        <AlertModal.Message className="font-semibold text-lg text-gray-900 mb-2">
          로그인에 실패하였습니다
        </AlertModal.Message>
        <p className="text-gray-500 text-sm mb-6">
          아이디 또는 비밀번호를 다시 확인해주세요.
        </p>
        <button
          onClick={closeModal}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-md hover:bg-black transition-colors font-medium w-full"
        >
          확인
        </button>
      </AlertModal.Content>
    </BasePage >
  );
};

export default LoginPage;
