import type { ReactNode } from "react";

interface PopupModalHeaderProps {
  children: ReactNode;
  className?: string;
}

const PopupModalHeader = ({ children, className }: PopupModalHeaderProps) => {
  return (
    <div className={`pb-2 ${className || ""}`}>
      <h2 className="text-xl font-bold text-gray-900">{children}</h2>
    </div>
  );
};

export default PopupModalHeader;

