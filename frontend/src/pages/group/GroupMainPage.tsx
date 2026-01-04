import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import BasePage from "@pages/BasePage";
import Group from "@components/cards/group/GroupListCard";
import MyGroupListCard from "@components/cards/group/MyGroupListCard"; // [NEW] 컴포넌트 import
import Button from "@components/button/Button";
import { fetchGroupList, fetchMyGroupList } from "../../api/group/groupApi"; // [NEW] API import
import CreateGroupModal from "./CreateGroupModal";
import useAuthStore from "@store/useAuthStore";

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
  const size = 10;

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
  const totalPages = allGroupData?.data?.page?.totalPages || 0;

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
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        navigate("/login");
      }
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
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  return (
    <BasePage>
      {isModalOpen && (
        <CreateGroupModal onClose={() => setIsModalOpen(false)} />
      )}

      {/* [Layout 변경] 
        로그인 시: 좌우 분할을 위해 max-width를 조금 더 넓게(1200px) 잡아줍니다.
        비로그인 시: 기존 1000px 유지
      */}
      <div
        className={`w-full flex flex-col gap-6 px-4 py-6 mx-auto min-h-[80vh] ${isLoggedIn ? "max-w-[1200px]" : "max-w-[1000px]"}`}
      >
        {/* --- Top Section (Title, Create Button, Search) --- */}
        {/* 이 부분은 공통으로 상단에 위치 */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col gap-1">
              <h1 className="font-headline text-[24px] text-grayscale-dark-gray">
                Group Room
              </h1>
              <p className="font-body text-grayscale-warm-gray text-sm">
                함께 문제를 풀고 성장하는 코드 리뷰 커뮤니티
              </p>
            </div>
            <div className="w-[170px]">
              <Button
                variant="primary"
                onClick={handleOpenModal}
              >
                <div className="flex items-center gap-2">
                  <img src="/icons/plusIcon.svg" alt="plus" className="w-4 h-4" />
                  <span>그룹 만들기</span>
                </div>
              </Button>

            </div>
          </div>

          <div className="w-full h-[52px] bg-grayscale-default rounded-xl flex items-center px-4 gap-3">
            <img
              src="/icons/searchIconBlack.svg"
              alt="search"
              className="size-5 cursor-pointer"
              onClick={() => {
                setKeyword(searchInput);
                setPage(0);
              }}
            />
            <input
              type="text"
              className="w-full bg-transparent font-body text-grayscale-dark-gray placeholder:text-grayscale-warm-gray outline-none"
              placeholder="그룹 이름 또는 설명으로 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        {/* --- Content Section --- */}
        {/* 로그인 여부에 따라 Grid 레이아웃 적용 */}
        <div
          className={`grid gap-8 ${isLoggedIn ? "md:grid-cols-[280px_1fr]" : "grid-cols-1"}`}
        >
          {/* [Left Column] My Group List (로그인 시에만 보임) */}
          {isLoggedIn && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-headline text-lg text-grayscale-dark-gray">
                  My Group
                </span>
                <span className="bg-primary-main text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {myGroupList.length}
                </span>
              </div>

              {/* 스크롤 영역: 내용이 많아지면 이 박스 안에서 스크롤 됨 */}
              <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-1 custom-scrollbar">
                {isMyLoading ? (
                  <div className="text-center py-4 text-sm text-grayscale-warm-gray">
                    로딩 중...
                  </div>
                ) : myGroupList.length > 0 ? (
                  myGroupList.map((group: any) => (
                    <MyGroupListCard
                      key={group.programId}
                      title={group.title}
                      description={group.description}
                      memberCount={group.memberCount}
                      problemCount={group.programProblemCount}
                      role={group.role}
                    />
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-grayscale-warm-gray bg-grayscale-default rounded-xl border border-dashed border-grayscale-warm-gray">
                    참여 중인 그룹이 없습니다.
                    <br />
                    새로운 그룹을 만들어보세요!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* [Right Column] All Group List */}
          <div className="flex flex-col gap-4">
            {/* List Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-headline text-lg text-grayscale-dark-gray">
                  전체
                </span>
                <span className="px-2 py-0.5 bg-grayscale-default rounded-md text-xs font-bold text-grayscale-warm-gray">
                  {totalCount}
                </span>
              </div>
              <div className="relative">
                <select
                  className="appearance-none bg-transparent border border-grayscale-warm-gray rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer hover:border-primary-main focus:outline-none focus:border-primary-main transition-colors"
                  onChange={handleSortChange}
                  defaultValue="latest"
                >
                  <option value="latest">최신순</option>
                  <option value="title">가나다순</option>
                  <option value="modified">수정일순</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-grayscale-dark-gray">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* List Rendering */}
            <div className="flex flex-col gap-4 relative pb-10">
              {isAllLoading ? (
                <div className="text-center py-10">로딩 중입니다...</div>
              ) : isAllError ? (
                <div className="text-center py-10 text-alert-error">
                  데이터 불러오기 실패
                </div>
              ) : allGroupList.length > 0 ? (
                <>
                  {/* 실제 리스트 */}
                  {visibleGroups.map((group: any) => (
                    <Group
                      key={group.programId}
                      id={group.programId} // programId를 id로 전달
                      title={group.title}
                      description={group.description}
                      memberCount={group.memberCount}
                      problemCount={group.programProblemCount}
                      createdAt={formatDate(group.createdAt)}
                      isMember={group.isMember}
                    />
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
                            problemCount={group.programProblemCount}
                            createdAt={formatDate(group.createdAt)}
                            isMember={group.isMember}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-2">
                        <p className="text-primary-main text-lg font-bold text-center">
                          더 많은 그룹을 보려면 <br className="md:hidden" />{" "}
                          로그인이 필요합니다 🥲
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => navigate("/login")}
                          className="!w-fit !px-6 !py-2 !h-10 text-sm"
                        >
                          로그인 하러가기
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-grayscale-warm-gray">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            {/* Pagination (로그인 시에만 표시) */}
            {isLoggedIn && totalCount > 0 && (
              <div className="flex justify-center gap-2 py-4">
                <button
                  onClick={() => setPage((old) => Math.max(old - 1, 0))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                >
                  이전
                </button>
                <span className="px-4 py-2">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((old) => (old + 1 < totalPages ? old + 1 : old))
                  }
                  disabled={page + 1 >= totalPages}
                  className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                >
                  다음
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default GroupMainPage;
