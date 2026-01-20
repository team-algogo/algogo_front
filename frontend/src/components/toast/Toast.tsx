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

  // 내가 한 행동에 대한 메시지 패턴 감지 (상단 가운데로 표시)
  const getPosition = (msg: string): ToastPosition => {
    const myActionPatterns = [
      "참여신청이 완료되었습니다",
      "관리자의 승인이 될 때까지 기다려주세요",
      "초대가 취소되었습니다",
      "초대 요청을 보냈습니다",
      "초대를 보냈습니다",
      "초대를 보냈습니다",
      "승인되었습니다",
      "거절되었습니다",
      "그룹이 성공적으로 생성되었습니다",
      "그룹 생성에 실패했습니다",
      "처리 중 오류가 발생했습니다",
      "초대 취소에 실패했습니다",
      "중복 확인 중 오류가 발생했습니다",
      "참여 신청 중 오류가 발생했습니다",
    ];

    // 내가 한 행동 메시지 패턴이 포함되어 있으면 상단 가운데
    if (myActionPatterns.some((pattern) => msg.includes(pattern))) {
      return "top-center";
    }

    // 기본값: 우하단 (남이 한 행동에 대한 알람)
    return "bottom-right";
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
