import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "default" | "text" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
}

const getVariantStyle = (variant: ButtonVariant) => {
  const variantStyles = {
    primary: `bg-primary-500 text-white border-transparent 
                hover:bg-primary-600 active:bg-primary-700
                disabled:bg-primary-200 disabled:cursor-not-allowed`,
    secondary: `bg-white text-primary-600 border-primary-500 
                hover:bg-primary-50 active:bg-primary-100
                disabled:bg-white disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed`,
    default: `bg-white text-gray-700 border-gray-300
                hover:bg-gray-50 active:bg-gray-100
                disabled:bg-white disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed`,
    text: `bg-transparent text-gray-700 border-transparent
                hover:bg-gray-100 active:bg-gray-200
                disabled:text-gray-300 disabled:cursor-not-allowed`,
    danger: `bg-status-error text-white border-transparent
                hover:bg-red-600 active:bg-red-700
                disabled:bg-red-200 disabled:cursor-not-allowed`,
  };

  return variantStyles[variant];
};

const getSizeStyle = (size: ButtonSize) => {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
  };
  return sizeStyles[size] || sizeStyles.md;
};

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps) => {
  const btnStyle = getVariantStyle(variant);
  const sizeStyle = getSizeStyle(size);

  return (
    <button
      className={`flex items-center justify-center font-medium cursor-pointer border rounded-md transition-all duration-200 gap-2 ${btnStyle} ${sizeStyle} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="flex items-center justify-center">
          {/* If icon is a string, assuming it's a path or class, otherwise render as node */}
          {typeof icon === 'string' ? <div className={`size-4 bg-[url(/icons/${icon})] bg-no-repeat`}></div> : icon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
