type BadgeVariant = 'blue' | 'gray' | 'green' | 'red' | 'orange' | 'default' | 'black' | 'white';

interface BadgeProps {
    variant?: BadgeVariant;
    titleText: string;
    levelText: string
}

const getVariantStyle = (variant: BadgeVariant) => {
  const variantStyles = {
      blue: `bg-primary-400 text-white border-transparent`,
      gray:`bg-grayscale-warm-gray text-white border-transparent`,
      green: `bg-alert-success text-white border-transparent`,
      red: `bg-alert-error text-white border-transparent`,
      orange: `bg-alert-warning text-white border-transparent`,
      default: `bg-grayscale-default text-black border-[#D1D5DC]`,
      black: `bg-black text-white border-transparent`,
      white: `bg-white text-black border-[#D1D5DC]`,
    };

  return variantStyles[variant];
};


const LevelBadge = ({ variant = "blue", titleText, levelText, ...rest }: BadgeProps) => {
    const badgeStyle = getVariantStyle(variant);
    return (
        <div className="flex">
            <div dir="ltr">
                <div className={`inline-block rounded-s-full py-1 px-2 border-2 border-r-0 ${badgeStyle}`} {...rest} >
                    {titleText}
                </div>
            </div>
            <div dir="rtl">
                <div className={`inline-block rounded-s-full py-1 px-2 border-2 border-l-0 ${badgeStyle}`} {...rest} >
                    {levelText}
                </div>
            </div>
        </div>
    )
}

export default LevelBadge;