import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Button from "@components/button/Button";
import GroupDetailInfo from "@components/cards/group/GroupDetailInfo";
import GroupProblemCard from "@components/cards/group/GroupProblemCard";
import { fetchGroupDetail, fetchGroupProblemList } from "../../api/group/groupApi";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const programId = Number(groupId);

  // --- 1. 상태 관리 ---
  const [page, setPage] = useState(0);
  const size = 10;
  const [sortBy, setSortBy] = useState("endDate");
  const [sortDirection, setSortDirection] = useState("asc");

  // --- 2. 데이터 Fetching ---
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["groupDetail", programId],
    queryFn: () => fetchGroupDetail(programId),
    enabled: !!programId,
  });

  const { data: problemData, isLoading: isProblemLoading } = useQuery({
    queryKey: ["groupProblems", programId, page, size, sortBy, sortDirection],
    queryFn: () =>
      fetchGroupProblemList({
        programId,
        page,
        size,
        sortBy,
        sortDirection,
      }),
    enabled: !!programId,
  });

  const groupInfo = detailData?.data;
  const problemList = problemData?.data?.content || [];
  const totalCount = problemData?.data?.totalElements || 0;
  const totalPages = problemData?.data?.totalPages || 0;

  // 권한 확인 ("ADMIN" or "USER")
  const userRole = groupInfo?.groupRole || "USER";

  // --- 3. 핸들러 ---
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(0);
    if (e.target.value === "latest") {
        setSortBy("startDate"); setSortDirection("desc");
    } else {
        setSortBy("endDate"); setSortDirection("asc");
    }
  };

  if (isDetailLoading) return <BasePage><div className="text-center py-20">로딩 중...</div></BasePage>;
  if (!groupInfo) return <BasePage><div className="text-center py-20">그룹 정보를 찾을 수 없습니다.</div></BasePage>;

  return (
    <BasePage>
      <div className="w-full flex flex-col gap-6 px-4 py-6 max-w-[1000px] mx-auto min-h-[80vh]">
        
        {/* 1. 상단 그룹 정보 카드 */}
        <GroupDetailInfo
          title={groupInfo.title}
          description={groupInfo.description}
          memberCount={groupInfo.memberCount}
          problemCount={groupInfo.programProblemCount || totalCount}
          createdAt={groupInfo.createdAt}
        />

        {/* 2. 중간 통계 바 & 관리 버튼 */}
        <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          
          {/* 왼쪽: 통계 정보 */}
          <div className="flex items-center gap-2">
            <img src="/icons/bookIcon.svg" className="size-5" alt="book" />
            <span className="font-headline text-grayscale-dark-gray text-lg">
              등록된 문제 {totalCount}개
            </span>
          </div>

          {/* 오른쪽: 버튼 영역 */}
          {/* gap-2로 버튼 사이 간격 조절 */}
          <div className="flex gap-2 flex-wrap justify-end">
            
            {/* [공통] 멤버 버튼 */}
            {/* w-fit을 가진 div로 감싸서 버튼이 늘어나는 것을 방지합니다. */}
            <div className="w-fit">
                <Button 
                    variant="default"  // 회색 테두리 스타일
                    onClick={() => navigate(`/groups/${programId}/members`)}
                >
                    <div className="flex items-center gap-1 whitespace-nowrap text-sm">
                         <img src="/icons/groupIcon.svg" className="w-4 h-4" alt="member"/>
                         <span>멤버 {groupInfo.memberCount}명</span>
                    </div>
                </Button>
            </div>

            {/* [ADMIN 전용] 버튼들 */}
            {userRole === "ADMIN" && (
                <>
                    {/* 신청 조회 (회색 테두리) */}
                    <div className="w-fit">
                        <Button 
                            variant="default" // 회색 테두리
                            onClick={() => navigate(`/groups/${programId}/requests`)} 
                        >
                             <span className="whitespace-nowrap text-sm">신청 조회</span>
                        </Button>
                    </div>

                    {/* 문제 추가 (파란색 배경) */}
                    <div className="w-fit">
                        <Button 
                            variant="primary" // 파란색 배경
                            onClick={() => navigate(`/groups/${programId}/problems/new`)}
                        >
                            <span className="whitespace-nowrap text-sm">문제 추가</span>
                        </Button>
                    </div>
                </>
            )}
          </div>
        </div>

        {/* 3. 문제 리스트 섹션 */}
        <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
            
            {/* 리스트 헤더 */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <img src="/icons/bookIcon.svg" className="size-5 opacity-60" alt="list"/>
                    <span className="font-headline text-lg text-grayscale-dark-gray">등록된 문제</span>
                </div>
                <div className="relative">
                    <select 
                        className="appearance-none bg-white border border-grayscale-warm-gray rounded-lg px-4 py-2 pr-8 text-sm cursor-pointer hover:border-primary-main focus:outline-none focus:border-primary-main transition-colors"
                        onChange={handleSortChange}
                    >
                        <option value="default">기본 순서</option>
                        <option value="latest">최신순</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-grayscale-dark-gray">
                       <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            {/* 리스트 렌더링 */}
            <div className="flex flex-col gap-3 flex-1">
                {isProblemLoading ? (
                    <div className="flex-1 flex items-center justify-center text-grayscale-warm-gray">
                        문제 불러오는 중...
                    </div>
                ) : problemList.length > 0 ? (
                    <>
                        {problemList.map((problem: any) => (
                            <GroupProblemCard
                                key={problem.id}
                                title={problem.title}
                                difficulty={problem.difficulty || "Medium"}
                                addedAt={problem.startDate || problem.createdAt}
                                solvedCount={problem.solvedCount || 0}
                                totalMembers={groupInfo.memberCount}
                                problemLink={problem.link}
                            />
                        ))}
                        
                        {/* 페이지네이션 */}
                        {totalCount > 0 && (
                            <div className="flex justify-center gap-2 py-6 mt-auto">
                                <button onClick={() => setPage(old => Math.max(old - 1, 0))} disabled={page === 0} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">이전</button>
                                <span className="px-4 py-2">{page + 1} / {totalPages}</span>
                                <button onClick={() => setPage(old => (old + 1 < totalPages ? old + 1 : old))} disabled={page + 1 >= totalPages} className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50">다음</button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-grayscale-warm-gray bg-grayscale-default rounded-xl border border-dashed border-grayscale-warm-gray">
                        <p>등록된 문제가 없습니다.</p>
                        {userRole === "ADMIN" && <p className="text-sm mt-2">첫 번째 문제를 추가해보세요!</p>}
                    </div>
                )}
            </div>
        </div>
        
      </div>
    </BasePage>
  );
};

export default GroupDetailPage;