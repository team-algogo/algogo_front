import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupMembers, updateGroupMemberRole, deleteGroupMember, fetchGroupDetail } from "../../api/group/groupApi";
import { getUserDetail } from "@api/auth/auth";
import GroupInviteModal from "./GroupInviteModal";
import ConfirmModal from "@components/modal/ConfirmModal";
import Button from "@components/button/Button";

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

        // 2. Me second
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
            // alert("권한이 수정되었습니다."); // User requests no alerts, maybe Toast? But leaving for now or removing alert if silent update is OK. I'll rely on cache invalidation for UI update.
            queryClient.invalidateQueries({ queryKey: ["groupMembers", programId] });
        },
        onError: (err) => {
            console.error(err);
        },
    });

    // 멤버 강퇴/삭제
    const deleteMemberMutation = useMutation({
        mutationFn: (userId: number) => deleteGroupMember(programId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupMembers", programId] });
        },
        onError: (err) => {
            console.error(err);
        },
    });


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
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-[800px] max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden relative border border-gray-100">

                    {/* 헤더 */}
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <h2 className="font-headline text-2xl font-bold text-gray-900 flex items-center gap-2">
                                그룹 멤버
                            </h2>
                            <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-bold">
                                {sortedMembers.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {userRole === "ADMIN" && (
                                <Button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    variant="primary"
                                    className="!px-4 !py-2 !h-9 text-sm font-bold shadow-md shadow-primary-main/20 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        초대하기
                                    </div>
                                </Button>
                            )}
                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* 리스트 영역 */}
                    <div className="flex-1 overflow-auto p-0 scrollbar-hide">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-60 text-gray-400 font-medium">
                                로딩 중...
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 box-border border-b border-gray-100">
                                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-8 py-4 w-[40%]">멤버</th>
                                        <th className="px-6 py-4 w-[30%]">이메일</th>
                                        <th className="px-6 py-4 w-[15%] text-center">권한</th>
                                        {userRole === "ADMIN" && <th className="px-6 py-4 w-[15%] text-center">관리</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {sortedMembers.length > 0 ? (
                                        sortedMembers.map((member: any) => (
                                            <tr key={member.programUserId} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <img
                                                                src={member.profileImage || "/icons/userIcon.svg"}
                                                                onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                                                alt="profile"
                                                                className={`w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm ${!member.profileImage || (member.profileImage as string).includes("userIcon") ? "p-2 bg-gray-50 object-contain" : ""}`}
                                                            />
                                                            {member.role === "ADMIN" && (
                                                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1 rounded-full border-2 border-white" title="그룹장">
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-gray-900 text-base">
                                                                {member.nickname}
                                                                {myUserId === member.programUserId && (
                                                                    <span className="ml-2 text-xs bg-primary-50 text-primary-main px-1.5 py-0.5 rounded font-bold">ME</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-500 font-medium font-mono">{member.email}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center">
                                                        <span className={`
                                                            inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                                                            ${member.role === "ADMIN"
                                                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                : member.role === "MANAGER"
                                                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                                    : "bg-gray-100 text-gray-600 border-gray-200"}
                                                        `}>
                                                            {member.role}
                                                        </span>
                                                    </div>
                                                </td>
                                                {userRole === "ADMIN" && (
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center gap-2">
                                                            {member.role !== "ADMIN" ? (
                                                                <>
                                                                    <div className="relative group/select">
                                                                        <select
                                                                            className="appearance-none bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer hover:border-gray-300"
                                                                            value={member.role}
                                                                            onChange={(e) => handleRoleChange(member.programUserId, e.target.value as "MANAGER" | "USER")}
                                                                        >
                                                                            <option value="USER">USER</option>
                                                                            <option value="MANAGER">MANAGER</option>
                                                                        </select>
                                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400 group-hover/select:text-gray-600">
                                                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteMember(member.programUserId, member.nickname)}
                                                                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-alert-error hover:bg-red-50 rounded-lg transition-all"
                                                                        title="강퇴"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="text-xs text-gray-300 font-medium select-none text-center block w-full">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={userRole === "ADMIN" ? 4 : 3} className="px-6 py-20 text-center text-gray-400 gap-2 flex-col">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-3xl">👥</span>
                                                    <span>멤버가 없습니다.</span>
                                                </div>
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
