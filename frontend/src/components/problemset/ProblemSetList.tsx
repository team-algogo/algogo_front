import { useQuery } from "@tanstack/react-query";
import { getProblemSetList } from "@api/problemset/getProblemSetList";
import ProblemSetCard from "./ProblemSetCard";
import Pagination from "@components/pagination/Pagination";

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

            {/* Pagination Controls */}
            {listData.length > 0 && pageInfo && (
                <Pagination
                    pageInfo={pageInfo}
                    currentPage={safePage}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}
