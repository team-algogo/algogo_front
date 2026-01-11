import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupMembers, updateGroupMemberRole, deleteGroupMember, fetchGroupDetail } from "../../api/group/groupApi";
import { getUserDetail } from "@api/auth/auth";
import GroupInviteModal from "./GroupInviteModal";
import ConfirmModal from "@components/modal/ConfirmModal";

interface GroupMembersModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupMembersModal({ programId, onClose }: GroupMembersModalProps) {
    const queryClient = useQueryClient();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // 내 정보 조회 (ID 확인용)
    const { data: myData } = useQuery({
        queryKey: ["myProfile"],
        queryFn: getUserDetail,
    });
    const myUserId = myData?.userId;

    // Confirm Modal State
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

    // 내 권한 확인을 위해 그룹 상세 정보 조회
    const { data: detailData } = useQuery({
        queryKey: ["groupDetail", programId],
        queryFn: () => fetchGroupDetail(programId),
        enabled: !!programId,
    });
    const userRole = detailData?.data?.groupRole || "USER"; // "ADMIN" | "USER"

    // 멤버 리스트 조회
    const { data: memberData, isLoading } = useQuery({
        queryKey: ["groupMembers", programId],
        queryFn: () => fetchGroupMembers(programId),
        enabled: !!programId,
    });

    const members = memberData?.data?.members || [];

    // Sort Members: ADMIN -> Me -> Others
    const sortedMembers = [...members].sort((a, b) => {
        // 1. Admin first
        if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
        if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;

        // 2. Me second (if not admin, or if both admin - unlikely but safe)
        // Group Member API의 programUserId가 userId와 같은지 확인해야 함.
        // 보통 member.programUserId가 user의 PK인지, group-user relation PK인지 확인 필요.
        // API 응답 예시를 못봤지만, 보통 list api는 userId를 줄 것임.
        // GroupMembersModal.tsx의 기존 코드에서 handleDeleteMember(member.programUserId)를 호출함.
        // deleteGroupMember API는 (programId, userId)를 받음.
        // 따라서 programUserId는 User Table의 PK일 가능성이 높음.
        if (myUserId && a.programUserId === myUserId && b.programUserId !== myUserId) return -1;
        if (myUserId && a.programUserId !== myUserId && b.programUserId === myUserId) return 1;

        // 3. Others (Alphabetical by nickname)
        return a.nickname.localeCompare(b.nickname);
    });

    // --- Mutations ---

    // 권한 수정
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: "ADMIN" | "MANAGER" | "USER" }) =>
            updateGroupMemberRole(programId, userId, role),
        onSuccess: () => {
            alert("권한이 수정되었습니다.");
            queryClient.invalidateQueries({ queryKey: ["groupMembers", programId] });
        },
        onError: (err) => {
            console.error(err);
            alert("권한 수정에 실패했습니다.");
        },
    });

    // 멤버 강퇴/삭제
    const deleteMemberMutation = useMutation({
        mutationFn: (userId: number) => deleteGroupMember(programId, userId),
        onSuccess: () => {
            alert("멤버가 삭제되었습니다.");
            queryClient.invalidateQueries({ queryKey: ["groupMembers", programId] });
        },
        onError: (err) => {
            console.error(err);
            alert("멤버 삭제에 실패했습니다.");
        },
    });


    // --- Handlers ---
    // --- Handlers ---
    const handleRoleChange = (targetUserId: number, newRole: "MANAGER" | "USER") => {
        setConfirmModal({
            isOpen: true,
            title: "권한 변경",
            message: `해당 멤버의 권한을 '${newRole}'(으)로 변경하시겠습니까?`,
            onConfirm: () => {
                updateRoleMutation.mutate({ userId: targetUserId, role: newRole });
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleDeleteMember = (targetUserId: number, nickname: string) => {
        setConfirmModal({
            isOpen: true,
            title: "멤버 강퇴",
            message: `'${nickname}'님을 그룹에서 정말 삭제하시겠습니까?`,
            onConfirm: () => {
                deleteMemberMutation.mutate(targetUserId);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-[900px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">

                    {/* 헤더 */}
                    <div className="p-6 border-b border-grayscale-warm-gray flex justify-between items-center bg-gray-50">
                        <h2 className="font-headline text-2xl text-grayscale-dark-gray flex items-center gap-2">
                            그룹 멤버
                            <span className="text-base font-normal text-grayscale-warm-gray">({sortedMembers.length})</span>
                        </h2>
                        <div className="flex items-center gap-2">
                            {userRole === "ADMIN" && (
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="bg-primary-main/10 text-primary-main hover:bg-primary-main hover:text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    초대
                                </button>
                            )}
                            <button onClick={onClose} className="text-grayscale-warm-gray hover:text-grayscale-dark-gray">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* 리스트 영역 */}
                    <div className="flex-1 overflow-auto p-0">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40 text-grayscale-warm-gray">
                                로딩 중...
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white z-10 shadow-sm">
                                    <tr className="border-b border-grayscale-warm-gray text-xs text-grayscale-warm-gray uppercase">
                                        <th className="px-6 py-4 font-bold bg-gray-50/50">멤버</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50/50">이메일</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50/50">권한</th>
                                        {userRole === "ADMIN" && <th className="px-6 py-4 font-bold text-center bg-gray-50/50">관리</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-grayscale-warm-gray/30">
                                    {sortedMembers.length > 0 ? (
                                        sortedMembers.map((member: any) => (
                                            <tr key={member.programUserId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={member.profileImage || "/icons/userIcon.svg"}
                                                            onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                                            alt="profile"
                                                            className={`w-10 h-10 rounded-full object-cover border border-gray-200 ${!member.profileImage || (member.profileImage as string).includes("userIcon") ? "p-2 bg-gray-100 object-contain" : ""}`}
                                                        />
                                                        <span className="font-bold text-grayscale-dark-gray text-sm">
                                                            {member.nickname}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-grayscale-dark-gray">
                                                    {member.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`
                                                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${member.role === "ADMIN" ? "bg-primary-light text-primary-dark" : "bg-gray-100 text-gray-800"}
                                                `}>
                                                        {member.role}
                                                    </span>
                                                </td>
                                                {userRole === "ADMIN" && (
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {member.role !== "ADMIN" && (
                                                                <div className="flex items-center gap-1">
                                                                    <select
                                                                        className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary-main"
                                                                        value={member.role}
                                                                        onChange={(e) => handleRoleChange(member.programUserId, e.target.value as "MANAGER" | "USER")}
                                                                    >
                                                                        <option value="USER">USER</option>
                                                                        <option value="MANAGER">MANAGER</option>
                                                                    </select>
                                                                </div>
                                                            )}
                                                            {member.role === "ADMIN" && (
                                                                <span className="text-xs text-gray-400">변경 불가</span>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteMember(member.programUserId, member.nickname)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                title="강퇴"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={userRole === "ADMIN" ? 4 : 3} className="px-6 py-10 text-center text-grayscale-warm-gray">
                                                멤버가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {isInviteModalOpen && (
                <GroupInviteModal
                    programId={programId}
                    onClose={() => setIsInviteModalOpen(false)}
                />
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}
