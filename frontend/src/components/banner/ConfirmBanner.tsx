import { useEffect } from "react";

interface ConfirmBannerProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmBanner = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "삭제",
  cancelLabel = "취소",
}: ConfirmBannerProps) => {
  // ESC 키로 취소
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slideDown">
        <div className="rounded-lg border border-[#d0d7de] bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#d0d7de] bg-[#f6f8fa] px-4 py-3">
            <span className="text-sm font-semibold text-[#1f2328]">
              삭제 확인
            </span>
            <button
              onClick={onCancel}
              className="inline-flex h-7 w-7 items-center justify-center rounded text-[#656d76] transition-colors hover:bg-[#e6e9ed] hover:text-[#1f2328]"
              title="닫기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>

          {/* Body with Buttons */}
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <p className="flex-1 text-sm leading-6 text-[#1f2328]">{message}</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onCancel}
                className="inline-flex h-8 items-center justify-center rounded-md border border-[#d0d7de] bg-white px-4 text-sm font-medium text-[#1f2328] transition-colors hover:bg-[#f6f8fa]"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="inline-flex h-8 items-center justify-center rounded-md bg-[#cf222e] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a40e26]"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBanner;

