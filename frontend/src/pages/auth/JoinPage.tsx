import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "@components/button/Button";
import TextLink from "@components/textLink/TextLink";
import useToastStore from "@store/useToastStore";
import BasePage from "@pages/BasePage";
import { postCheckEmail, postCheckNickname, postSignUp, postEmailVerificationRequest, postEmailVerification } from "@api/auth/auth";

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? "" : "잘못된 이메일 형식입니다.";
};

const JoinPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  // input 상태
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(""); // [NEW]

  // 에러 상태
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState(""); // [NEW]

  // 중복확인/인증 완료 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false); // Used as "Is Email Verified"
  const [isVerificationSent, setIsVerificationSent] = useState(false); // [NEW]

  // ... handlers ...

  const onSubmitCheckNickname = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const duplicateResponse = await postCheckNickname(nickname);
      if (!duplicateResponse.data.isAvailable) {
        setNicknameError(duplicateResponse.message || "이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
        return;
      }
      setNicknameError("");
      setIsNicknameChecked(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setNicknameError(err.response?.data.message || "중복 확인 중 오류가 발생했습니다.");
        setIsNicknameChecked(false);
      }
    }
  };

  const onSubmitCheckEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setVerificationError("");

    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    // 1. Check Format
    const formatError = validateEmail(email);
    if (formatError) {
      setEmailError(formatError);
      return;
    }

    try {
      // 2. Check Duplication
      const duplicateResponse = await postCheckEmail(email);
      if (!duplicateResponse.data.isAvailable) {
        setEmailError(duplicateResponse.message || "이미 사용 중인 이메일입니다.");
        setIsEmailChecked(false);
        return;
      }
      setEmailError(""); // Clear error if available

      // 3. Request Verification Code
      addToast({
        message: "인증번호가 전송되었습니다. 이메일을 확인해주세요.",
        type: "success",
        position: "top-center"
      });
      setIsVerificationSent(true);

      // Send email in background (or await but we already showed success)
      try {
        await postEmailVerificationRequest(email);
      } catch (err) {
        // If it actually fails, show error toast
        if (axios.isAxiosError(err)) {
          addToast({
            message: err.response?.data.message || "인증번호 전송에 실패했습니다.",
            type: "error",
            position: "top-center"
          });
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setEmailError(err.response?.data.message);
        setIsEmailChecked(false);
      }
    }
  };

  const onSubmitVerifyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setVerificationError("인증번호를 입력해주세요.");
      return;
    }

    try {
      await postEmailVerification(email, verificationCode);
      setIsEmailChecked(true); // Verified!
      setVerificationError("");

      addToast({
        message: "이메일 인증에 성공했습니다.",
        type: "success",
        position: "top-center"
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setVerificationError(err.response?.data.message || "인증번호가 올바르지 않습니다.");
        setIsEmailChecked(false);
      }
    }
  };

  const onSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isNicknameChecked) {
      setNicknameError("닉네임 중복 확인을 해주세요.");
      return;
    }
    if (!isEmailChecked) {
      setEmailError("이메일 인증을 완료해주세요.");
      return;
    }
    if (!password || password.length < 8) {
      setPasswordError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await postSignUp(email, password, nickname);
      // alert("회원가입이 완료되었습니다."); 
      // Instead of alert, navigate with state to show toast on login page
      navigate("/login", { state: { signupSuccess: true } });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        addToast({
          message: err.response?.data.message || "회원가입에 실패했습니다.",
          type: "error",
          position: "top-center"
        });
      }
    }
  };

  return (
    <BasePage>
      <div className="w-full min-h-[calc(100vh-200px)] flex justify-center items-center py-10">
        <div className="flex flex-col gap-8 w-full max-w-[480px] px-8 py-10 bg-white shadow-card rounded-lg border border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
            <p className="text-gray-500 text-sm">서비스 이용을 위해 회원가입을 진행해주세요.</p>
          </div>

          <form onSubmit={onSubmitSignup}>
            <div className="flex flex-col gap-5">

              {/* Nickname */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nickname" className="text-sm font-medium text-gray-700">닉네임</label>
                <div className="flex gap-2">
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    placeholder="닉네임 입력"
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsNicknameChecked(false);
                      setNicknameError("");
                    }}
                    className={`flex-1 h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${nicknameError
                      ? "border-status-error focus:border-status-error focus:ring-status-error"
                      : isNicknameChecked
                        ? "border-status-success focus:border-status-success focus:ring-status-success bg-gray-50 text-gray-500"
                        : "focus:border-primary-500 focus:ring-primary-500"
                      }`}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={onSubmitCheckNickname}
                    disabled={isNicknameChecked}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsVerificationSent(false); // Reset on change
                      setIsEmailChecked(false);
                    }}
                    disabled={isEmailChecked}
                    className={`flex-1 h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${emailError
                      ? "border-status-error focus:border-status-error focus:ring-status-error"
                      : isEmailChecked
                        ? "border-status-success focus:border-status-success focus:ring-status-success bg-gray-50 text-gray-500"
                        : "focus:border-primary-500 focus:ring-primary-500"
                      }`}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={onSubmitCheckEmail}
                    disabled={isEmailChecked}
                    className="shrink-0"
                  >
                    {isVerificationSent ? "재전송" : "인증요청"}
                  </Button>
                </div>
                {emailError && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {emailError}
                  </span>
                )}
                {isEmailChecked && !emailError && (
                  <span className="text-status-success text-xs animate-in fade-in slide-in-from-top-1">
                    이메일 인증이 완료되었습니다.
                  </span>
                )}

                {/* Verification Code Input */}
                {isVerificationSent && !isEmailChecked && (
                  <div className="flex gap-2 mt-1 animate-in fade-in slide-in-from-top-1">
                    <input
                      type="text"
                      value={verificationCode}
                      placeholder="인증번호 입력"
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className={`flex-1 h-10 px-3 rounded-md border border-gray-300 focus:ring-1 outline-none transition-all text-sm placeholder-gray-400 ${verificationError ? "border-status-error focus:border-status-error focus:ring-status-error" : "focus:border-primary-500 focus:ring-primary-500"
                        }`}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      type="button"
                      onClick={onSubmitVerifyCode}
                      className="shrink-0"
                    >
                      인증확인
                    </Button>
                  </div>
                )}
                {verificationError && !isEmailChecked && (
                  <span className="text-status-error text-xs animate-in fade-in slide-in-from-top-1">
                    {verificationError}
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

              <Button type="submit" className="w-full mt-4" size="lg">계정 만들기</Button>
            </div >

            {/** etc */}
            <div className="flex flex-col gap-6 mt-6">
              <div className="flex justify-center gap-4 text-gray-500 text-sm">
                <span>이미 계정이 있으신가요?</span>
                <TextLink src="/login">
                  <span className="text-primary-600 font-medium hover:text-primary-700">로그인하기</span>
                </TextLink>
              </div>
            </div >
          </form >
        </div>
      </div >
    </BasePage >
  );
};

export default JoinPage;
