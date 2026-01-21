import Button from "@components/button/Button";
import { useNavigate } from "react-router-dom";

interface LoginRequestOverlayProps {
    description?: string;
    className?: string; // For positioning (e.g., pt-40, justify-center)
}

export default function LoginRequestOverlay({
    description = "서비스 이용을 위해 로그인을 해주세요",
    className = "",
}: LoginRequestOverlayProps) {
    const navigate = useNavigate();

    return (
        <div
            className={`absolute inset-0 z-20 flex flex-col items-center ${className}`}
        >
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50 flex flex-col items-center gap-4 text-center transform hover:scale-105 transition-transform duration-300 ring-1 ring-gray-100">
                <div className="p-3 bg-primary-50 rounded-full">
                    <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-600"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">
                        로그인이 필요한 서비스입니다
                    </h3>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => navigate("/login")}
                    className="!w-full !py-3 font-bold shadow-lg hover:shadow-primary-main/30"
                >
                    로그인 하러가기
                </Button>
            </div>
        </div>
    );
}
