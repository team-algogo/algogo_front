import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategoryList } from "@api/problemset/getCategoryList";
import Header from "@components/header/Header";
import ProblemSetList from "@components/problemset/ProblemSetList";
import SortSelect from "@components/selectbox/SortSelect";

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
        <>
            <Header />
            <div className="flex flex-col items-start p-[40px_0px_80px] gap-[80px] w-full max-w-[1440px] h-full mx-auto bg-white">
                {/* Header Title */}
                <h1 className="w-[86px] h-[42px] font-ibm font-medium text-[32px] leading-[130%] text-[#0A0A0A]">
                    문제집
                </h1>

                {/* Content Area (List + Controls) */}
                <div className="flex flex-col items-start p-0 gap-[24px] w-full">

                    {/* Controls Row: Category Tabs + Sort Select */}
                    <div className="flex flex-row justify-between items-end w-full h-[60px] border-b border-[#F4F4F5]">

                        {/* Tabs Group */}
                        <div className="flex flex-row items-start p-0 gap-[20px] w-fit h-[34px]">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => handleCategoryChange(tab)}
                                    className={`box-border flex flex-col items-center justify-end px-[2px] pb-[8px] gap-[8px] h-[34px] whitespace-nowrap ${category === tab
                                        ? "border-b-[2px] border-[#0D6EFD]"
                                        : "border-b-[2px] border-transparent hover:border-gray-200"
                                        }`}
                                >
                                    <span className={`h-[16px] font-ibm font-bold text-[16px] leading-[100%] ${category === tab ? "text-[#0D6EFD]" : "text-[#2F353A]"
                                        }`}>
                                        {tab}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Sort Select */}
                        <div className="flex flex-row items-center gap-4 mb-2">
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
        </>
    );
}
