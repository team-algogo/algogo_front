interface ProblemSetDetailHeaderProps {
    title: string;
    description: string;
    categories: string[];
}

export default function ProblemSetDetailHeader({ title, description, categories }: ProblemSetDetailHeaderProps) {
    return (
        <div className="flex flex-col items-start gap-[8px] w-full">
            {categories && categories.length > 0 && (
                <div className={`flex flex-row justify-center items-center px-[8px] py-[6px] gap-[10px] w-fit h-fit rounded-[100px] ${categories[0] === '알고리즘' ? 'bg-[#F0FDFA]' : 'bg-[#EFF6FF]'}`}>
                    <span className={`text-[12px] font-medium leading-[130%] tracking-[-0.01em] text-center whitespace-nowrap ${categories[0] === '알고리즘' ? 'text-[#0F766E]' : 'text-[#1D4ED8]'} font-ibm`}>
                        {categories[0]}
                    </span>
                </div>
            )}

            <h1 className="text-[32px] font-medium font-ibm text-[#0A0A0A] leading-[130%] tracking-[1px]">
                {title}
            </h1>
            <p className="text-[14px] font-normal font-ibm text-[#6C757D] leading-[130%]">
                {description}
            </p>
        </div>
    );
}
