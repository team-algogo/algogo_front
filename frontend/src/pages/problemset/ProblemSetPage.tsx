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
  // Sort direction handling: usually popular -> desc, createdAt -> desc. default desc.
  const [sortDirection] = useState("desc");

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
    // Reset sort direction if needed, but desc is usually good for both "Latest" and "Popular"
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
      <div className="mx-auto flex h-full w-full max-w-250 flex-col items-start gap-4 bg-white p-[40px_0px_80px] px-6">
        {/* Header Title */}
        <h1 className="font-headline h-[42px] w-[86px] text-3xl leading-[130%]">
          문제집
        </h1>

        {/* Content Area (List + Controls) */}
        <div className="flex w-full flex-col items-start gap-[24px] p-0">
          {/* Controls Row: Category Tabs + Sort Select */}
          <div className="flex h-[60px] w-full flex-row items-end justify-between border-b border-[#F4F4F5]">
            {/* Tabs Group */}
            <div className="flex h-[34px] w-fit flex-row items-start gap-[20px] p-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleCategoryChange(tab)}
                  className={`box-border flex h-[34px] flex-col items-center justify-end gap-[8px] px-[2px] pb-[8px] whitespace-nowrap ${
                    category === tab
                      ? "border-primary-main border-b-2"
                      : "border-b-2 border-transparent hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`font-ibm h-4 text-[16px] leading-[100%] font-bold ${
                      category === tab ? "text-primary-main" : "text-[#2F353A]"
                    }`}
                  >
                    {tab}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="mb-2 flex flex-row items-center gap-4">
              <SortSelect
                value={sortBy}
                onChange={handleSortChange}
                options={sortOptions}
              />
            </div>
          </div>

          {/* List */}
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
