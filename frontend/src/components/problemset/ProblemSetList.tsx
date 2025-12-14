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
    const itemsPerPage = 10;
    const { data, isLoading } = useQuery({
        queryKey: ["problemSets", category, sortBy, sortDirection, keyword, page],
        queryFn: () => getProblemSetList(category, sortBy, sortDirection, keyword, page, itemsPerPage),
        placeholderData: (previousData) => previousData,
    });

    const listData = data?.problemSetList || [];
    const pageInfo = data?.page;

    const pageCount = pageInfo?.totalPages || 1;

    if (isLoading && !data) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-main"></div>
            </div>
        );
    }

    const safePage = Math.min(Math.max(1, page), pageCount);

    return (
        <div className="flex flex-col gap-[80px] w-full">
            {/* Frame 388: List Container (Gap 24px) */}
            <div className="flex flex-col gap-[24px]">
                {listData.length === 0 ? (
                    <div className="w-full text-center py-20 text-gray-400 font-ibm">
                        등록된 문제집이 없습니다.
                    </div>
                ) : (
                    listData.map((problemSet) => (
                        <ProblemSetCard
                            key={problemSet.programId}
                            {...problemSet}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls - Only show if items exist or if we want to show empty page 1? Usually if items exist. */}
            {listData.length > 0 && (
                <div className="flex flex-row justify-center items-center gap-[8px] h-[30px] w-full">
                    <button
                        onClick={() => onPageChange(Math.max(1, safePage - 1))}
                        disabled={safePage === 1}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded-[15px] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
                    >
                        <img src="/icons/leftArrow.svg" alt="prev" className="w-[16px] h-[16px]" />
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
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
                        onClick={() => onPageChange(Math.min(pageCount, safePage + 1))}
                        disabled={safePage === pageCount}
                        className="w-[30px] h-[30px] flex items-center justify-center rounded-[15px] hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#333333]"
                    >
                        <img src="/icons/rightArrow.svg" alt="next" className="w-[16px] h-[16px]" />
                    </button>
                </div>
            )}
        </div>
    );
}
