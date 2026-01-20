import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import useToastStore from "@store/useToastStore";
import ToastItem from "./ToastItem";

const TopToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 상단 가운데 위치 토스트만 필터링
  const topToasts = toasts.filter((toast) => toast.position === "top-center");

  if (!mounted || topToasts.length === 0) return null;

  const viewport = (
    <div
      className="fixed z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: "420px",
        width: "calc(100% - 48px)",
      }}
    >
      {topToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            animation: `slideInDown 0.3s ease-out ${index * 0.1}s both`,
          }}
        >
          <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );

  return createPortal(viewport, document.body);
};

export default TopToastViewport;

