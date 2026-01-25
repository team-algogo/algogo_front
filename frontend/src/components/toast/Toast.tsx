import { useEffect, useRef } from "react";
import useToastStore, { type ToastType, type ToastPosition } from "@store/useToastStore";

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

  // SSE 알림 패턴 감지 (우하단으로 표시)
  const getPosition = (msg: string): ToastPosition => {
    const sseNotificationPatterns = [
      "님이 그룹에 참여 신청을 보냈습니다",
      "님이 초대를 수락했습니다",
      "님이 초대를 거절했습니다",
      "님이 그룹에 가입했습니다",
      "님이 그룹을 탈퇴했습니다",
      "새로운 알림이 있습니다",
    ];

    // SSE 알림 패턴이 포함되어 있으면 우하단
    if (sseNotificationPatterns.some((pattern) => msg.includes(pattern))) {
      return "bottom-right";
    }

    // 기본값: 상단 가운데 (사용자 동작에 대한 알림)
    return "top-center";
  };

  useEffect(() => {
    // message나 type이 변경되었을 때만 토스트 추가
    const messageChanged = prevMessageRef.current !== message;
    const typeChanged = prevTypeRef.current !== type;

    if (messageChanged || typeChanged || (prevMessageRef.current === "" && message)) {
      // 토스트 추가 (내가 한 행동은 상단, 남이 한 행동은 우하단)
      addToast({
        message,
        type,
        position: getPosition(message),
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
