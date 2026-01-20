import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Pagination from "@components/pagination/Pagination";
import { getProblemSetSearchByTitle } from "@api/problemset/getProblemSetSearchByTitle";
import { getProblemSetSearchByProblems } from "@api/problemset/getProblemSetSearchByProblems";
import type { ApiProblemSet } from "@type/problemset/problemSet";
import ProblemSearchResultCard from "@components/cards/search/ProblemSearchResultCard";

const ITEMS_PER_PAGE = 8; // Increased for grid view

// Unified display item type
type SearchResultItem = ApiProblemSet;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("keyword") || "";
  const [inputValue, setInputValue] = useState(initialKeyword);
  const [activeTab, setActiveTab] = useState<"전체" | "문제" | "문제집">(
    "전체",
  );

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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const isSearchEnabled = !!initialKeyword;

  // --- Queries ---

  // 1. "Problem" Search (Search by Problems)
  const problemSize = activeTab === "문제" ? ITEMS_PER_PAGE : 4;
  const { data: problemData, isLoading: isProblemLoading } = useQuery({
    queryKey: [
      "searchByProblems",
      initialKeyword,
      activeTab === "문제" ? problemPage : 1,
      problemSize,
    ],
    queryFn: () =>
      getProblemSetSearchByProblems(
        initialKeyword,
        activeTab === "문제" ? problemPage - 1 : 0,
        problemSize,
      ),
    enabled: isSearchEnabled,
    placeholderData: keepPreviousData,
  });

  // 2. "Workbook" Search (Search by Title)
  const workbookSize = activeTab === "문제집" ? ITEMS_PER_PAGE : 4;
  const { data: workbookData, isLoading: isWorkbookLoading } = useQuery({
    queryKey: [
      "searchByTitle",
      initialKeyword,
      activeTab === "문제집" ? workbookPage : 1,
      workbookSize,
    ],
    queryFn: () =>
      getProblemSetSearchByTitle(
        initialKeyword,
        activeTab === "문제집" ? workbookPage - 1 : 0,
        workbookSize,
      ),
    enabled: isSearchEnabled,
    placeholderData: keepPreviousData,
  });

  const isLoading = isProblemLoading || isWorkbookLoading;
  const problemResults = problemData?.problemSetList || [];
  const workbookResults = workbookData?.problemSetList || [];

  const hasProblemResults = (problemData?.page?.totalElements || 0) > 0;
  const hasWorkbookResults = (workbookData?.page?.totalElements || 0) > 0;
  const hasAnyResults = hasProblemResults || hasWorkbookResults;

  const renderSection = (
    title: string,
    data: SearchResultItem[],
    isFullView: boolean,
    page: number,
    setPage: (p: number) => void,
    pageInfo?: { totalPages: number; totalElements: number },
  ) => {
    if (data.length === 0) return null;

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 flex w-full flex-col gap-6 duration-500">
        <div className="flex flex-row items-end justify-between border-b border-gray-100 pb-4">
          <div className="flex flex-row items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <span className="bg-primary-50 text-primary-600 rounded-full px-2.5 py-0.5 text-sm font-medium">
              {pageInfo?.totalElements ?? data.length}
            </span>
          </div>
          {/* View More Button for 'All' tab */}
          {!isFullView && (pageInfo?.totalElements || 0) > 4 && (
            <button
              onClick={() => setActiveTab(title === "문제" ? "문제" : "문제집")}
              className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
            >
              더보기 <span className="text-xs">→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((problemSet) => (
            <ProblemSearchResultCard
              key={problemSet.programId}
              programId={problemSet.programId}
              title={problemSet.title}
              description={problemSet.description}
              problemCount={problemSet.problemCount}
              categories={problemSet.categories || []}
              searchKeyword={initialKeyword}
              matchedProblems={problemSet.matchedProblems || []}
            />
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
                totalElements: pageInfo.totalElements,
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
      {/* Light Theme Header */}
      <div className="relative mb-12 w-full border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-20 pb-16 text-center">
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            무엇을 찾고 계신가요?
          </h1>
          <div className="relative w-full max-w-2xl">
            <div className="relative transform transition-all focus-within:scale-[1.01]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
                <img
                  src="/icons/searchIconBlack.svg"
                  alt="search"
                  className="h-5 w-5 opacity-40"
                />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="focus:ring-primary-100/50 focus:border-primary-500 h-16 w-full rounded-2xl border-2 border-gray-200 bg-white pl-14 pr-16 text-lg text-gray-900 placeholder-gray-400 shadow-sm transition-all outline-none focus:ring-4"
                placeholder="관심있는 키워드를 검색해보세요"
              />
              <button
                onClick={handleSearch}
                className="bg-primary-600 hover:bg-primary-700 absolute top-2 right-2 bottom-2 rounded-xl px-6 text-sm font-semibold text-white transition-colors"
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto min-h-[500px] w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-10 flex w-full justify-center">
          <div className="bg-gray-50 inline-flex rounded-xl p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${activeTab === tab
                  ? "text-primary-700 bg-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100/50 hover:text-gray-700"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="bg-primary-500 h-1.5 w-1.5 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="w-full">
          {!initialKeyword ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
              <div className="bg-gray-50 flex h-20 w-20 items-center justify-center rounded-3xl">
                <img
                  src="/icons/searchIconBlack.svg"
                  className="h-8 w-8 opacity-20"
                  alt="search"
                />
              </div>
              <div className="text-lg font-medium text-gray-500">
                검색어를 입력하여 원하는 문제를 찾아보세요
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32">
              <div className="border-t-primary-500 h-10 w-10 animate-spin rounded-full border-3 border-gray-100"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-16">
              {activeTab === "전체" && (
                <>
                  {renderSection(
                    "문제",
                    problemResults,
                    false,
                    1,
                    () => { },
                    problemData?.page,
                  )}
                  {renderSection(
                    "문제집",
                    workbookResults,
                    false,
                    1,
                    () => { },
                    workbookData?.page,
                  )}

                  {!hasAnyResults && (
                    <div className="flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
                      <div className="text-4xl">🤔</div>
                      <div className="text-lg font-medium text-gray-600">
                        검색 결과가 없습니다
                      </div>
                      <div className="text-sm text-gray-400">
                        다른 키워드로 검색해 보세요
                      </div>
                    </div>
                  )}
                </>
              )}
              {activeTab === "문제" &&
                (hasProblemResults ? (
                  renderSection(
                    "문제",
                    problemResults,
                    true,
                    problemPage,
                    setProblemPage,
                    problemData?.page,
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="text-lg">검색 결과가 없습니다</div>
                  </div>
                ))}
              {activeTab === "문제집" &&
                (hasWorkbookResults ? (
                  renderSection(
                    "문제집",
                    workbookResults,
                    true,
                    workbookPage,
                    setWorkbookPage,
                    workbookData?.page,
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="text-lg">검색 결과가 없습니다</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </BasePage>
  );
}
