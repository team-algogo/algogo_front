import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "@api/problemset/getCategoryList";
import ProblemSetList from "@components/problemset/ProblemSetList";
import SortSelect from "@components/selectbox/SortSelect";
import BasePage from "@pages/BasePage";

export default function ProblemSetPage() {
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection] = useState("desc");

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const { data: categoryList } = useQuery({
    queryKey: ["categoryList"],
    queryFn: getCategoryList,
  });

  const tabs = ["전체", ...(categoryList?.map((c) => c.name) || [])];
  const sortOptions = [
    { label: "최신순", value: "createdAt" },
    { label: "인기순", value: "popular" },
  ];

  return (
    <BasePage>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Header Title */}
        <div className="border-b border-gray-200 pb-8">
          <h1 className="font-headline text-3xl text-gray-900">
            문제집
          </h1>
          <p className="mt-2 text-gray-500">
            다양한 알고리즘 문제집을 풀어보세요.
          </p>
        </div>

        {/* Controls Row: Category Tabs + Sort Select */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-0">
          {/* Tabs Group */}
          <div className="flex overflow-x-auto no-scrollbar gap-6 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleCategoryChange(tab)}
                className={`whitespace-nowrap pb-4 text-base font-medium transition-colors border-b-2 ${category === tab
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <div className="pb-2 sm:pb-0">
            <SortSelect
              value={sortBy}
              onChange={handleSortChange}
              options={sortOptions}
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-2">
          <ProblemSetList
            category={category}
            sortBy={sortBy}
            sortDirection={sortDirection}
            keyword=""
            page={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </BasePage>
  );
}
