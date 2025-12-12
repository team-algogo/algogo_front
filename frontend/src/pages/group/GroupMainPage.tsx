import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Group from "@components/cards/group/GroupListCard";
import Button from "@components/button/Button";
import { fetchGroupList } from "../../api/group/groupApi";
import CreateGroupModal from "./CreateGroupModal";
import { useNavigate } from "react-router-dom"; // 리다이렉트용
import useAuthStore from "@store/useAuthStore";

const GroupMainPage = () => {
  // --- 1. 상태 관리 (백엔드 스펙에 맞춤) ---

  // A. 검색 관련
  const [searchInput, setSearchInput] = useState(""); // input창에 보여지는 텍스트
  const [keyword, setKeyword] = useState(""); // 실제 API로 날릴 검색어 (Enter 칠 때 업데이트)

  // B. 정렬 관련 (기본값 설정)
  const [sortBy, setSortBy] = useState("createdAt"); // 정렬 기준
  const [sortDirection, setSortDirection] = useState("desc"); // 정렬 방향

  // C. 페이지네이션 관련
  const [page, setPage] = useState(0); // 현재 페이지 (0부터 시작)
  const size = 10; // 페이지당 개수 (고정값 혹은 상태로 관리)

  // 회원관리
  const { userType } = useAuthStore(); // 혹은 authorization을 체크해도 됨
  const navigate = useNavigate();
  const isLoggedIn = !!userType; // -> 원래 헤더에서 로그인 체크가 있다고 했던거같은데 없는 거 같아서,,이렇게 해볼게요

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    // 로그인이 안 되어 있다면 (userType이 없거나 null일 때)
    if (!userType) {
      const confirmLogin = window.confirm(
        "로그인이 필요한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?"
      ); // -> 이거 원래 알림 창이 있어야하지않 이렇게해도되나
      if (confirmLogin) {
        navigate("/login"); // 로그인 페이지로 이동
      }
      return;
    }
    // 로그인 되어 있으면 모달 열기
    setIsModalOpen(true);
  };

  const queryParams = {
    // 이렇게 하라고 하신거같다
    page,
    size,
    sortBy,
    sortDirection,
    keyword,
  };

  // --- 2. React Query 데이터 Fetching ---
  const { data, isLoading, isError } = useQuery({
    // queryKey에 API에 영향을 주는 모든 변수를 넣어야 함 (하나라도 바뀌면 재호출)
    queryKey: ["groups", queryParams],
    queryFn: () =>
      fetchGroupList({
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      }),
    staleTime: 1000 * 60, // 1분간 캐시 유지
    // placeholderData: (previousData) => previousData, // (선택) 페이지 넘길 때 깜빡임 방지 옵션
  });

  const groupList = data?.data?.groupLists || [];
  const totalCount = data?.data?.page?.totalElements || 0;
  // 전체 페이지 수 계산 (페이지네이션 UI용)
  const totalPages = data?.data?.page?.totalPages || 0;
  const visibleGroups = isLoggedIn ? groupList : groupList.slice(0, 3);

  // --- 3. 핸들러 함수들 ---

  // 검색 핸들러 (Enter 키 입력 시 실행)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setKeyword(searchInput); // 실제 검색어 상태 업데이트 -> API 호출 트리거
      setPage(0); // 검색 시 1페이지(0번)로 초기화
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setPage(0); // 정렬 기준이 바뀌면 1페이지로 초기화

    switch (value) {
      case "latest": // 최신순
        setSortBy("createdAt");
        setSortDirection("desc");
        break;
      case "title": // 제목순 (가나다순)
        setSortBy("title");
        setSortDirection("asc"); // 제목은 보통 오름차순(ㄱ->ㅎ, A->Z)
        break;
      case "modified": // 수정일순
        setSortBy("modifiedAt");
        setSortDirection("desc");
        break;
      default:
        setSortBy("createdAt");
        setSortDirection("desc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <BasePage>
      {isModalOpen && (
        <CreateGroupModal onClose={() => setIsModalOpen(false)} />
      )}
      <div className="w-full flex flex-col gap-6 px-4 py-6 max-w-[1000px] mx-auto">
        {/* Top Section */}
        <div className="flex justify-between items-end">
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
              icon="plusIcon.svg"
              onClick={handleOpenModal}
            >
              그룹 만들기
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full h-[52px] bg-grayscale-default rounded-xl flex items-center px-4 gap-3">
          <img
            src="/icons/searchIconBlack.svg"
            alt="search"
            className="size-5 cursor-pointer"
            onClick={() => {
              setKeyword(searchInput);
              setPage(0);
            }} // 아이콘 클릭 시에도 검색 실행
          />
          <input
            type="text"
            className="w-full bg-transparent font-body text-grayscale-dark-gray placeholder:text-grayscale-warm-gray outline-none"
            placeholder="그룹 이름 또는 설명으로 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown} // 엔터키 이벤트 연결
          />
        </div>

        {/* List Header (Count & Sort) */}
        <div className="flex justify-between items-center mt-4">
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
              // value를 복합적으로 표현하기 어려우므로 defaultValue나
              // 현재 상태에 따라 selected를 제어하는 방식이 좋으나, 간단히 처리:
              onChange={handleSortChange}
              defaultValue="latest"
            >
              <option value="latest">최신순</option>
              <option value="title">가나다순</option>
              <option value="modified">수정일순</option>
            </select>

            {/* 화살표 아이콘 */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-grayscale-dark-gray">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* List Rendering */}
        <div className="flex flex-col gap-4 relative pb-20">
          {" "}
          {/* relative 추가 */}
          {isLoading ? (
            <div className="text-center py-10">로딩 중입니다...</div>
          ) : isError ? (
            <div className="text-center py-10 text-alert-error">실패...</div>
          ) : groupList.length > 0 ? (
            <>
              {/* 1. 실제 보여줄 리스트 (로그인 시 전체, 비로그인 시 3개) */}
              {visibleGroups.map((group: any) => (
                <Group
                  key={group.programId}
                  id={group.programId}
                  title={group.title}
                  description={group.description}
                  memberCount={group.memberCount}
                  problemCount={group.programProblemCount}
                  createdAt={formatDate(group.createdAt)}
                />
              ))}

              {/* 2. 비로그인 시 나타날 '블러 처리된 가짜 리스트 & 안내 문구' */}
              {!isLoggedIn && groupList.length > 3 && (
                <div className="relative mt-4">
                  {/* (A) 뒷배경에 깔릴 흐릿한 아이템들 (시각적 효과용) */}
                  <div className="flex flex-col gap-4 opacity-30 blur-[2px] pointer-events-none select-none">
                    {/* 실제 데이터가 더 있다면 그걸 쓰고, 없다면 더미 데이터 2~3개 렌더링 */}
                    {groupList.slice(3, 6).map((group: any) => (
                      <Group
                        key={group.programId}
                        id={group.programId}
                        title={group.title}
                        description={group.description}
                        memberCount={group.memberCount}
                        problemCount={group.programProblemCount}
                        createdAt={formatDate(group.createdAt)}
                      />
                    ))}
                  </div>

                  {/* (B) 그라데이션 오버레이 (자연스럽게 사라지는 효과) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10"></div>

                  {/* (C) 중앙 안내 문구 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 gap-2">
                    <p className="text-primary-main text-lg font-bold">
                      더 많은 그룹을 보려면 <br className="md:hidden" />{" "}
                      로그인이 필요합니다 🥲
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/login")}
                      className="!w-fit !px-6 !py-2 !h-10 text-sm" // 버튼 크기 조정
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

        {/* --- Pagination UI (간단 구현) --- */}
        {isLoggedIn && totalCount > 0 && (
          <div className="flex justify-center gap-2 py-6">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
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
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </BasePage>
  );
};

export default GroupMainPage;
