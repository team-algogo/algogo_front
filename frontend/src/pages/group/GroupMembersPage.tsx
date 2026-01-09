import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BasePage from "@pages/BasePage";
import { fetchGroupMembers, updateGroupMemberRole, deleteGroupMember, fetchGroupDetail } from "../../api/group/groupApi";

export default function GroupMembersPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const programId = Number(groupId);
    const queryClient = useQueryClient();

    // 내 권한 확인을 위해 그룹 상세 정보도 필요함 (또는 내 정보 API 호출)
    // 여기서는 그룹 상세 정보를 호출하여 내 Role을 확인한다고 가정
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

    // --- Mutations ---

    // 권한 수정
    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: number; role: "ADMIN" | "USER" }) =>
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
    const handleRoleChange = (userId: number, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        if (!window.confirm(`해당 멤버의 권한을 '${newRole}'(으)로 변경하시겠습니까?`)) return;
        updateRoleMutation.mutate({ userId, role: newRole });
    };

    const handleDeleteMember = (userId: number, nickname: string) => {
        if (!window.confirm(`'${nickname}'님을 그룹에서 정말 삭제하시겠습니까?`)) return;
        deleteMemberMutation.mutate(userId);
    };

    if (isLoading) return <BasePage><div className="text-center py-20">멤버 로딩 중...</div></BasePage>;

    return (
        <BasePage>
            <div className="w-full flex flex-col gap-6 px-4 py-6 max-w-[1000px] mx-auto min-h-[80vh]">

                {/* 헤더영역 */}
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-grayscale-warm-gray shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-6 h-6 text-grayscale-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h1 className="font-headline text-2xl text-grayscale-dark-gray">그룹 멤버 ({members.length})</h1>
                    </div>
                </div>

                {/* 멤버 리스트 */}
                <div className="w-full bg-white border border-grayscale-warm-gray rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-grayscale-warm-gray text-xs text-grayscale-warm-gray uppercase">
                                    <th className="px-6 py-4 font-bold">멤버</th>
                                    <th className="px-6 py-4 font-bold">이메일</th>
                                    <th className="px-6 py-4 font-bold">권한</th>
                                    {userRole === "ADMIN" && <th className="px-6 py-4 font-bold text-center">관리</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-grayscale-warm-gray/30">
                                {members.length > 0 ? (
                                    members.map((member: any) => (
                                        <tr key={member.programUserId} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={member.profileImage || "/default-profile.png"}
                                                        alt="profile"
                                                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
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
                                                        <button
                                                            onClick={() => handleRoleChange(member.programUserId, member.role)}
                                                            className="text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors"
                                                            title="권한 변경"
                                                        >
                                                            권한 변경
                                                        </button>
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
                    </div>
                </div>

            </div>
        </BasePage>
    );
}
