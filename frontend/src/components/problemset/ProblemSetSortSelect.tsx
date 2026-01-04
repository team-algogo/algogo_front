export interface SortOption {
    label: string;
    value: string;
}

interface ProblemSetSortSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ProblemSetSortSelect({ value, onChange }: ProblemSetSortSelectProps) {
    // Hardcoded options based on spec: "createdA" (Latest) and "popular" (Popular)
    // Korean labels: "최신순", "인기순"
    const options: SortOption[] = [
        { label: "최신순", value: "createdAt" },
        { label: "인기순", value: "popular" },
    ];

    const currentLabel = options.find((o) => o.value === value)?.label || "최신순";

    return (
        <div className="relative group">
            <button className="flex flex-row items-center justify-between px-[12px] py-[8px] gap-[4px] min-w-[82px] h-[34px] border border-[#727479] rounded-[8px] bg-white text-[14px] text-[#727479] font-ibm">
                <span>{currentLabel}</span>
                <img src="/icons/downArrow.svg" alt="v" className="w-[10px] h-[6px]" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-full min-w-[100px] bg-white border border-[#E5E5E5] rounded-md shadow-lg hidden group-hover:block z-20">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 font-ibm text-[#333333]"
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
