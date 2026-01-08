import { useState, useEffect } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { setUserType, setAuthorization } = useAuthStore();
  const { openModal, closeModal } = useModalStore();

  useEffect(() => {
    if (location.state?.signupSuccess) {
      setShowToast(true);
      // Clear state so toast doesn't show on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await postLogin(email, password);
      const accessToken = response.headers.authorization;
      setUserType("User");
      setAuthorization(accessToken);
      navigate("/", { replace: true });
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
            {/** oAuth */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
                  SNS 계정으로 간편 로그인
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <div className="flex justify-center gap-6">
                <button type="button" className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
                  <img src="/icons/login/GoogleIcon.svg" className="size-5" alt="Google" />
                </button>
                <button type="button" className="size-10 rounded-full bg-[#03C75A]/10 flex items-center justify-center hover:bg-[#03C75A]/20 transition-colors border border-transparent">
                  <img src="/icons/login/NaverIcon.svg" className="size-4" alt="Naver" />
                </button>
                <button type="button" className="size-10 rounded-full bg-[#FEE500]/20 flex items-center justify-center hover:bg-[#FEE500]/40 transition-colors border border-transparent">
                  <img src="/icons/login/KakaoIcon.svg" className="size-5" alt="Kakao" />
                </button>
              </div>
            </div>
            {/** find login info / join */}
            <div className="flex justify-center gap-4 text-gray-500 text-sm">
              <TextLink src="#">
                <span className="text-gray-500 hover:text-gray-800">아이디/비밀번호 찾기</span>
              </TextLink>

              <div className="h-4 w-px bg-gray-300 my-auto"></div>

              <TextLink src="/join">
                <span className="text-primary-600 font-medium hover:text-primary-700">회원가입</span>
              </TextLink>
            </div>
          </div>
        </form>
      </div>

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
    </BasePage>
  );
};

export default LoginPage;
