import { useEffect, useRef } from "react";
import useToastStore, { type ToastType } from "@store/useToastStore";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

/**
 * 기존 코드와의 호환성을 위한 Toast 래퍼 컴포넌트
 * 내부적으로 useToastStore를 사용하여 전역 토스트 시스템에 토스트를 추가합니다.
 * ToastViewport가 자동으로 토스트를 표시하고 5초 후 제거합니다.
 */
const Toast = ({ message, type = "success", onClose }: ToastProps) => {
  const { addToast } = useToastStore();
  const prevMessageRef = useRef<string>("");
  const prevTypeRef = useRef<ToastType>("success");

  useEffect(() => {
    // message나 type이 변경되었을 때만 토스트 추가
    const messageChanged = prevMessageRef.current !== message;
    const typeChanged = prevTypeRef.current !== type;
    
    if (messageChanged || typeChanged || (prevMessageRef.current === "" && message)) {
      // 토스트 추가 (ToastViewport가 자동으로 표시하고 5초 후 제거)
      addToast({
        message,
        type,
      });

      // 이전 값 업데이트
      prevMessageRef.current = message;
      prevTypeRef.current = type;

      // onClose는 단순히 로컬 상태 초기화용 (실제 토스트는 ToastViewport가 제거)
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, type, addToast, onClose]);

  // 이 컴포넌트는 렌더링하지 않습니다 (ToastViewport가 처리)
  return null;
};

export default Toast;
export type { ToastType };

