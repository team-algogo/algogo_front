import type React from "react";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "default" | "text";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
}

const getVariantStyle = (variant: ButtonVariant) => {
  const variantStyles = {
    primary: `bg-primary-main text-grayscale-default border-transparent 
                hover:border-primary-300 
                disabled:bg-primary-500 disabled:border-transparent disabled:cursor-default`,
    secondary: `bg-white text-primary-main border-primary-main 
                hover:bg-primary-600 
                disabled:bg-white disabled:text-grayscale-warm-gray disabled:border-grayscale-warm-gray disabled:cursor-default`,
    default: `bg-white text-grayscale-dark-gray border-grayscale-dark-gray
                hover:bg-grayscale-default 
                disabled:bg-white disabled:text-grayscale-warm-gray disabled:border-grayscale-warm-gray disabled:cursor-default`,
    text: `bg-transparent text-grayscale-dark-gray border-transparent
                hover:bg-grayscale-default 
                disabled:bg-transparent disabled:text-grayscale-warm-gray disabled:cursor-default`,
  };

  return variantStyles[variant];
};

const Button = ({
  variant = "primary",
  icon,
  children,
  ...rest
}: ButtonProps) => {
  const btnStyle = getVariantStyle(variant);

  return (
    <button
      className={`flex items-center justify-center px-6 py-4 w-full cursor-pointer border-2 rounded-xl gap-2 disabled:cursor-default ${btnStyle}`}
      {...rest}
    >
      {icon && (
        <div className={`size-4 bg-[url(/icons/${icon})] bg-no-repeat`}></div>
      )}
      {children}
    </button>
  );
};

export default Button;
