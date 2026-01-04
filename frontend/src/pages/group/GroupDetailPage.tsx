import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import Button from "@components/button/Button";
import GroupDetailInfo from "@components/cards/group/GroupDetailInfo";
import GroupProblemCard from "@components/cards/group/GroupProblemCard";
import { fetchGroupDetail, fetchGroupProblemList, deleteGroup, deleteGroupProblems, joinGroup } from "../../api/group/groupApi";
import AddGroupProblemModal from "./AddGroupProblemModal";
import EditGroupModal from "./EditGroupModal";
import GroupMembersModal from "./GroupMembersModal";
import GroupJoinRequestsModal from "./GroupJoinRequestsModal";

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const programId = Number(groupId);

    // --- 1. 상태 관리 ---
    const [page, setPage] = useState(0);
    const size = 10;
    const [sortBy, setSortBy] = useState("endDate");
    const [sortDirection, setSortDirection] = useState("asc");

    // 모달 상태
    const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [isJoinRequestModalOpen, setIsJoinRequestModalOpen] = useState(false);


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
    const problemList = problemData?.data?.problemList || [];
    const totalCount = problemData?.data?.page?.totalElements || 0;
    const totalPages = problemData?.data?.page?.totalPages || 0;

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

    // 문제 삭제 핸들러
    const handleDeleteProblem = async (problem: any) => {
        if (!window.confirm(`'${problem.problemResponseDto.title}' 문제를 정말 삭제하시겠습니까?`)) return;
        try {
            await deleteGroupProblems(programId, [problem.programProblemId]);
            alert("문제가 삭제되었습니다.");
            navigate(0);
        } catch (e) {
            console.error(e);
            alert("문제 삭제에 실패했습니다.");
        }
    };

    // 그룹 삭제 핸들러
    const handleDeleteGroup = async () => {
        if (!window.confirm("정말로 이 그룹을 삭제하시겠습니까?\n삭제된 그룹은 복구할 수 없습니다.")) return;
        try {
            await deleteGroup(programId);
            alert("그룹이 삭제되었습니다.");
            navigate("/groups");
        } catch (e) {
            console.error(e);
            alert("그룹 삭제에 실패했습니다.");
        }
    };

    // 그룹 가입 신청 핸들러
    const handleJoinGroup = async () => {
        if (!window.confirm("이 그룹에 가입을 신청하시겠습니까?")) return;
        try {
            await joinGroup(programId);
            alert("가입 신청이 완료되었습니다. 관리자의 승인을 기다려주세요.");
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.message || "가입 신청에 실패했습니다.");
        }
    };

    if (isDetailLoading) return <BasePage><div className="text-center py-20">로딩 중...</div></BasePage>;
    if (!groupInfo) return <BasePage><div className="text-center py-20">그룹 정보를 찾을 수 없습니다.</div></BasePage>;

    return (
        <BasePage>
            <div className="w-full flex flex-col gap-6 px-4 py-6 max-w-[1000px] mx-auto min-h-[80vh]">

                <div className="bg-gradient-to-br from-primary-light/30 to-white p-6 rounded-2xl border border-primary-light">
                    <GroupDetailInfo
                        title={groupInfo.title}
                        description={groupInfo.description}
                        memberCount={groupInfo.memberCount}
                        problemCount={groupInfo.programProblemCount || totalCount}
                        createdAt={groupInfo.createdAt}
                        rightContent={
                            userRole === "ADMIN" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                        title="그룹 정보 수정"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                        onClick={handleDeleteGroup}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                        title="그룹 삭제"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            )
                        }
                    />
                </div>

                <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src="/icons/bookIcon.svg" className="size-5" alt="book" />
                        <span className="font-headline text-grayscale-dark-gray text-lg">
                            등록된 문제 {totalCount}개
                        </span>
                    </div>

                    <div className="flex gap-2 flex-wrap justify-end">
                        <div className="w-fit">
                            <Button
                                variant="default"
                                onClick={() => setIsMembersModalOpen(true)}
                            >
                                <div className="flex items-center gap-1 whitespace-nowrap text-sm">
                                    <img src="/icons/groupIcon.svg" className="w-4 h-4" alt="member" />
                                    <span>멤버 {groupInfo.memberCount}명</span>
                                </div>
                            </Button>
                        </div>

                        {/* 가입하지 않은 유저(또는 권한 없는 유저)에게 가입 신청 버튼 표시 */}
                        {/* userRole이 "NONE" 등으로 올 수 있는지 확인 필요. 현재 로직: userRole = groupInfo?.groupRole || "USER" 
                                    만약 groupRole 필드가 본인의 role을 의미한다면, 가입 안되어있으면 null/undefined 일 수 있음.
                                    API 응답 구조상 groupRole이 내 role인지 확인해야 함. (보통 detail 조회시 내 권한을 줌)
                                    만약 null이면 'USER'로 default 잡았는데, 이러면 구분이 안됨.
                                    fetchGroupDetail 응답을 다시 확인해보면 좋겠지만, 일단 USER 등급도 이미 가입된 상태라고 가정.
                                    가입 안한 상태를 구분할 수 있어야 함. 
                                    하지만 API 명세에 따르면 groupRole이 "ADMIN" | "USER" 라고 되어있었음.
                                    만약 가입 안한 사람은? 
                                    User Request: "/api/v1/groups/{program_id}/join POST 요청으로 ... 참여하지 않았다면 참여 신청을 해야해"
                                    일단 "USER"가 아니거나 null이면 신청 버튼? 
                                    하지만 코드상 `userRole = groupInfo?.groupRole || "USER"`로 되어있어 가입 안해도 USER로 취급될 위험 있음.
                                    일단 groupInfo.groupRole이 falsy면 비회원으로 간주하고 "USER" default를 제거 또는 로직 수정 필요.
                                */}
                        {(!groupInfo.groupRole) && (
                            <div className="w-fit">
                                <Button
                                    variant="primary"
                                    onClick={handleJoinGroup}
                                >
                                    <span className="whitespace-nowrap text-sm">가입 신청</span>
                                </Button>
                            </div>
                        )}

                        {userRole === "ADMIN" && (
                            <>
                                <div className="w-fit">
                                    <Button
                                        variant="default"
                                        onClick={() => setIsJoinRequestModalOpen(true)}
                                    >
                                        <span className="whitespace-nowrap text-sm">신청 조회</span>
                                    </Button>
                                </div>

                                <div className="w-fit">
                                    <Button
                                        variant="default"
                                        onClick={() => setIsAddProblemModalOpen(true)}
                                    >
                                        <span className="whitespace-nowrap text-sm">문제 추가</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl p-6 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <img src="/icons/bookIcon.svg" className="size-5 opacity-60" alt="list" />
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

                    <div className="flex flex-col gap-3 flex-1">
                        {isProblemLoading ? (
                            <div className="flex-1 flex items-center justify-center text-grayscale-warm-gray">
                                문제 불러오는 중...
                            </div>
                        ) : problemList.length > 0 ? (
                            <>
                                {problemList.map((problem: any) => (
                                    <GroupProblemCard
                                        key={problem.programProblemId}
                                        title={problem.problemResponseDto.title}
                                        difficulty={problem.problemResponseDto.difficultyType}
                                        addedAt={problem.startDate}
                                        solvedCount={problem.solvedCount || 0}
                                        totalMembers={groupInfo.memberCount}
                                        problemLink={problem.problemResponseDto.problemLink}
                                        onDelete={userRole === "ADMIN" || userRole === "MANAGER" ? () => handleDeleteProblem(problem) : undefined}
                                    />
                                ))}

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

            {isAddProblemModalOpen && (
                <AddGroupProblemModal
                    programId={programId}
                    onClose={() => setIsAddProblemModalOpen(false)}
                />
            )}

            {isEditModalOpen && (
                <EditGroupModal
                    programId={programId}
                    initialData={{
                        title: groupInfo.title,
                        description: groupInfo.description,
                        capacity: groupInfo.capacity,
                    }}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}

            {isMembersModalOpen && (
                <GroupMembersModal
                    programId={programId}
                    onClose={() => setIsMembersModalOpen(false)}
                />
            )}

            {isJoinRequestModalOpen && (
                <GroupJoinRequestsModal
                    programId={programId}
                    onClose={() => setIsJoinRequestModalOpen(false)}
                />
            )}
        </BasePage>
    );
}