import { useQuery } from "@tanstack/react-query";
import { getProblemSetList } from "@api/problemset/getProblemSetList";
import ProblemSetCard from "./ProblemSetCard";

interface ProblemSetListProps {
    category: string;
    sortBy: string;
    sortDirection: string;
    keyword: string;
    page: number; // Page prop still passed from parent state
    onPageChange: (page: number) => void;
}

export default function ProblemSetList({
    category,
    sortBy,
    sortDirection,
    keyword,
    page,
    onPageChange,
}: ProblemSetListProps) {
    const { data: problemSetList = [], isLoading } = useQuery({
        queryKey: ["problemSets", category, sortBy, sortDirection, keyword], // removed page from queryKey to cache full list
        queryFn: () => getProblemSetList(category, sortBy, sortDirection, keyword),
        placeholderData: (previousData) => previousData,
    });

    if (isLoading) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-main"></div>
            </div>
        );
    }

    // Client-side pagination
    const itemsPerPage = 10; // Standard size, or 5 if previously 5. Let's use 10.
    const totalPages = Math.ceil(problemSetList.length / itemsPerPage) || 1;

    // Ensure current page is valid
    const safePage = Math.min(Math.max(1, page), totalPages);
    if (page !== safePage && page > 1) {
        // This might cause a render loop if we call onPageChange immediately during render.
        // Better to just derive the slice from safePage.
    }

    const start = (safePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = problemSetList.slice(start, end);

    return (
        <div className="flex flex-col gap-[80px] w-full">
            {/* Frame 388: List Container (Gap 24px) */}
            <div className="flex flex-col gap-[24px]">
                {currentItems.length === 0 ? (
                    <div className="w-full text-center py-20 text-gray-400 font-ibm">
                        등록된 문제집이 없습니다.
                    </div>
                ) : (
                    currentItems.map((problemSet) => (
                        <ProblemSetCard
                            key={problemSet.programId}
                            {...problemSet}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls - Only show if items exist */}
            {problemSetList.length > 0 && (
                <div className="flex flex-row justify-center items-center gap-[8px] h-[30px] w-full">
                    <button
                        onClick={() => onPageChange(Math.max(1, safePage - 1))}
                        disabled={safePage === 1}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded-[15px] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
                    >
                        <img src="/icons/leftArrow.svg" alt="prev" className="w-[16px] h-[16px]" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-[30px] h-[30px] flex flex-col justify-center items-center rounded-[15px]
                            ${safePage === p
                                    ? "bg-[#0D6EFD]"
                                    : "bg-transparent hover:bg-gray-100"
                                }
                            `}
                        >
                            <span className={`text-[14px] font-medium leading-[130%] tracking-[0.01em] font-ibm ${safePage === p ? 'text-white' : 'text-[#333333]'}`}>
                                {p}
                            </span>
                        </button>
                    ))}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
                        disabled={safePage === totalPages}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded-[15px] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
                    >
                        <img src="/icons/rightArrow.svg" alt="next" className="w-[16px] h-[16px]" />
                    </button>
                </div>
            )}
        </div>
    );
}
