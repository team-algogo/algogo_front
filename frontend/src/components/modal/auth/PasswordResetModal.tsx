import { useState } from "react";
import Button from "@components/button/Button";
import { postResetPassword, postPasswordResetCodeRequest } from "@api/auth/auth";

interface PasswordResetModalProps {
    onClose: () => void;
}

type Step = "REQUEST_CODE" | "RESET_PASSWORD" | "SUCCESS";

export default function PasswordResetModal({ onClose }: PasswordResetModalProps) {
    const [step, setStep] = useState<Step>("REQUEST_CODE");

    // Form States
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI States
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    // Step 1: Request Verification Code
    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSending(true);
        setError("");

        try {
            // Using existing API to send verification code
            await postPasswordResetCodeRequest(email);
            setStep("RESET_PASSWORD");
        } catch (err: any) {
            console.error(err);
            // Check if error response has specific message, otherwise default
            const msg = err.response?.data?.message || "인증번호 발송에 실패했습니다. 이메일을 확인해주세요.";
            setError(msg);
        } finally {
            setSending(false);
        }
    };

    // Step 2: Reset Password with Code
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !newPassword) return;

        if (newPassword !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=\S+$).{8,16}$/;
        if (!passwordRegex.test(newPassword)) {
            setError("비밀번호는 영문, 숫자, 특수문자 포함 8~16자여야 합니다.");
            return;
        }

        setSending(true);
        setError("");

        try {
            const response = await postResetPassword(email, code, newPassword);
            if (response.status === 200) {
                setStep("SUCCESS");
            }
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || "비밀번호 재설정에 실패했습니다. 인증번호를 확인해주세요.";
            setError(msg);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {step === "SUCCESS" ? "변경 완료" : "비밀번호 재설정"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                {/* Step 1: Request Code */}
                {step === "REQUEST_CODE" && (
                    <>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            가입하신 이메일 주소를 입력해 주시면<br />
                            <span className="font-semibold text-primary-600">인증번호</span>를 전송해 드립니다.
                        </p>
                        <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reset-email" className="text-sm font-medium text-gray-700">이메일</label>
                                <input
                                    id="reset-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    placeholder="name@example.com"
                                    className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-base placeholder-gray-400"
                                    autoFocus
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 p-3 rounded-md animate-in slide-in-from-top-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    취소
                                </button>
                                <Button
                                    type="submit"
                                    className="flex-[2]"
                                    size="lg"
                                    disabled={sending || !email}
                                >
                                    {sending ? "전송 중..." : "인증번호 받기"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 2: Verify & Reset */}
                {step === "RESET_PASSWORD" && (
                    <>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            이메일로 전송된 <span className="font-semibold text-primary-600">인증번호 6자리</span>와<br />
                            새로운 비밀번호를 입력해주세요.
                        </p>
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                            {/* Read-only Email Field so user knows where it was sent */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-500">이메일</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="auth-code" className="text-sm font-medium text-gray-700">인증번호</label>
                                    <input
                                        id="auth-code"
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-base tracking-widest placeholder-normal"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="new-password" className="text-sm font-medium text-gray-700">새 비밀번호</label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="영문, 숫자, 특수문자 포함 8~16자"
                                        className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all text-base"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="비밀번호를 한번 더 입력해주세요"
                                        className={`w-full h-11 px-3 rounded-lg border focus:ring-1 outline-none transition-all text-base ${confirmPassword && newPassword !== confirmPassword
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                            }`}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 p-3 rounded-md animate-in slide-in-from-top-1">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep("REQUEST_CODE");
                                        setError("");
                                        setCode("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    뒤로가기
                                </button>
                                <Button
                                    type="submit"
                                    className="flex-[2]"
                                    size="lg"
                                    disabled={sending || !code || !newPassword || !confirmPassword}
                                >
                                    {sending ? "변경 중..." : "비밀번호 변경하기"}
                                </Button>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 3: Success */}
                {step === "SUCCESS" && (
                    <div className="text-center py-4 animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">비밀번호 변경 완료!</h2>
                        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                            비밀번호가 안전하게 변경되었습니다.<br />
                            새로운 비밀번호로 로그인해주세요.
                        </p>
                        <Button onClick={onClose} className="w-full" size="lg">
                            로그인하러 가기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
