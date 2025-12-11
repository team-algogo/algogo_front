import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 마운트 직후 페이드 인
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // 2.5초 뒤 페이드 아웃 시작
    const timer = setTimeout(() => {
      setIsVisible(false);
      // 애니메이션 시간(500ms) 뒤 언마운트
      setTimeout(onClose, 500); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-[10%] left-1/2 -translate-x-1/2 z-[100]
        flex items-center gap-3 px-6 py-3 
        bg-white border border-grayscale-warm-gray rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)]
        transition-opacity duration-500 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"} 
      `}
    >
      {/* 체크 아이콘 */}
      <div className="rounded-full border-2 border-grayscale-dark-gray p-0.5">
        <svg
          width="12"
          height="12"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5L4.5 8.5L13 1"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <span className="font-headline text-grayscale-dark-gray text-sm md:text-base">
        {message}
      </span>
    </div>
  );
};

export default Toast;