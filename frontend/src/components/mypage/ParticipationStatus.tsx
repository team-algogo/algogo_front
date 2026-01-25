import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProblemSetCard from "@components/cards/mypage/ProblemSetCard";
import MyGroupListCard from "@components/cards/group/MyGroupListCard";
import Pagination from "@components/pagination/Pagination";
import { getProblemSetMe } from "@api/problemset/getProblemSetMe";
import { getGroupMe } from "@api/group/getGroupMe";
import SortSelect from "@components/selectbox/SortSelect";

export type TabType = "문제집" | "캠페인" | "그룹방";
type SortDirection = "asc" | "desc";

interface ParticipationStatusProps {
    initialTab?: TabType;
}

const ParticipationStatus = ({ initialTab }: ParticipationStatusProps) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>(initialTab || "문제집");
    const [page, setPage] = useState(1);

    // initialTab 변경 시 activeTab 업데이트
    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);
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
        queryKey: ["myProblemSets", page, sortBy, sortDirection],
        queryFn: async () => {
            const response = await getProblemSetMe(
                page - 1,
                itemsPerPage,
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
        contentList = problemSetData?.problemSetLists || [];
        if (problemSetData?.page) {
            pageInfo = problemSetData.page;
        }
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] self-stretch">
                    {contentList.map((problem: any) => (
                        <ProblemSetCard
                            key={problem.programId}
                            title={problem.title}
                            categories={problem.categories}
                            progress={0} // Default
                            problemCount={problem.problemCount}
                            memberCount={problem.totalParticipants}
                            thumbnailUrl={
                                problem.thumbnail ||
                                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
                            }
                            isCompleted={false}
                            onClick={() => navigate(`/problemset/${problem.programId}`)}
                        />
                    ))}
                </div>
            );
        } else if (activeTab === "그룹방") {
            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[12px] self-stretch">
                    {contentList.map((group: any) => (
                        <MyGroupListCard
                            key={group.programId}
                            title={group.title}
                            description={group.description}
                            memberCount={group.memberCount}
                            problemCount={group.programProblemCount}
                            role={group.role || "USER"}
                            variant="mypage"
                            onClick={() => navigate(`/group/${group.programId}`)}
                        />
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col h-full w-full flex-1">
            {/* Main Header */}
            <div className="flex w-full items-center gap-2 mb-5">
                <span
                    className="text-xl leading-[130%] font-bold tracking-[-0.2px] text-[#050505]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                >
                    내 참여 현황
                </span>
            </div>

            <div className="flex flex-col gap-8 w-full flex-1">
                {/* Tabs */}
                <div className="flex items-center border-b border-gray-200 w-full">
                    {["문제집", "캠페인", "그룹방"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab as TabType)}
                            className={`flex-1 py-4 px-4 text-center font-medium text-base transition-colors relative ${activeTab === tab
                                ? "text-primary-600"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6 w-full flex-1">
                    {/* Header with Sort */}
                    {activeTab !== "캠페인" && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg text-[#050505]">
                                    {`내가 참여한 ${activeTab}`}
                                </span>
                                {/* Count Badge */}
                                <div
                                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs ${pageInfo.totalElements > 0
                                        ? "bg-[#FF3B30] text-white"
                                        : "bg-[#EBEBEB] text-[#727479]"
                                        }`}
                                >
                                    {pageInfo.totalElements}
                                </div>
                            </div>

                            <div className="w-32">
                                <SortSelect
                                    value={sortDirection}
                                    onChange={handleSortChange}
                                    options={[
                                        { label: "최신순", value: "desc" },
                                        { label: "오래된순", value: "asc" },
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {/* Cards */}
                    <div className="w-full flex flex-col justify-between flex-1">
                        {renderContent()}
                    </div>
                </div>

                {/* Pagination */}
                {!isLoading && activeTab !== "캠페인" && pageInfo.totalPages > 0 && (
                    <div className="mt-auto py-4 w-full flex justify-center">
                        <Pagination
                            pageInfo={pageInfo}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipationStatus;
