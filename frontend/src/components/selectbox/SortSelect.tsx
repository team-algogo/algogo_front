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
                className={`flex flex-row items-center justify-between px-3 py-2 gap-2 min-w-[100px] h-9 border rounded-md transition-all text-sm font-medium ${isOpen
                        ? "border-primary-500 ring-1 ring-primary-500 text-primary-600 bg-white"
                        : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                    }`}
            >
                <span>{currentLabel}</span>
                <img src="/icons/downArrow.svg" alt="v" className={`w-2.5 h-1.5 transition-transform opacity-60 ${isOpen ? 'rotate-180 opacity-100' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-full min-w-[120px] bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${value === option.value
                                    ? "bg-primary-50 text-primary-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
