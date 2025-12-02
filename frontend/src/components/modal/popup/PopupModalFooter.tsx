import type { ReactNode, ButtonHTMLAttributes } from "react";
import { useModalStore } from "../../store/useModalStore";

// Footer Component
interface PopupModalFooterProps {
  children: ReactNode;
  className?: string;
}

const PopupModalFooter = ({ children, className }: PopupModalFooterProps) => {
  return (
    <div className={`flex gap-3 pt-4 ${className || ""}`}>
      {children}
    </div>
  );
};

// Close Button Component
interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const CloseButton = ({
  children,
  variant = "secondary",
  className,
  ...props
}: CloseButtonProps) => {
  const { closeModal } = useModalStore();

  const baseStyles = "flex-1 h-12 rounded-lg font-medium transition-colors";
  const variantStyles = {
    primary: "bg-primary-main text-white hover:bg-primary-dark",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      onClick={closeModal}
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Action Button Component (액션 후 닫기)
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const ActionButton = ({
  children,
  variant = "primary",
  className,
  onClick,
  ...props
}: ActionButtonProps) => {
  const { closeModal } = useModalStore();

  const baseStyles = "flex-1 h-12 rounded-lg font-medium transition-colors";
  const variantStyles = {
    primary: "bg-primary-main text-white hover:bg-primary-dark",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    closeModal();
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Compound Components
PopupModalFooter.CloseButton = CloseButton;
PopupModalFooter.ActionButton = ActionButton;

export default PopupModalFooter;

