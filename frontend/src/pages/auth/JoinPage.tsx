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
      navigate("/login", {
        replace: true,
        state: { signupSuccess: true },
      });
    } catch (err) {
      console.log(err);
    }
  };

  //#endregion

  return (
    <BasePage>
      <div className="w-full min-h-[calc(100vh-200px)] flex justify-center items-center py-10">
        <form
          onSubmit={onSubmitSignUp}
          className="flex flex-col gap-8 w-full max-w-[420px] px-8 py-10 bg-white shadow-card rounded-lg border border-gray-100"
        >
          {/** title */}
          <div className="text-center">
            <h1 className="font-headline text-2xl text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-500 text-sm">알고가자의 회원이 되어 함께 성장하세요!</p>
          </div>

          {/** join input */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">

              {/* Nickname */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nickname" className="text-sm font-medium text-gray-700">닉네임</label>
                <div className="flex gap-2">
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    placeholder="2~10자"
                    onChange={(e) => setNickname(e.target.value)}
                    className={`flex-1 h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${nicknameError
                      ? "border-status-error focus:border-status-error focus:ring-status-error"
                      : isNicknameChecked
                        ? "border-status-success focus:border-status-success focus:ring-status-success"
                        : "focus:border-primary-500 focus:ring-primary-500"
                      }`}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={onSubmitCheckNickname}
                    className="shrink-0"
                  >
                    중복확인
                  </Button>
                </div>
                {nicknameError && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {nicknameError}
                  </span>
                )}
                {isNicknameChecked && !nicknameError && (
                  <span className="text-status-success text-xs animate-in fade-in slide-in-from-top-1">
                    사용 가능한 닉네임입니다.
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</label>
                <div className="flex gap-2">
                  <input
                    id="email"
                    type="text"
                    value={email}
                    placeholder="ssafy@ssafy.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-1 h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${emailError
                      ? "border-status-error focus:border-status-error focus:ring-status-error"
                      : isEmailChecked
                        ? "border-status-success focus:border-status-success focus:ring-status-success"
                        : "focus:border-primary-500 focus:ring-primary-500"
                      }`}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={onSubmitCheckEmail}
                    className="shrink-0"
                  >
                    중복확인
                  </Button>
                </div>
                {emailError && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {emailError}
                  </span>
                )}
                {isEmailChecked && !emailError && (
                  <span className="text-status-success text-xs animate-in fade-in slide-in-from-top-1">
                    사용 가능한 이메일입니다.
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="영문+숫자+특수문자 포함 8자 이상"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${passwordError ? "border-status-error focus:border-status-error focus:ring-status-error" : "focus:border-primary-500 focus:ring-primary-500"
                    }`}
                />
                {passwordError && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {passwordError}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  placeholder="비밀번호 확인"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${confirmPasswordError
                    ? "border-status-error focus:border-status-error focus:ring-status-error"
                    : "focus:border-primary-500 focus:ring-primary-500"
                    }`}
                />
                {confirmPasswordError && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {confirmPasswordError}
                  </span>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" size="lg">계정 만들기</Button>
          </div>

          {/** etc */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-3 text-gray-500 text-sm">
              <span>이미 계정이 있으신가요?</span>
              <TextLink src="/login">
                <span className="text-primary-600 font-medium hover:text-primary-700">로그인하기</span>
              </TextLink>
            </div>
          </div>
        </form>
      </div>
    </BasePage>
  );
};

export default JoinPage;
