interface ProblemSetDetailHeaderProps {
    title: string;
    description: string;
    categories: string[];
}

export default function ProblemSetDetailHeader({ title, description, categories }: ProblemSetDetailHeaderProps) {
    return (
        <div className="flex flex-col items-start gap-2">
            {categories && categories.length > 0 && (
                <div className={`flex flex-row justify-center items-center px-[8px] py-[6px] gap-[10px] w-fit h-fit rounded-full ${categories[0] === '알고리즘' ? 'bg-teal-50' : 'bg-blue-50'}`}>
                    <span className={`text-xs font-medium leading-[130%] text-center whitespace-nowrap ${categories[0] === '알고리즘' ? 'text-teal-700' : 'text-blue-700'}`}>
                        {categories[0]}
                    </span>
                </div>
            )}

            <h1 className="text-[28px] font-bold text-[#333333]">
                {title}
            </h1>
            <p className="text-sm font-normal text-gray-500 leading-[130%]">
                {description}
            </p>
        </div>
    );
}
