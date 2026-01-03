import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { postCheckEmail, postCheckNickname, postSignUp } from "@api/auth/auth";

import Button from "@components/button/Button";
import TextLink from "@components/textLink/TextLink";

import BasePage from "@pages/BasePage";

const JoinPage = () => {
  const navigate = useNavigate();

  //#region state

  // input 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 에러 상태
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // 중복확인 완료 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  //#endregion

  //#region useEffect

  // 닉네임 유효성 검사
  const validateNickname = (nickname: string): string => {
    if (!nickname) return "";

    const nicknameRegexp = /^[가-힣a-zA-Z0-9]{2,10}$/;

    if (!nicknameRegexp.test(nickname)) {
      return "한글, 영문, 숫자만 가능하며 2~10자여야 합니다.";
    }

    return "";
  };

  // 닉네임 변경 시 중복확인 초기화
  useEffect(() => {
    setIsNicknameChecked(false);
    const validationError = validateNickname(nickname);
    setNicknameError(validationError);
  }, [nickname]);

  const validateEmail = (email: string): string => {
    if (!email) return "";

    const emailRegexp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

    if (!emailRegexp.test(email)) {
      return "올바른 이메일 형식이 아닙니다.";
    }

    return "";
  };

  // 이메일 변경 시 중복확인 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    const emailError = validateEmail(email);
    setEmailError(emailError);
  }, [email]);

  // 비밀번호 유효성 검사
  const validatePassword = (pw: string): string => {
    if (!pw) return "";

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;

    if (!passwordRegex.test(pw)) {
      return "영자, 숫자, 특수문자를 포함하여 8자 이상 입력해 주세요.";
    }

    return "";
  };

  // 비밀번호 유효성 체크
  useEffect(() => {
    const validationError = validatePassword(password);
    setPasswordError(validationError);
  }, [password]);

  // 비밀번호 확인 체크
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  //#endregion

  //#region onSubmit

  const onSubmitCheckNickname = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const response = await postCheckNickname(nickname);
      console.log(response.data.isAvailable);
      if (response.data.isAvailable) {
        setIsNicknameChecked(true);
        setNicknameError("");
      } else {
        setIsNicknameChecked(false);
        setNicknameError(response.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setNicknameError(err.response?.data.message);
        setIsNicknameChecked(false);
      }
    }
  };

  const onSubmitCheckEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    try {
      const response = await postCheckEmail(email);
      console.log(response.data.isAvailable);

      if (response.data.isAvailable) {
        setIsEmailChecked(true);
        setEmailError("");
      } else {
        setIsEmailChecked(false);
        setEmailError(response.message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setEmailError(err.response?.data.message);
        setIsEmailChecked(false);
      }
    }
  };

  // 회원가입 가능 여부 확인
  const canSubmit = () => {
    return (
      isNicknameChecked &&
      isEmailChecked &&
      !nicknameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      password &&
      confirmPassword
    );
  };

  const onSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit()) {
      if (!isNicknameChecked) setNicknameError("닉네임 중복확인을 해주세요.");
      if (!isEmailChecked) setEmailError("이메일 중복확인을 해주세요.");
      if (!password) setPasswordError("비밀번호를 입력해주세요.");
      if (!confirmPassword)
        setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
      return;
    }

    try {
      await postSignUp(email, password, nickname);
      navigate("/", {
        replace: true,
        state: { showModal: true },
      });
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  return (
    <BasePage>
      <div className="w-full min-h-[calc(100vh-150px)] flex justify-center items-center scale-90">
        <form
          onSubmit={onSubmitSignUp}
          className="flex flex-col gap-10 w-[426px] px-6 py-10 shadow-box rounded-sm"
        >
          {/** title */}
          <div className="font-title text-xl text-center">회원가입</div>

          {/** login input */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label id="nickname">Nickname</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nickname}
                    placeholder="닉네임"
                    onChange={(e) => setNickname(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg shadow-xs focus:outline-none border-2 ${
                      nicknameError
                        ? "border-alert-error"
                        : isNicknameChecked
                          ? "border-alert-success"
                          : "border-transparent"
                    }`}
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onSubmitCheckNickname}
                  >
                    중복확인
                  </Button>
                </div>
                {nicknameError && (
                  <span className="text-alert-error text-sm mt-1">
                    {nicknameError}
                  </span>
                )}
                {isNicknameChecked && !nicknameError && (
                  <span className="text-alert-success text-sm mt-1">
                    사용 가능한 닉네임입니다.
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label id="email">Email</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={email}
                    placeholder="ssafy@ssafy.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg shadow-xs focus:outline-none border-2 ${
                      emailError
                        ? "border-alert-error"
                        : isEmailChecked
                          ? "border-alert-success"
                          : "border-transparent"
                    }`}
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={onSubmitCheckEmail}
                  >
                    중복확인
                  </Button>
                </div>
                {emailError && (
                  <span className="text-alert-error text-sm mt-1">
                    {emailError}
                  </span>
                )}
                {isEmailChecked && !emailError && (
                  <span className="text-alert-success text-sm mt-1">
                    사용 가능한 이메일입니다.
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label id="password">Password</label>
                <input
                  type="password"
                  value={password}
                  placeholder="영문+숫자+특수문자 포함 8자 이상"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`px-3 py-2 rounded-lg shadow-xs focus:outline-none border-2 ${
                    passwordError ? "border-alert-error" : "border-transparent"
                  }`}
                />
                {passwordError && (
                  <span className="text-alert-error text-sm mt-1">
                    {passwordError}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label id="confirmPassword">Password 확인</label>
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="비밀번호 확인"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`px-3 py-2 rounded-lg shadow-xs focus:outline-none border-2 ${
                    confirmPasswordError
                      ? "border-alert-error"
                      : "border-transparent"
                  }`}
                />
                {confirmPasswordError && (
                  <span className="text-alert-error text-sm mt-1">
                    {confirmPasswordError}
                  </span>
                )}
              </div>
            </div>
            <div>
              <Button type="submit">계정 만들기</Button>
            </div>
          </div>

          {/** etc */}
          <div className="flex flex-col gap-6">
            {/** oAuth */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-grayscale-default"></div>
                <span className="text-grayscale-warm-gray text-sm whitespace-nowrap">
                  소셜 계정으로 로그인
                </span>
                <div className="flex-1 h-px bg-grayscale-default"></div>
              </div>
              <div className="flex justify-center gap-10">
                <img src="/icons/login/googleIcon.svg" />
                <img src="/icons/login/naverIcon.svg" />
                <img src="/icons/login/kakaoIcon.svg" />
              </div>
            </div>
            {/** find login info / join */}
            <div className="flex justify-center gap-3 text-grayscale-warm-gray text-sm">
              <span>이미 계정이 있으신가요?</span>
              <TextLink src="/login">
                <span>로그인하기</span>
              </TextLink>
            </div>
          </div>
        </form>
      </div>
    </BasePage>
  );
};

export default JoinPage;
