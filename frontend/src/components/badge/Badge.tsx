import type { ReactNode } from "react";

type BadgeVariant =
  | "blue"
  | "gray"
  | "green"
  | "red"
  | "orange"
  | "default"
  | "black"
  | "white";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const getVariantStyle = (variant: BadgeVariant) => {
  const variantStyles = {
    blue: `bg-primary-400 text-white border-transparent`,
    gray: `bg-grayscale-warm-gray text-white border-transparent`,
    green: `bg-alert-success text-white border-transparent`,
    red: `bg-alert-error text-white border-transparent`,
    orange: `bg-alert-warning text-white border-transparent`,
    default: `bg-grayscale-default text-black border-[#D1D5DC]`,
    black: `bg-black text-white border-transparent`,
    white: `bg-white text-black border-[#D1D5DC]`,
  };

  return variantStyles[variant];
};

const Badge = ({ variant = "blue", children, ...rest }: BadgeProps) => {
  const badgeStyle = getVariantStyle(variant);
  return (
    <div
      className={`inline-block rounded-full border-2 px-3 py-1 text-xs ${badgeStyle}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Badge;
