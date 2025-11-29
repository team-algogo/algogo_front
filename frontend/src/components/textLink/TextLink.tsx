import type { ReactNode } from "react";

type TextLinkVariant = "default" | "secondary";

interface TextLinkProps {
  variant?: TextLinkVariant;
  src: string;
  children: ReactNode;
}

const getVariantStyle = (variant: TextLinkVariant) => {
  const variantStyles = {
    default: `text-primary-main `,
    secondary: ``,
  };

  return variantStyles[variant];
};

const TextLink = ({ variant = "default", src, children }: TextLinkProps) => {
  const textLinkStyle = getVariantStyle(variant);
  return (
    <a href={src} className={`flex gap-2 hover:underline ${textLinkStyle}`}>
      {children}
    </a>
  );
};

export default TextLink;
