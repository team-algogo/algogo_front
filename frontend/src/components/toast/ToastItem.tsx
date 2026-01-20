import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ToastItem as ToastItemType } from "@store/useToastStore";

interface ToastItemProps {
  toast: ToastItemType;
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 애니메이션을 위한 지연
    requestAnimationFrame(() => setIsVisible(true));

    // 자동 닫기 타이머 (5초)
    const startTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // 애니메이션 후 제거
      }, 5000);
    };

    if (!isPaused) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, onClose]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (toast.cta) {
      navigate(toast.cta.route, { state: toast.cta.params });
      onClose();
    }
  };

  const getStyle = (type: ToastItemType["type"]) => {
    switch (type) {
      case "success":
        return {
          borderColor: "border-green-200",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          textColor: "text-gray-900",
        };
      case "error":
        return {
          borderColor: "border-red-200",
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          textColor: "text-gray-900",
        };
      case "warning":
        return {
          borderColor: "border-amber-200",
          bgColor: "bg-amber-50",
          iconColor: "text-amber-600",
          textColor: "text-gray-900",
        };
      case "info":
        return {
          borderColor: "border-blue-200",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          textColor: "text-gray-900",
        };
      default:
        return {
          borderColor: "border-gray-200",
          bgColor: "bg-gray-50",
          iconColor: "text-gray-600",
          textColor: "text-gray-900",
        };
    }
  };

  const styles = getStyle(toast.type);

  return (
    <div
      className={`
        w-full max-w-md
        bg-white border rounded-xl shadow-lg
        transition-all duration-300 ease-out
        ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
        ${styles.borderColor}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${styles.bgColor} flex items-center justify-center ${styles.iconColor}`}>
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : toast.type === "error" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : toast.type === "warning" ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${styles.textColor} mb-1`}>
              {toast.message}
            </h4>
            {toast.description && (
              <p className="text-xs text-gray-600 mb-2">{toast.description}</p>
            )}
            {toast.cta && (
              <button
                onClick={handleCTAClick}
                className={`text-xs font-semibold ${styles.iconColor} hover:underline transition-colors block`}
              >
                {toast.cta.label} →
              </button>
            )}
            {/* Actions */}
            {toast.actions && toast.actions.length > 0 && (
              <div className="flex gap-2 mt-2">
                {toast.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                      onClose();
                    }}
                    className={`
                      px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm
                      ${action.variant === 'danger'
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                        : action.variant === 'secondary'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                          : 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-100'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastItem;

