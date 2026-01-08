import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Pagination from "@components/pagination/Pagination";
import { getProblemSetSearchByTitle } from "@api/problemset/getProblemSetSearchByTitle";
import { getProblemSetSearchByProblems } from "@api/problemset/getProblemSetSearchByProblems";
import type { ApiProblemSet } from "@type/problemset/problemSet";
import MainProblemSetCard from "@components/cards/main/MainProblemSetCard";
// Re-using MainProblemCard but we might need to adapt it slightly or use similar design
import MainProblemCard from "@components/cards/main/MainProblemCard";
import img2 from "@assets/images/MainCard/MainCard2.jpg";

const ITEMS_PER_PAGE = 8; // Increased for grid view

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
    const problemSize = activeTab === "문제" ? ITEMS_PER_PAGE : 4;
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
    const workbookSize = activeTab === "문제집" ? ITEMS_PER_PAGE : 4;
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
            <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-row justify-between items-end border-b border-gray-100 pb-4">
                    <div className="flex flex-row items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            {pageInfo?.totalElements ?? data.length}
                        </span>
                    </div>
                    {/* View More Button for 'All' tab */}
                    {!isFullView && (pageInfo?.totalElements || 0) > 4 && (
                        <button
                            onClick={() => setActiveTab(title === "문제" ? "문제" : "문제집")}
                            className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                        >
                            더보기 <span className="text-xs">→</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.map((problemSet) => (
                        title === "문제" ? (
                            <MainProblemCard
                                key={problemSet.programId}
                                data={{
                                    programProblemId: problemSet.programId, // mapping ID mismatch for display
                                    title: problemSet.title,
                                    link: `/problemset/${problemSet.programId}`, // Temp link
                                    categoryName: problemSet.categories?.[0] || 'Algorithm',
                                    difficultyType: "Level 1", // Mock data as API doesn't return difficulty
                                    platformType: "Programmers", // Mock
                                    problemLink: "#"
                                } as any}
                                icon="🧩"
                                title={problemSet.title}
                                subtitle={problemSet.description}
                                badges={[{ text: "Problem", variant: "green" }]}
                            />
                        ) : (
                            <MainProblemSetCard
                                key={problemSet.programId}
                                programId={problemSet.programId}
                                img={img2}
                                title={problemSet.title}
                                count={problemSet.problemCount}
                            />
                        )
                    ))}
                </div>

                {/* Pagination for Full View */}
                {isFullView && pageInfo && (
                    <div className="mt-8 flex justify-center">
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
                    </div>
                )}
            </div>
        );
    };

    const tabs = ["전체", "문제", "문제집"];

    return (
        <BasePage>
            {/* Hero Search Section */}
            <div className="relative w-full bg-gray-900 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-gray-900 to-black/80"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 flex flex-col items-center text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                        무엇을 찾고 계신가요?
                    </h1>
                    <div className="relative w-full max-w-2xl transform transition-all hover:scale-[1.01]">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-8 py-5 text-lg rounded-full border-none shadow-2xl focus:ring-4 focus:ring-primary-500/30 bg-white/95 backdrop-blur-sm placeholder-gray-400 text-gray-900 pr-16"
                            placeholder="문제, 문제집, 알고리즘 검색..."
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-full transition-colors shadow-md"
                        >
                            <img
                                src="/icons/searchIconBlack.svg"
                                alt="search"
                                className="w-5 h-5 filter invert brightness-0 invert-[1]"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full min-h-[500px]">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-10 w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-8 py-4 text-sm font-medium transition-all relative ${activeTab === tab
                                    ? "text-primary-600"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Results Area */}
                <div className="w-full">
                    {!initialKeyword ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                            <div className="text-6xl">🔍</div>
                            <div className="text-lg font-medium">검색어를 입력하여 원하는 문제를 찾아보세요.</div>
                        </div>
                    ) : isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin"></div>
                            <span className="text-gray-500 font-medium animate-pulse">검색 중입니다...</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-16">
                            {activeTab === "전체" && (
                                <>
                                    {renderSection("문제", problemResults, false, 1, () => { }, problemData?.page)}
                                    {renderSection("문제집", workbookResults, false, 1, () => { }, workbookData?.page)}

                                    {!hasAnyResults && (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                                            <div className="text-4xl text-gray-300">🤔</div>
                                            <div className="text-lg">검색 결과가 없습니다.</div>
                                            <div className="text-sm text-gray-400">다른 키워드로 검색해 보세요.</div>
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab === "문제" && (
                                hasProblemResults ?
                                    renderSection("문제", problemResults, true, problemPage, setProblemPage, problemData?.page)
                                    : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <div className="text-lg">검색 결과가 없습니다.</div>
                                        </div>
                                    )
                            )}
                            {activeTab === "문제집" && (
                                hasWorkbookResults ?
                                    renderSection("문제집", workbookResults, true, workbookPage, setWorkbookPage, workbookData?.page)
                                    : (
                                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                            <div className="text-lg">검색 결과가 없습니다.</div>
                                        </div>
                                    )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </BasePage>
    );
}
