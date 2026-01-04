import { useState, useRef, useEffect } from "react";

export interface SortOption {
    label: string;
    value: string;
}

interface SortSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SortOption[];
}

export default function SortSelect({ value, onChange, options }: SortSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentLabel = options.find((o) => o.value === value)?.label || options[0]?.label;

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex flex-row items-center justify-between px-[12px] py-[8px] gap-[4px] min-w-[82px] h-[34px] border border-[#727479] rounded-[8px] bg-white text-[14px] text-[#727479] font-ibm hover:bg-gray-50 transition-colors"
            >
                <span>{currentLabel}</span>
                <img src="/icons/downArrow.svg" alt="v" className={`w-[10px] h-[6px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-full min-w-[100px] bg-white border border-[#E5E5E5] rounded-md shadow-lg z-20 overflow-hidden">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 font-ibm text-[#333333] transition-colors"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
