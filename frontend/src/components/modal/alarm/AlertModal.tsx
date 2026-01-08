import { useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useModalStore } from "../../../store/useModalStore";

// Root Component
interface AlertModalProps {
  children: ReactNode;
}

const AlertModal = ({ children }: AlertModalProps) => {
  return <>{children}</>;
};

// Trigger Component
interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, className }: TriggerProps) => {
  const { openModal } = useModalStore();

  return (
    <button onClick={() => openModal("alert")} className={className}>
      {children}
    </button>
  );
};

// Content Component
interface ContentProps {
  children: ReactNode;
  autoCloseDelay?: number; // 자동 닫힘 시간 (ms), 기본 3초
  modalType?: "alert" | "campaign"; // 모달 타입, 기본값 'alert'
}

const Content = ({
  children,
  autoCloseDelay = 3000,
  modalType = "alert",
}: ContentProps) => {
  const { isOpen, closeModal } = useModalStore();
  const isAlertOpen = isOpen(modalType);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 자동 닫힘
  useEffect(() => {
    if (isAlertOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        closeModal();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isAlertOpen, autoCloseDelay, closeModal]);

  if (!isAlertOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 min-h-screen flex items-center justify-center bg-black/30 z-50"
    >
      <div className="relative w-lg min-h-[155px] bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
};

// Message Component
interface MessageProps {
  children: ReactNode;
  className?: string;
}

const Message = ({ children, className }: MessageProps) => {
  return (
    <p className={`text-center text-grayscale-dark-gray ${className || ""}`}>
      {children}
    </p>
  );
};

// Compound Component 조합
AlertModal.Trigger = Trigger;
AlertModal.Content = Content;
AlertModal.Message = Message;

export default AlertModal;
