import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import SearchProblemSetItem from "@components/search/SearchProblemSetItem";
import Pagination from "@components/pagination/Pagination";
import { getProblemSetSearchByTitle } from "@api/problemset/getProblemSetSearchByTitle";
import { getProblemSetSearchByProblems } from "@api/problemset/getProblemSetSearchByProblems";
import type { ApiProblemSet } from "@type/problemset/problemSet";

const ITEMS_PER_PAGE = 5;

// Unified display item type
type SearchResultItem = ApiProblemSet;

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialKeyword = searchParams.get("keyword") || "";
    const [inputValue, setInputValue] = useState(initialKeyword);
    const [activeTab, setActiveTab] = useState<"전체" | "문제" | "문제집">("전체");

    // Pagination State
    const [problemPage, setProblemPage] = useState(1);
    const [workbookPage, setWorkbookPage] = useState(1);

    useEffect(() => {
        setInputValue(initialKeyword);
    }, [initialKeyword]);

    // Reset pagination when tab or keyword changes
    useEffect(() => {
        setProblemPage(1);
        setWorkbookPage(1);
    }, [activeTab, initialKeyword]);

    const handleSearch = () => {
        if (!inputValue.trim()) {
            searchParams.delete("keyword");
        } else {
            searchParams.set("keyword", inputValue);
        }
        setSearchParams(searchParams);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const isSearchEnabled = !!initialKeyword;

    // --- Queries ---

    // 1. "Problem" Search (Search by Problems)
    // Used for "전체" (preview) and "문제" tab
    const problemSize = activeTab === "문제" ? ITEMS_PER_PAGE : 3;
    const { data: problemData, isLoading: isProblemLoading } = useQuery({
        queryKey: ["searchByProblems", initialKeyword, activeTab === "문제" ? problemPage : 1, problemSize],
        queryFn: () => getProblemSetSearchByProblems(
            initialKeyword,
            activeTab === "문제" ? problemPage - 1 : 0, // API is 0-indexed
            problemSize
        ),
        enabled: isSearchEnabled,
        placeholderData: keepPreviousData,
    });

    // 2. "Workbook" Search (Search by Title)
    // Used for "전체" (preview) and "문제집" tab
    const workbookSize = activeTab === "문제집" ? ITEMS_PER_PAGE : 3;
    const { data: workbookData, isLoading: isWorkbookLoading } = useQuery({
        queryKey: ["searchByTitle", initialKeyword, activeTab === "문제집" ? workbookPage : 1, workbookSize],
        queryFn: () => getProblemSetSearchByTitle(
            initialKeyword,
            activeTab === "문제집" ? workbookPage - 1 : 0, // API is 0-indexed
            workbookSize
        ),
        enabled: isSearchEnabled,
        placeholderData: keepPreviousData,
    });

    const isLoading = isProblemLoading || isWorkbookLoading;
    const problemResults = problemData?.problemSetList || [];
    const workbookResults = workbookData?.problemSetList || [];

    // Check if we have results for "All" tab (total elements > 0)
    // The API responses have 'page' info with 'totalElements'
    const hasProblemResults = (problemData?.page?.totalElements || 0) > 0;
    const hasWorkbookResults = (workbookData?.page?.totalElements || 0) > 0;
    const hasAnyResults = hasProblemResults || hasWorkbookResults;

    const renderSection = (
        title: string,
        data: SearchResultItem[],
        isFullView: boolean,
        page: number,
        setPage: (p: number) => void,
        pageInfo?: { totalPages: number, totalElements: number }
    ) => {
        if (data.length === 0) return null;

        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                        <h2 className="text-[20px] font-bold text-[#333333] font-ibm">{title}</h2>
                        <span className="text-[16px] font-medium text-[#9CA3AF] font-ibm">
                            {pageInfo?.totalElements ?? data.length}
                        </span>
                    </div>
                    {/* View More Button for 'All' tab */}
                    {!isFullView && (pageInfo?.totalElements || 0) > 3 && (
                        <button
                            onClick={() => setActiveTab(title === "문제" ? "문제" : "문제집")}
                            className="text-[14px] text-[#999999] hover:text-[#333333] font-ibm cursor-pointer"
                        >
                            더보기 &gt;
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {data.map((problemSet) => (
                        <SearchProblemSetItem
                            key={problemSet.programId}
                            {...problemSet}
                        />
                    ))}
                </div>

                {/* Pagination for Full View */}
                {isFullView && pageInfo && (
                    <Pagination
                        currentPage={page}
                        onPageChange={setPage}
                        pageInfo={{
                            number: page - 1,
                            totalPages: pageInfo.totalPages,
                            size: ITEMS_PER_PAGE,
                            totalElements: pageInfo.totalElements
                        }}
                    />
                )}
            </div>
        );
    };

    const tabs = ["전체", "문제", "문제집"];

    return (
        <>
            <BasePage>
                <div className="flex flex-col items-center w-full gap-[24px]">
                    {/* SearchBox Area */}
                    <div className="flex flex-col items-start p-[8px] gap-[8px] w-[684px] flex-none order-0 flex-grow-0">
                        <div className="flex flex-row justify-between items-center p-0 gap-[75px] w-full max-w-[800px] h-[36px] bg-white border border-[#30AEDC] rounded-[8px] overflow-hidden">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 h-full px-[12px] py-[8px] text-[14px] text-[#333333] placeholder-[#999999] outline-none font-ibm"
                                placeholder="검색어를 입력해주세요"
                            />
                            <button
                                onClick={handleSearch}
                                className="flex flex-row justify-center items-center w-[36px] h-[36px] bg-[#30AEDC] hover:bg-[#2090BE] transition-colors"
                            >
                                <img
                                    src="/icons/searchIconBlack.svg"
                                    alt="search"
                                    className="w-[16px] h-[16px] filter invert brightness-0 saturate-100 invert-[1]"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-row items-start gap-[32px] w-full flex-1 flex-none order-1 self-stretch flex-grow-1">
                        {/* Left Sidebar */}
                        <div className="flex flex-col items-start p-[8px] gap-[8px] w-[176px] flex-none order-0 flex-grow-0">
                            <div className="flex flex-col items-start p-0 w-[160px] flex-none order-0 flex-grow-0">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`box-border flex flex-col justify-center items-center p-[16px_24px] w-[160px] h-[32px] flex-none flex-grow-0 ${activeTab === tab
                                            ? "bg-[#30AEDC] text-[#F5F5F5] font-medium"
                                            : "bg-white border-b border-[#98D7EE] text-[#000000] font-normal hover:bg-gray-50"
                                            } transition-colors font-ibm text-[16px] leading-[130%] tracking-[-0.01em]`}
                                    >
                                        <span className={activeTab === tab ? "text-[16px]" : "text-[14px]"}>
                                            {tab}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Results Area */}
                        <div className="flex flex-col items-start gap-[48px] flex-1 h-full overflow-y-auto pr-2 pb-20">
                            {!initialKeyword ? (
                                <div className="w-full flex flex-col items-center justify-center py-20 text-[#999999]">
                                    <div className="text-[16px]">검색어를 입력해주세요.</div>
                                </div>
                            ) : isLoading ? (
                                <div className="w-full flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#30AEDC]"></div>
                                </div>
                            ) : (
                                <>
                                    {activeTab === "전체" && (
                                        <>
                                            {renderSection("문제", problemResults, false, 1, () => { }, problemData?.page)}

                                            {hasProblemResults && hasWorkbookResults && (
                                                <div className="w-full h-[1px] bg-[#E5E7EB]"></div>
                                            )}

                                            {renderSection("문제집", workbookResults, false, 1, () => { }, workbookData?.page)}

                                            {!hasAnyResults && (
                                                <div className="w-full flex flex-col items-center justify-center py-20 text-[#999999]">
                                                    <div className="text-[16px]">검색 결과가 없습니다.</div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {activeTab === "문제" && (
                                        hasProblemResults ?
                                            renderSection("문제", problemResults, true, problemPage, setProblemPage, problemData?.page)
                                            : (
                                                <div className="w-full flex flex-col items-center justify-center py-20 text-[#999999]">
                                                    <div className="text-[16px]">검색 결과가 없습니다.</div>
                                                </div>
                                            )
                                    )}
                                    {activeTab === "문제집" && (
                                        hasWorkbookResults ?
                                            renderSection("문제집", workbookResults, true, workbookPage, setWorkbookPage, workbookData?.page)
                                            : (
                                                <div className="w-full flex flex-col items-center justify-center py-20 text-[#999999]">
                                                    <div className="text-[16px]">검색 결과가 없습니다.</div>
                                                </div>
                                            )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </BasePage>
        </>
    );
}
