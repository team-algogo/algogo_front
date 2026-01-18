import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// 타입 정의: 성공(초록/검정) 혹은 에러(빨강)
export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type?: ToastType; // type은 선택사항 (기본값 success)
  onClose: () => void;
}

const Toast = ({ message, type = "success", onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  // 타입에 따른 아이콘 색상 및 SVG 설정
  const isSuccess = type === "success";

  return createPortal(
    <div
      className={`
        fixed top-[10%] left-1/2 -translate-x-1/2 z-[100]
        flex items-center gap-3 px-6 py-3 
        bg-white border rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)]
        transition-opacity duration-500 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${isSuccess ? "border-grayscale-warm-gray" : "border-alert-error"} 
      `}
    >
      {/* 아이콘 영역 */}
      <div
        className={`
          rounded-full border-2 p-0.5 flex items-center justify-center
          ${isSuccess ? "border-grayscale-dark-gray" : "border-alert-error"}
        `}
      >
        {isSuccess ? (
          // 성공 아이콘 (체크)
          <svg width="12" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L13 1" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          // 에러 아이콘 (느낌표) - 빨간색
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16H12.01" stroke="#FF4D4D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* 텍스트 */}
      <span className={`text-sm md:text-base font-bold tracking-tight ${isSuccess ? "text-gray-800" : "text-alert-error"}`}>
        {message}
      </span>
    </div>,
    document.body
  );
};

export default Toast;