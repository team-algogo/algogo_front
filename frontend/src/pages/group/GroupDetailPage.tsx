import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import GroupDetailInfo from "@components/cards/group/GroupDetailInfo";
import GroupProblemCard from "@components/cards/group/GroupProblemCard";
import Button from "@components/button/Button";
import {
    fetchGroupDetail,
    fetchGroupProblemList,
    deleteGroup,
    deleteGroupProblems,
    joinGroup,
} from "../../api/group/groupApi";
import EditGroupModal from "./EditGroupModal";
import GroupMemberModal from "./GroupMembersModal";
import GroupJoinRequestModal from "./GroupJoinRequestsModal";
import AddProblemModal from "./AddGroupProblemModal";
import ConfirmModal from "@components/modal/ConfirmModal";
import Pagination from "@components/pagination/Pagination";
import useToast from "@hooks/useToast";

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const programId = Number(groupId);

    const queryClient = useQueryClient();
    const { showToast } = useToast();

    // --- Modal States ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isJoinRequestModalOpen, setIsJoinRequestModalOpen] = useState(false); // 가입 요청 모달
    const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false); // 문제 추가 모달

    // 알람에서 그룹방으로 이동 시 가입 요청 모달 자동 오픈
    useEffect(() => {
        if (location.state?.openJoinRequestModal) {
            setIsJoinRequestModalOpen(true);
            // state를 제거하여 새로고침 시 모달이 다시 뜨지 않도록 함
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.state, navigate, location.pathname]);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // --- Data Fetching ---
    // 1. 그룹 상세 정보를 fetch
    const { data: detailData, isLoading: isDetailLoading } = useQuery({
        queryKey: ["groupDetail", programId],
        queryFn: () => fetchGroupDetail(programId),
        enabled: !!programId,
    });
    const groupDetail = detailData?.data;

    // 2. 그룹 문제 리스트
    const [page, setPage] = useState(0);

    // 페이지 변경 시 스크롤 맨 위로 이동
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [page]);

    // Fetch all (max 1000) to support client-side filtering with correct pagination
    const size = 1000;
    const [sortBy] = useState("endDate"); // Default sort by endDate
    const [sortDirection] = useState("asc");

    const { data: problemData } = useQuery({
        queryKey: ["groupProblems", programId, size, sortBy, sortDirection], // Remove 'page' from key so we don't refetch on client page change
        queryFn: () =>
            fetchGroupProblemList({
                programId,
                page: 0, // Always fetch page 0
                size,
                sortBy,
                sortDirection,
            }),
        enabled: !!programId,
    });
    const problemList = problemData?.data?.problemList || [];

    // 진행중인 문제만 보기 필터
    const [showInProgressOnly, setShowInProgressOnly] = useState(false);

    const filteredProblemList = showInProgressOnly
        ? problemList.filter((p) => {
            const now = new Date();
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return now >= start && now <= end;
        })
        : problemList;

    // Client-side Pagination
    const PAGE_SIZE = 10;
    const offset = page * PAGE_SIZE;
    const paginatedList = filteredProblemList.slice(offset, offset + PAGE_SIZE);
    const totalElements = filteredProblemList.length;
    const totalPages = Math.ceil(totalElements / PAGE_SIZE);


    // ...







    // 내 역할 확인
    const myRole = groupDetail?.groupRole;
    const isMaster = myRole === "ADMIN" || myRole === "MASTER";
    const canManageProblems = isMaster || myRole === "MANAGER";
    const isMember = myRole === "USER" || myRole === "MEMBER" || canManageProblems;

    // --- Mutations ---
    // 그룹 삭제
    const { mutate: deleteGroupMutate } = useMutation({
        mutationFn: () => deleteGroup(programId),
        onSuccess: () => {
            showToast("그룹이 삭제되었습니다.", "success");
            setTimeout(() => navigate("/group"), 1000); // 1초 뒤 이동
        },
        onError: () => showToast("그룹 삭제 실패", "error"),
    });

    // 그룹 탈퇴
    const handleLeaveGroup = () => {
        setConfirmModal({
            isOpen: true,
            title: "그룹 탈퇴",
            message: "정말 이 그룹을 탈퇴하시겠습니까?",
            onConfirm: () => {
                // api call...
                showToast("탈퇴 기능은 아직 구현 중입니다.", "info");
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    // 문제 삭제
    const { mutate: deleteProblemMutate } = useMutation({
        mutationFn: (problemId: number) => deleteGroupProblems(programId, [problemId]),
        onSuccess: () => {
            // 리스트 갱신
            queryClient.invalidateQueries({ queryKey: ["groupProblems", programId] });
            showToast("문제가 삭제되었습니다.", "success");
        },
        onError: () => showToast("문제 삭제 실패", "error"),
    });

    // 가입 신청 Mutation
    const { mutate: joinMutation } = useMutation({
        mutationFn: () => joinGroup(programId),
        onSuccess: () => {
            showToast("가입 신청이 완료되었습니다.", "success");
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "가입 신청 실패";
            showToast(msg, "error");
        },
    });

    // --- Handlers ---
    const handleDeleteGroup = () => {
        setConfirmModal({
            isOpen: true,
            title: "그룹 삭제",
            message: "정말 그룹을 삭제하시겠습니까? 복구할 수 없습니다.",
            onConfirm: () => {
                deleteGroupMutate();
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleJoin = () => {
        // 정원 초과 확인
        if (groupDetail.memberCount >= groupDetail.capacity) {
            showToast("정원이 가득 찬 그룹입니다.", "error");
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: "그룹 가입",
            message: "이 그룹에 가입 신청을 하시겠습니까?",
            onConfirm: () => {
                joinMutation();
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    if (isDetailLoading) return <div>Loading...</div>;
    if (!groupDetail) return <div>그룹 정보를 찾을 수 없습니다.</div>;

    return (
        <BasePage>
            {/* 모달들 */}
            {isEditModalOpen && (
                <EditGroupModal
                    programId={programId}
                    initialData={{
                        title: groupDetail.title,
                        description: groupDetail.description,
                        capacity: groupDetail.capacity,
                    }}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
            {isMemberModalOpen && (
                <GroupMemberModal
                    programId={programId}
                    onClose={() => setIsMemberModalOpen(false)}
                />
            )}
            {isJoinRequestModalOpen && (
                <GroupJoinRequestModal
                    programId={programId}
                    onClose={() => setIsJoinRequestModalOpen(false)}
                />
            )}
            {isAddProblemModalOpen && (
                <AddProblemModal
                    programId={programId}
                    onClose={() => setIsAddProblemModalOpen(false)}
                />
            )}

            <div className="w-full flex flex-col gap-6 px-4 py-6 mx-auto max-w-[1000px] min-h-[80vh]">
                {/* 1. 상단 정보 섹션 */}
                <GroupDetailInfo
                    title={groupDetail.title}
                    description={groupDetail.description}
                    memberCount={groupDetail.memberCount}
                    capacity={groupDetail.capacity}
                    problemCount={groupDetail.programProblemCount}
                    createdAt={groupDetail.createdAt}
                    rightContent={
                        isMaster ? (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    className="!px-3 !py-1 text-xs"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    수정
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="!px-3 !py-1 text-xs text-alert-error border-alert-error"
                                    onClick={handleDeleteGroup}
                                >
                                    삭제
                                </Button>
                            </div>
                        ) : isMember ? (
                            <Button
                                variant="secondary"
                                className="!px-3 !py-1 text-xs"
                                onClick={handleLeaveGroup}
                            >
                                탈퇴하기
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={handleJoin}
                            >
                                가입 신청
                            </Button>
                        )
                    }
                />

                {/* 2. 관리/멤버 메뉴 섹션 (멤버 이상만) */}
                {isMember && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div
                            onClick={() => setIsMemberModalOpen(true)}
                            className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="size-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-main group-hover:bg-primary-main group-hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-sm group-hover:text-primary-main transition-colors">멤버 목록</span>
                                <span className="text-xs text-gray-400">그룹 멤버를 확인하고 관리합니다</span>
                            </div>
                        </div>

                        {isMaster && (
                            <div
                                onClick={() => setIsJoinRequestModalOpen(true)}
                                className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                            >
                                <div className="size-10 bg-primary-50 rounded-full flex items-center justify-center text-primary-main group-hover:bg-primary-main group-hover:text-white transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="8.5" cy="7" r="4"></circle>
                                        <line x1="20" y1="8" x2="20" y2="14"></line>
                                        <line x1="23" y1="11" x2="17" y2="11"></line>
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 text-sm group-hover:text-primary-main transition-colors">가입 요청 관리</span>
                                    <span className="text-xs text-gray-400">신규 멤버의 가입 요청을 승인합니다</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. 문제 리스트 섹션 */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="font-headline text-xl text-grayscale-dark-gray">
                                문제 목록
                            </h2>
                            {/* Toggle Switch */}
                            <label className="flex items-center cursor-pointer select-none">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={showInProgressOnly}
                                        onChange={() => setShowInProgressOnly(!showInProgressOnly)}
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${showInProgressOnly ? 'bg-primary-main' : 'bg-gray-300'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showInProgressOnly ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <div className="ml-3 text-sm font-medium text-gray-700">
                                    진행중인 문제만 보기
                                </div>
                            </label>
                        </div>

                        {canManageProblems && (
                            <Button
                                variant="primary"
                                className="!px-4 !py-2 text-sm"
                                onClick={() => setIsAddProblemModalOpen(true)}
                            >
                                + 문제 추가
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {paginatedList.length > 0 ? (
                            paginatedList.map((problem: any, index: number) => (
                                <div
                                    key={problem.programProblemId}
                                    className="animate-fade-in-up opacity-0"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
                                >
                                    <GroupProblemCard
                                        programProblemId={problem.programProblemId}
                                        title={problem.problemResponseDto.title}
                                        startDate={problem.startDate}
                                        endDate={problem.endDate}
                                        problemLink={problem.problemResponseDto.problemLink}
                                        difficultyViewType={problem.difficultyViewType}
                                        userDifficulty={problem.userDifficultyType}
                                        problemDifficulty={problem.problemResponseDto.difficultyType}
                                        viewCount={problem.viewCount}
                                        submissionCount={problem.submissionCount}
                                        solvedCount={problem.solvedCount}
                                        onDelete={
                                            canManageProblems
                                                ? () => {
                                                    setConfirmModal({
                                                        isOpen: true,
                                                        title: "문제 삭제",
                                                        message: "이 문제를 그룹에서 제거하시겠습니까?",
                                                        onConfirm: () => {
                                                            deleteProblemMutate(problem.programProblemId);
                                                            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                                        },
                                                    });
                                                }
                                                : undefined
                                        }
                                        showSolveButton={false}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-grayscale-warm-gray border border-dashed border-grayscale-warm-gray rounded-xl">
                                {showInProgressOnly ? "진행중인 문제가 없습니다." : "등록된 문제가 없습니다."}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalElements > 0 && (
                        <Pagination
                            pageInfo={{
                                number: page,
                                size: PAGE_SIZE,
                                totalElements: totalElements,
                                totalPages: totalPages,
                            }}
                            currentPage={page + 1}
                            onPageChange={(p) => setPage(p - 1)}
                        />
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            />
        </BasePage>
    );
}