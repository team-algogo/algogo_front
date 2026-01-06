import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProblemSetCard from "@components/cards/mypage/ProblemSetCard";
import MyGroupCard from "@components/cards/mypage/MyGroupCard";
import Pagination from "@components/pagination/Pagination";
import { getProblemSetMe } from "@api/problemset/getProblemSetMe";
import { getGroupMe } from "@api/group/getGroupMe";
import SortSelect from "@components/selectbox/SortSelect";

type TabType = "문제집" | "캠페인" | "그룹방";
type SortDirection = "asc" | "desc";

const ParticipationStatus = () => {
    const [activeTab, setActiveTab] = useState<TabType>("문제집");
    const [page, setPage] = useState(1);
    const [sortBy] = useState("createdAt"); // Currently defaulting to createdAt
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const itemsPerPage = 6;

    // Reset pagination when tab changes
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        setPage(1);
        setSortDirection("desc"); // Reset sort
    };

    const handleSortChange = (value: string) => {
        setSortDirection(value as SortDirection);
    };

    // Problem Set Query
    const { data: problemSetData, isLoading: isProblemSetLoading } = useQuery({
        queryKey: ["myProblemSets", sortBy, sortDirection],
        queryFn: async () => {
            const response = await getProblemSetMe(
                sortBy,
                sortDirection.toUpperCase(),
            );
            return response.data;
        },
        enabled: activeTab === "문제집",
    });

    // Group Query
    const { data: groupData, isLoading: isGroupLoading } = useQuery({
        queryKey: ["myGroups", page, sortBy, sortDirection],
        queryFn: async () => {
            // API uses 0-based index for page
            const response = await getGroupMe(
                page - 1,
                itemsPerPage,
                sortBy,
                sortDirection.toUpperCase(),
            );
            return response.data;
        },
        enabled: activeTab === "그룹방",
    });

    const isLoading =
        activeTab === "문제집"
            ? isProblemSetLoading
            : activeTab === "그룹방"
                ? isGroupLoading
                : false;

    // Prepare data based on active tab
    let contentList: any[] = [];
    let pageInfo = {
        number: 0,
        totalPages: 0,
        size: itemsPerPage,
        totalElements: 0,
    };

    if (activeTab === "문제집") {
        contentList = problemSetData?.programList || [];

        // Client-side pagination logic moved to server-side sort, but pagination is still client-side based on `getProblemSetMe` current response structure returning full list?
        // Wait, `getProblemSetMe` response definition shows just `programList: ProblemSetMeItem[]`, it does not seem to support pagination yet based on previous file view.
        // However, I must rely on server-side SORTING as requested.
        // Pagination logic remains client-side for now as API didn't change for pagination, only sort params added.

        const totalItems = contentList.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        contentList = contentList.slice(startIndex, endIndex);
        pageInfo = {
            number: page - 1,
            totalPages: totalPages,
            size: itemsPerPage,
            totalElements: totalItems,
        };
    } else if (activeTab === "그룹방") {
        contentList = groupData?.groupLists || [];
        if (groupData?.page) {
            pageInfo = groupData.page;
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex h-[300px] w-full items-center justify-center">
                    <div className="border-primary-main h-10 w-10 animate-spin rounded-full border-b-2"></div>
                </div>
            );
        }

        if (activeTab === "캠페인") {
            return (
                <div className="w-full py-20 text-center text-lg text-gray-500">
                    준비 중인 기능입니다.
                </div>
            );
        }

        if (contentList.length === 0) {
            return (
                <div className="w-full py-10 text-center text-gray-500">
                    참여한 {activeTab}이 없습니다.
                </div>
            );
        }

        if (activeTab === "문제집") {
            return (
                <div className="grid grid-cols-3 gap-[12px] self-stretch">
                    {contentList.map((problem: any) => (
                        <ProblemSetCard
                            key={problem.programId}
                            title={problem.title}
                            category={"알고리즘"} // Default
                            progress={0} // Default
                            problemCount={0} // Default
                            memberCount={0} // Default
                            thumbnailUrl={
                                problem.thumbnail ||
                                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
                            }
                            isCompleted={false}
                        />
                    ))}
                </div>
            );
        } else if (activeTab === "그룹방") {
            return (
                <div className="grid grid-cols-3 gap-[12px] self-stretch">
                    {contentList.map((group: any) => (
                        <MyGroupCard
                            key={group.programId}
                            title={group.title}
                            description={group.description}
                            memberCount={group.memberCount}
                            capacity={group.capacity}
                            programProblemCount={group.programProblemCount}
                        />
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <div className="flex flex-col items-start gap-10 self-stretch">
                {/* Tabs */}
                <div className="flex items-center justify-between self-stretch">
                    <button
                        onClick={() => handleTabChange("문제집")}
                        className={`flex flex-1 items-center justify-center gap-2 ${activeTab === "문제집"
                            ? "border-b border-[#0D6EFD]"
                            : "border-b border-[#E8F0FF]"
                            } py-3`}
                    >
                        <span
                            className={`text-base leading-[130%] font-semibold tracking-[-0.16px] ${activeTab === "문제집" ? "text-[#0D6EFD]" : "text-[#6C757D]"
                                }`}
                            style={{ fontFamily: "IBM Plex Sans KR" }}
                        >
                            문제집
                        </span>
                    </button>
                    <button
                        onClick={() => handleTabChange("캠페인")}
                        className={`flex flex-1 items-center justify-center gap-2 ${activeTab === "캠페인"
                            ? "border-b border-[#0D6EFD]"
                            : "border-b border-[#E8F0FF]"
                            } py-3`}
                    >
                        <span
                            className={`text-base leading-[130%] font-semibold tracking-[-0.16px] ${activeTab === "캠페인" ? "text-[#0D6EFD]" : "text-[#6C757D]"
                                }`}
                            style={{ fontFamily: "IBM Plex Sans KR" }}
                        >
                            캠페인
                        </span>
                    </button>
                    <button
                        onClick={() => handleTabChange("그룹방")}
                        className={`flex flex-1 items-center justify-center gap-2 ${activeTab === "그룹방"
                            ? "border-b border-[#0D6EFD]"
                            : "border-b border-[#E8F0FF]"
                            } py-3`}
                    >
                        <span
                            className={`text-base leading-[130%] font-semibold tracking-[-0.16px] ${activeTab === "그룹방" ? "text-[#0D6EFD]" : "text-[#6C757D]"
                                }`}
                            style={{ fontFamily: "IBM Plex Sans KR" }}
                        >
                            그룹방
                        </span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col items-start gap-4 self-stretch">
                {/* Header */}
                <div className="flex items-center justify-between self-stretch">
                    <span
                        className="text-base leading-[130%] font-normal tracking-[-0.16px] text-[#050505]"
                        style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                        {activeTab === "캠페인"
                            ? "캠페인 목록"
                            : `내가 참여한 ${activeTab} 목록을 확인해 보세요🙂`}
                    </span>

                    {/* Sorting Button - Only show for lists */}
                    {activeTab !== "캠페인" && (
                        <SortSelect
                            value={sortDirection}
                            onChange={handleSortChange}
                            options={[
                                { label: "최신순", value: "desc" },
                                { label: "오래된순", value: "asc" },
                            ]}
                        />
                    )}
                </div>

                {/* Cards */}
                <div className="flex flex-col items-start gap-6 self-stretch">
                    {renderContent()}
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && activeTab !== "캠페인" && pageInfo.totalPages > 0 && (
                <Pagination
                    pageInfo={pageInfo}
                    currentPage={page}
                    onPageChange={setPage}
                />
            )}
        </>
    );
};

export default ParticipationStatus;
