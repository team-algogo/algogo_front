import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalStore } from "../../../store/useModalStore";

interface ModalProps {
  children: ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { isOpen, closeModal } = useModalStore();
  const isPopupOpen = isOpen("popup");

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPopupOpen) {
        closeModal();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPopupOpen, closeModal]);

  if (!isPopupOpen) return null;

  // 외부(backdrop) 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-[430px] mx-6 flex flex-col gap-y-4 rounded-[10px] bg-white p-6">
        {children}
      </div>
    </div>,
    document.getElementById("modal") as HTMLDivElement
  );
};

// Trigger Component
interface TriggerProps {
  children: ReactNode;
  className?: string;
}

const Trigger = ({ children, className }: TriggerProps) => {
  const { openModal } = useModalStore();

  return (
    <button onClick={() => openModal("popup")} className={className}>
      {children}
    </button>
  );
};

// Compound Component 조합
Modal.Trigger = Trigger;

export default Modal;
