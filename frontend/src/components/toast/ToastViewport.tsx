import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import useToastStore from "@store/useToastStore";
import ToastItem from "./ToastItem";

const ToastViewport = () => {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("[ToastViewport] Mounted, current toasts:", toasts.length);
  }, []);

  useEffect(() => {
    console.log("[ToastViewport] Toasts updated:", toasts.length);
    toasts.forEach((toast) => {
      console.log("[ToastViewport] Toast:", toast.id, toast.message);
    });
  }, [toasts]);

  if (!mounted) return null;

  const viewport = (
    <div
      className="fixed z-[1000] flex flex-col gap-3 pointer-events-none"
      style={{ 
        bottom: "24px",
        right: "24px",
        maxWidth: "420px" 
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-slide-in-right"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );

  return createPortal(viewport, document.body);
};

// CSS 애니메이션을 인라인으로 추가하거나, index.css에 추가할 수 있습니다.
// 여기서는 Tailwind의 transition 클래스를 사용합니다.

export default ToastViewport;

