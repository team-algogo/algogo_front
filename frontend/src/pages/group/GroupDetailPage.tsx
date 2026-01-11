import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Toast, { type ToastType } from "@components/toast/Toast";

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const programId = Number(groupId);

    const queryClient = useQueryClient();

    // --- Modal States ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isJoinRequestModalOpen, setIsJoinRequestModalOpen] = useState(false); // 가입 요청 모달
    const [isAddProblemModalOpen, setIsAddProblemModalOpen] = useState(false); // 문제 추가 모달

    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
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
    const [page] = useState(0);
    const size = 10;
    const [sortBy] = useState("startDate");
    const [sortDirection] = useState("desc");

    const { data: problemData } = useQuery({
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
    const problemList = problemData?.data?.problemList || [];

    // 내 역할 확인
    const myRole = groupDetail?.groupRole;
    const isMaster = myRole === "ADMIN" || myRole === "MASTER";
    const isMember = myRole === "USER" || myRole === "MEMBER" || isMaster;

    // --- Mutations ---
    // 그룹 삭제
    const { mutate: deleteGroupMutate } = useMutation({
        mutationFn: () => deleteGroup(programId),
        onSuccess: () => {
            setToastConfig({ message: "그룹이 삭제되었습니다.", type: "success" });
            setTimeout(() => navigate("/group"), 1000); // 1초 뒤 이동
        },
        onError: () => setToastConfig({ message: "그룹 삭제 실패", type: "error" }),
    });

    // 그룹 탈퇴
    const handleLeaveGroup = () => {
        setConfirmModal({
            isOpen: true,
            title: "그룹 탈퇴",
            message: "정말 이 그룹을 탈퇴하시겠습니까?",
            onConfirm: () => {
                // api call...
                setToastConfig({ message: "탈퇴 기능은 아직 구현 중입니다.", type: "success" }); // info -> success temporarily to fix type error
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
            setToastConfig({ message: "문제가 삭제되었습니다.", type: "success" });
        },
        onError: () => setToastConfig({ message: "문제 삭제 실패", type: "error" }),
    });

    // 가입 신청 Mutation
    const { mutate: joinMutation } = useMutation({
        mutationFn: () => joinGroup(programId),
        onSuccess: () => {
            setToastConfig({ message: "가입 신청이 완료되었습니다.", type: "success" });
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] });
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || "가입 신청 실패";
            setToastConfig({ message: msg, type: "error" });
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
            {/* Toast */}
            {toastConfig && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig(null)}
                />
            )}

            {/* 모달들 */}
            {isEditModalOpen && (
                <EditGroupModal
                    programId={programId}
                    initialData={{
                        title: groupDetail.title,
                        description: groupDetail.description,
                        capacity: groupDetail.memberCount,
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
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsMemberModalOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <img src="/icons/groupIcon.svg" className="w-4 h-4" />
                            멤버 목록
                        </Button>

                        {isMaster && (
                            <Button
                                variant="secondary"
                                onClick={() => setIsJoinRequestModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <img src="/icons/addMemberIcon.svg" className="w-4 h-4" />
                                가입 요청 관리
                            </Button>
                        )}
                    </div>
                )}

                {/* 3. 문제 리스트 섹션 */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-headline text-xl text-grayscale-dark-gray">
                            문제 목록 ({problemList.length})
                        </h2>
                        {isMaster && (
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
                        {problemList.length > 0 ? (
                            problemList.map((problem: any) => (
                                <GroupProblemCard
                                    key={problem.programProblemId}
                                    programProblemId={problem.programProblemId} // Pass ID
                                    title={problem.problemResponseDto.title}
                                    difficulty={problem.problemResponseDto.difficultyType}
                                    addedAt={problem.startDate}
                                    solvedCount={problem.solvedCount || 0}
                                    totalMembers={groupDetail.memberCount}
                                    problemLink={problem.problemResponseDto.problemLink}
                                    onDelete={
                                        isMaster
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
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-grayscale-warm-gray border border-dashed border-grayscale-warm-gray rounded-xl">
                                등록된 문제가 없습니다.
                            </div>
                        )}
                    </div>
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