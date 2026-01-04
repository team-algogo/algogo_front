import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@components/header/Header";
import SortSelect from "@components/selectbox/SortSelect";
import { getProblemSetDetail } from "@api/problemset/getProblemSetDetail";
import { getProblemSetProblems } from "@api/problemset/getProblemSetProblems";
import ProblemSetDetailHeader from "@components/problemset/detail/ProblemSetDetailHeader";
import ProblemListTable from "@components/problemset/detail/ProblemListTable";
import Pagination from "@components/pagination/Pagination";
import useAuthStore from "@store/useAuthStore";

export default function ProblemSetDetailPage() {
    const { programId } = useParams<{ programId: string }>();
    const id = Number(programId);

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("startDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const sortOptions = [
        { label: "최신순", value: "startDate" },
        { label: "참여자순", value: "participantCount" },
        { label: "제출순", value: "submissionCount" },
        { label: "정답순", value: "solvedCount" },
    ];

    const { data: detail } = useQuery({
        queryKey: ["problemSetDetail", id],
        queryFn: () => getProblemSetDetail(id),
        enabled: !isNaN(id),
    });

    const { data: problemsData } = useQuery({
        queryKey: ["problemSetProblems", id, page, sortBy, sortDirection],
        queryFn: () => getProblemSetProblems(id, page, 20, sortBy, sortDirection),
        enabled: !isNaN(id),
    });

    const problems = problemsData?.problemList || [];
    const pageInfo = problemsData?.page;
    const totalPages = pageInfo?.totalPages || 1;
    const { userType } = useAuthStore();
    const isLogined = !!userType;

    // Handle Page Change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const toggleSortDirection = () => {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-start p-[40px_0px_80px] gap-[80px] w-full max-w-[1440px] h-full mx-auto bg-white">

                {/* Header Section */}
                {detail && (
                    <ProblemSetDetailHeader
                        title={detail.title}
                        description={detail.description}
                        categories={detail.categories}
                    />
                )}

                {/* Content Section: Table + Controls */}
                <div className="flex flex-col items-start gap-[24px] w-full">

                    {/* Controls Header */}
                    <div className="flex flex-row justify-between items-center w-full h-[34px]">
                        <h2 className="text-[24px] font-medium font-ibm text-[#333333] leading-[130%] tracking-[0.01em]">
                            문제 리스트
                        </h2>

                        <div className="flex flex-row items-center gap-[16px]">
                            {/* Sort Direction Toggle Icon */}
                            <button
                                onClick={toggleSortDirection}
                                className="flex items-center justify-center w-[16px] h-[16px] cursor-pointer"
                                aria-label="Toggle sort direction"
                            >
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Path 1 (Right): Up Arrow (asc) */}
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.5 14C11.7761 14 12 13.7761 12 13.5V1.70711L15.1464 4.85355C15.3417 5.04882 15.6583 5.04882 15.8536 4.85355C16.0488 4.65829 16.0488 4.34171 15.8536 4.14645L11.8536 0.146446C11.6583 -0.0488155 11.3417 -0.0488155 11.1464 0.146446L7.14645 4.14645C6.95118 4.34171 6.95118 4.65829 7.14645 4.85355C7.34171 5.04882 7.65829 5.04882 7.85355 4.85355L11 1.70711V13.5C11 13.7761 11.2239 14 11.5 14Z"
                                        fill={sortDirection === "asc" ? "#333333" : "#727479"}
                                    />
                                    {/* Path 2 (Left): Down Arrow (desc) */}
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.5 2.38419e-07C4.77614 2.38419e-07 5 0.223858 5 0.5V12.2929L8.14645 9.14645C8.34171 8.95118 8.65829 8.95118 8.85355 9.14645C9.04882 9.34171 9.04882 9.65829 8.85355 9.85355L4.85355 13.8536C4.65829 14.0488 4.34171 14.0488 4.14645 13.8536L0.146447 9.85355C-0.0488155 9.65829 -0.0488155 9.34171 0.146447 9.14645C0.341709 8.95118 0.658292 8.95118 0.853554 9.14645L4 12.2929V0.5C4 0.223858 4.22386 2.38419e-07 4.5 2.38419e-07Z"
                                        fill={sortDirection === "desc" ? "#333333" : "#727479"}
                                    />
                                </svg>
                            </button>

                            <SortSelect
                                value={sortBy}
                                onChange={setSortBy}
                                options={sortOptions}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <ProblemListTable
                        problems={problems}
                        page={page}
                        isLogined={isLogined}
                    />

                    {/* Pagination */}
                    {pageInfo && totalPages > 0 && (
                        <Pagination
                            pageInfo={pageInfo}
                            currentPage={page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
