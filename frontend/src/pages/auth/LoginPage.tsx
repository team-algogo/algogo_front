import { useState } from "react";

import BasePage from "@pages/BasePage";

import Button from "@components/button/Button";
import TextLink from "@components/textLink/TextLink";

import { postLogin } from "@api/auth/auth";
import useAuthStore from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUserType, setAuthorization } = useAuthStore();

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
    }
  };

  return (
    <BasePage>
      <div className="w-full min-h-[calc(100vh-150px)] flex justify-center items-center py-6">
        <form
          onSubmit={onSubmitLogin}
          className="flex flex-col gap-10 w-[426px] px-6 py-10 shadow-box rounded-sm scale-90"
        >
          {/** title */}
          <div className="font-title text-xl text-center">로그인</div>

          {/** login input */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label id="email">Email</label>
                <input
                  type="text"
                  value={email}
                  placeholder="이메일 또는 아이디"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="px-3 py-2 rounded-lg shadow-xs focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label id="password">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="px-3 py-2 rounded-lg shadow-xs focus:outline-none"
                />
              </div>
            </div>
            <div>
              <Button type="submit">로그인</Button>
            </div>
          </div>

          {/** etc */}
          <div className="flex flex-col gap-6">
            {/** oAuth */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm whitespace-nowrap">
                  소셜 계정으로 로그인
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <div className="flex justify-center gap-10">
                <img src="/icons/login/googleIcon.svg" />
                <img src="/icons/login/naverIcon.svg" />
                <img src="/icons/login/kakaoIcon.svg" />
              </div>
            </div>
            {/** find login info / join */}
            <div className="flex justify-center gap-3 text-gray-500 text-sm">
              <TextLink src="#">
                <span>아이디(계정) · 비밀번호 찾기</span>
              </TextLink>

              <div className="h-4 w-px bg-gray-300"></div>

              <TextLink src="/join">
                <span>회원가입</span>
              </TextLink>
            </div>
          </div>
        </form>
      </div>
    </BasePage>
  );
};

export default LoginPage;
