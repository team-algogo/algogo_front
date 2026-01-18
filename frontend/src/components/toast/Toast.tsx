import { useEffect, useState } from "react";
import type { ToastType } from "../../store/useToastStore";

interface ToastProps {
  message: string;
  type?: ToastType; // type is optional (default: success)
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

  // Style configuration based on type
  const getStyle = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          wrapperBorder: "border-grayscale-warm-gray",
          iconBorder: "border-grayscale-dark-gray",
          text: "text-grayscale-dark-gray",
          stroke: "#111111",
        };
      case "error":
        return {
          wrapperBorder: "border-alert-error",
          iconBorder: "border-alert-error",
          text: "text-alert-error",
          stroke: "#FF4D4D", // color-status-error / alert-error
        };
      case "warning":
        return {
          wrapperBorder: "border-[#f9a825]", // color-status-warning
          iconBorder: "border-[#f9a825]",
          text: "text-[#f9a825]",
          stroke: "#f9a825",
        };
      case "info":
        return {
          wrapperBorder: "border-status-info", 
          iconBorder: "border-status-info",
          text: "text-status-info",
          stroke: "#0d6efd", // color-status-info
        };
      default:
        return {
          wrapperBorder: "border-grayscale-warm-gray",
          iconBorder: "border-grayscale-dark-gray",
          text: "text-grayscale-dark-gray",
          stroke: "#111111",
        };
    }
  };

  const styles = getStyle(type);

  return (
    <div
      className={`
        fixed top-[10%] left-1/2 -translate-x-1/2 z-[100]
        flex items-center gap-3 px-6 py-3 
        bg-white border rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)]
        transition-opacity duration-500 ease-in-out
        ${isVisible ? "opacity-100" : "opacity-0"}
        ${styles.wrapperBorder} 
      `}
    >
      {/* Icon Area */}
      <div 
        className={`
          rounded-full border-2 p-0.5 flex items-center justify-center
          ${styles.iconBorder}
        `}
      >
        {type === "success" ? (
          // Success Icon (Check)
          <svg width="12" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L13 1" stroke={styles.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : type === "error" || type === "warning" ? (
          // Error/Warning Icon (Exclamation)
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 8V12" stroke={styles.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 16H12.01" stroke={styles.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          // Info Icon (i) - Using exclamation upside down or detailed i
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 16V12" stroke={styles.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 8H12.01" stroke={styles.stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      
      {/* Text */}
      <span className={`font-headline text-sm md:text-base ${styles.text}`}>
        {message}
      </span>
    </div>
  );
};

export default Toast;