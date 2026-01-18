import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BasePage from "@pages/BasePage";
import Group from "@components/cards/group/GroupListCard";
import MyGroupListCard from "@components/cards/group/MyGroupListCard";
import Button from "@components/button/Button";
import { fetchGroupList, fetchMyGroupList } from "../../api/group/groupApi";
import CreateGroupModal from "./CreateGroupModal";
import useAuthStore from "@store/useAuthStore";
import Pagination from "@components/pagination/Pagination";

const GroupMainPage = () => {
  // --- 1. 상태 및 훅 ---
  const navigate = useNavigate();
  const { userType } = useAuthStore();
  const isLoggedIn = !!userType;

  // 검색 & 필터 상태
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [page, setPage] = useState(0);
  const size = 6; // 한 페이지에 6개만 표시 (30% 감소)

  // 페이지 변경 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- 2. Data Fetching ---

  // (A) 전체 그룹 리스트 (기존)
  const queryParams = { page, size, sortBy, sortDirection, keyword };
  const {
    data: allGroupData,
    isLoading: isAllLoading,
    isError: isAllError,
  } = useQuery({
    queryKey: ["groups", queryParams],
    queryFn: () => fetchGroupList(queryParams),
    staleTime: 1000 * 60,
  });

  const allGroupList = allGroupData?.data?.groupLists || [];
  const totalCount = allGroupData?.data?.page?.totalElements || 0;

  // (B) [NEW] 내 그룹 리스트 (로그인 했을 때만 fetch)
  const { data: myGroupData, isLoading: isMyLoading } = useQuery({
    queryKey: ["myGroups"], // 내 그룹은 별도 키 사용
    queryFn: fetchMyGroupList,
    enabled: isLoggedIn, // 로그인이 되어있을 때만 실행
  });

  const myGroupList = myGroupData?.data?.groupLists || [];

  // --- 3. UI Logic ---
  // 비로그인 시 보여줄 흐릿한 리스트 (3개)
  const visibleGroups = isLoggedIn ? allGroupList : allGroupList.slice(0, 3);

  // --- 4. Handlers ---
  const handleOpenModal = () => {
    if (!isLoggedIn) {
      window.location.href = "https://algogo.kr/intro";
      return;
    }
    setIsModalOpen(true);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setKeyword(searchInput);
      setPage(0);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPage(0);
    switch (value) {
      case "latest":
        setSortBy("createdAt");
        setSortDirection("desc");
        break;
      case "title":
        setSortBy("title");
        setSortDirection("asc");
        break;
      case "modified":
        setSortBy("modifiedAt");
        setSortDirection("desc");
        break;
      default:
        setSortBy("createdAt");
        setSortDirection("desc");
    }
  };

  const formatDate = (dateString: string) => {
    // ko-KR locale adds a trailing dot (e.g., "2025. 1. 11."), so we remove it.
    return new Date(dateString).toLocaleDateString("ko-KR").replace(/\.$/, "");
  };

  return (
    <BasePage>
      {isModalOpen && (
        <CreateGroupModal
          onClose={() => setIsModalOpen(false)}
          onCreateSuccess={() => setPage(0)}
        />
      )}

      {/* [Layout 변경] 
        로그인 시: 좌우 분할을 위해 max-width를 조금 더 넓게(1200px) 잡아줍니다.
        비로그인 시: 기존 1000px 유지
      */}

      <div
        className={`w-full flex flex-col gap-10 px-4 py-8 mx-auto min-h-[80vh] ${isLoggedIn ? "!max-w-[1240px]" : "max-w-[1000px]"}`}
      >
        {/* --- Top Section (Title, Create Button, Search) --- */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-[36px] font-bold text-gray-900 leading-tight">
                그룹방
              </h1>
              <p className="text-gray-500 text-lg">
                함께 문제를 풀고 성장하는 코드 리뷰 커뮤니티
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Button
                variant="primary"
                onClick={handleOpenModal}
                className="!h-12 !px-6 shadow-lg hover:shadow-primary-main/30 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="font-bold text-base">그룹 만들기</span>
                </div>
              </Button>

            </div>
          </div>

          <div className="w-full h-[56px] bg-white border border-gray-200 rounded-2xl flex items-center px-5 gap-3 focus-within:border-primary-main focus-within:ring-4 focus-within:ring-primary-100 transition-all shadow-sm">
            <img
              src="/icons/searchIconBlack.svg"
              alt="search"
              className="size-5 cursor-pointer opacity-40 hover:opacity-60 transition-opacity"
              onClick={() => {
                setKeyword(searchInput);
                setPage(0);
              }}
            />
            <input
              type="text"
              className="w-full bg-transparent text-lg text-gray-800 placeholder:text-gray-400 outline-none"
              placeholder="관심 있는 그룹 이름이나 설명을 검색해보세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* [Left Column] My Group List (로그인 시에만 보임) */}
          {isLoggedIn && (
            <div className="flex flex-col gap-5 w-full md:w-[320px] shrink-0 h-full">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl text-gray-900">
                    My Group
                  </span>
                  <span className="bg-primary-50 text-primary-main text-xs font-bold px-2.5 py-1 rounded-full">
                    {myGroupList.length}
                  </span>
                </div>
                {/* 전체보기 Link small style */}
                {myGroupList.length > 0 && (
                  <button
                    onClick={() => navigate("/mypage?tab=group")}
                    className="text-xs font-semibold text-gray-500 hover:text-primary-main transition-colors"
                  >
                    전체보기
                  </button>
                )}
              </div>

              {/* 스크롤 영역: 내용이 많아지면 이 박스 안에서 스크롤 됨 (flex-1로 높이 채움) */}
              <div className="flex flex-col gap-4 flex-1 h-full min-h-0 overflow-y-auto pr-1 custom-scrollbar pb-2">
                {isMyLoading ? (
                  <div className="text-center py-8 text-sm text-grayscale-warm-gray">
                    로딩 중...
                  </div>
                ) : myGroupList.length > 0 ? (
                  myGroupList.slice(0, 4).map((group: any, index: number) => (
                    <div
                      key={group.programId}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards', opacity: 0 }}
                    >
                      <MyGroupListCard
                        title={group.title}
                        description={group.description}
                        memberCount={group.memberCount}
                        problemCount={group.programProblemCount}
                        role={group.role}
                        onClick={() => {
                          navigate(`/group/${group.programId}`);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="py-12 px-6 text-center text-sm text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center flex-col gap-3">
                    <p className="font-semibold text-gray-400">참여 중인 그룹이 없습니다.</p>
                    <Button
                      variant="text"
                      size="sm"
                      onClick={handleOpenModal}
                      className="text-primary-main hover:bg-primary-50"
                    >
                      + 그룹 생성하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* [Right Column] All Group List */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            {/* List Header */}
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 w-full">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl text-gray-900 whitespace-nowrap">
                  전체 그룹
                </span>
                <span className="px-2.5 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-500 whitespace-nowrap">
                  Total {totalCount}
                </span>
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-semibold text-gray-600 cursor-pointer hover:text-gray-900 focus:outline-none transition-colors"
                  onChange={handleSortChange}
                  defaultValue="latest"
                >
                  <option value="latest">최신순</option>
                  <option value="title">가나다순</option>
                  <option value="modified">수정일순</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* List Rendering */}
            <div className="flex flex-col gap-4 relative pb-10">
              {isAllLoading ? (
                <div className="text-center py-20">로딩 중입니다...</div>
              ) : isAllError ? (
                <div className="text-center py-20 text-status-error">
                  데이터 불러오기 실패
                </div>
              ) : allGroupList.length > 0 ? (
                <>
                  {/* 실제 리스트 */}
                  {visibleGroups.map((group: any, index: number) => (
                    <div
                      key={group.programId}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards', opacity: 0 }}
                    >
                      <Group
                        id={group.programId} // programId를 id로 전달
                        title={group.title}
                        description={group.description}
                        memberCount={group.memberCount}
                        capacity={group.capacity}
                        problemCount={group.programProblemCount}
                        createdAt={formatDate(group.createdAt)}
                        isMember={group.isMember}
                        isLoggedIn={isLoggedIn}
                      />
                    </div>
                  ))}

                  {/* 비로그인 시 블러 오버레이 */}
                  {!isLoggedIn && allGroupList.length > 3 && (
                    <div className="relative mt-4">
                      <div className="flex flex-col gap-4 opacity-30 blur-[2px] pointer-events-none select-none">
                        {allGroupList.slice(3, 6).map((group: any) => (
                          <Group
                            key={group.programId}
                            id={group.programId}
                            title={group.title}
                            description={group.description}
                            memberCount={group.memberCount}
                            capacity={group.capacity}
                            problemCount={group.programProblemCount}
                            createdAt={formatDate(group.createdAt)}
                            isMember={group.isMember}
                            isLoggedIn={isLoggedIn}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-4">
                        <p className="text-gray-900 text-xl font-bold text-center">
                          더 많은 그룹을 보려면 <br className="md:hidden" />
                          로그인이 필요합니다 🥲
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => window.location.href = "https://algogo.kr/intro"}
                          className="!w-fit !px-8 !py-3 !h-auto text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                          로그인 하러가기
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-32 text-grayscale-warm-gray flex flex-col items-center gap-4">
                  <img src="/icons/searchIconBlack.svg" className="w-12 h-12 opacity-20" />
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}
            </div>


            {/* Pagination (로그인 시에만 표시) */}
            {isLoggedIn && totalCount > 0 && allGroupData?.data?.page && (
              <Pagination
                pageInfo={allGroupData.data.page}
                currentPage={page + 1}
                onPageChange={(p) => setPage(p - 1)}
              />
            )}
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default GroupMainPage;
