import type { ReactNode } from "react";

type TextLinkVariant = "default" | "secondary";

interface TextLinkProps {
  variant?: TextLinkVariant;
  src: string;
  className?: string;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const getVariantStyle = (variant: TextLinkVariant) => {
  const variantStyles = {
    default: ``,
    secondary: `text-primary-main`,
  };

  return variantStyles[variant];
};

const TextLink = ({
  variant = "default",
  src,
  className = "",
  children,
  onClick,
}: TextLinkProps) => {
  const textLinkStyle = getVariantStyle(variant);
  return (
    <a
      href={src}
      className={`flex justify-center items-center gap-2 hover:underline ${textLinkStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default TextLink;
