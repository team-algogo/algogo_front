import { useState } from "react";
import Button from "@components/button/Button";
import { postFindPassword } from "@api/auth/auth";

interface PasswordResetModalProps {
    onClose: () => void;
}

export default function PasswordResetModal({ onClose }: PasswordResetModalProps) {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSending(true);
        setError("");

        try {
            const response = await postFindPassword(email);
            if (response.status === 200) {
                setSuccess(true);
            }
        } catch (err: any) {
            console.error(err);
            setError("해당 이메일로 가입된 계정을 찾을 수 없거나 오류가 발생했습니다.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-[420px] bg-white rounded-xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
                {!success ? (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">비밀번호 재설정</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            가입하신 이메일 주소를 입력해 주시면<br />
                            <span className="font-semibold text-primary-600">임시 비밀번호</span>를 전송해 드립니다.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                    {sending ? "전송 중..." : "임시 비밀번호 받기"}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">전송 완료!</h2>
                        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                            입력하신 <strong>{email}</strong>(으)로<br />임시 비밀번호를 발송했습니다.<br />
                            메일함을 확인해주세요.
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
