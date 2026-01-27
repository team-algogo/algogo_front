import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import useToastStore from "@store/useToastStore";
import ToastItem from "./ToastItem";

const ToastViewport = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);



  // 우하단 위치 토스트만 필터링 (position이 bottom-right이거나 없는 경우)
  const bottomToasts = toasts.filter(
    (toast) => !toast.position || toast.position === "bottom-right"
  );

  if (!mounted) return null;

  if (bottomToasts.length === 0) {
    return null;
  }

  const viewport = (
    <div
      className="fixed z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{
        bottom: "24px",
        right: "24px",
        maxWidth: "420px",
      }}
    >
      {bottomToasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            animation: `slideInRight 0.3s ease-out ${index * 0.1}s both`,
          }}
        >
          <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );

  return createPortal(viewport, document.body);
};

export default ToastViewport;

