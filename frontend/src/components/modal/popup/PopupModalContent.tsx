import type { ReactNode } from "react";

interface PopupModalContentProps {
  children: ReactNode;
  className?: string;
}

const PopupModalContent = ({ children, className }: PopupModalContentProps) => {
  return (
    <div className={`py-4 text-gray-600 text-center ${className || ""}`}>
      {children}
    </div>
  );
};

export default PopupModalContent;

