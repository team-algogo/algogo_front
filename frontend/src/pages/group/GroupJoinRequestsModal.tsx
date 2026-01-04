import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupJoinRequests, respondToJoinRequest, cancelGroupInvitation, fetchGroupInviteList } from "../../api/group/groupApi";

interface GroupJoinRequestsModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupJoinRequestsModal({ programId, onClose }: GroupJoinRequestsModalProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"JOIN_REQUEST" | "INVITE_LIST">("JOIN_REQUEST");

    // 가입 신청 목록 조회
    const { data: requestData, isLoading: isRequestLoading } = useQuery({
        queryKey: ["groupJoinRequests", programId],
        queryFn: () => fetchGroupJoinRequests(programId),
        enabled: !!programId && activeTab === "JOIN_REQUEST",
    });

    // 초대 목록 조회
    const { data: inviteData, isLoading: isInviteLoading } = useQuery({
        queryKey: ["groupInviteList", programId],
        queryFn: () => fetchGroupInviteList(programId),
        enabled: !!programId && activeTab === "INVITE_LIST",
    });

    const requests = requestData?.data?.users || [];
    const pendingRequests = requests.filter((u: any) => u.status === "PENDING");

    const invites = inviteData?.data?.users || [];

    // 가입 신청 승인/거절
    const mutation = useMutation({
        mutationFn: ({ joinId, isAccepted }: { joinId: number; isAccepted: "ACCEPTED" | "DENIED" }) =>
            respondToJoinRequest(programId, joinId, isAccepted),
        onSuccess: (_, variables) => {
            const msg = variables.isAccepted === "ACCEPTED" ? "승인되었습니다." : "거절되었습니다.";
            alert(msg);
            queryClient.invalidateQueries({ queryKey: ["groupJoinRequests", programId] });
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] });
        },
        onError: (err) => {
            console.error(err);
            alert("처리 중 오류가 발생했습니다.");
        }
    });

    // 가입 신청 취소/삭제 (만약 필요하다면) -> 기존 코드에 있었으나 API가 cancelGroupInvitation(inviteId) 였음.
    // 가입 신청에 대한 '취소'는 보통 유저가 하거나, 어드민은 '거절'을 함.
    // 기존 코드의 handleCancel이 cancelGroupInvitation을 쓰고 있었는데, 이건 초대 취소 API임.
    // JoinRequest에 대해 cancelGroupInvitation을 쓰는건 잘못된 매핑일 수 있음 (ID체계가 다르다면).
    // 하지만 기존 기능을 유지하라는 요청은 없었지만, "가입 신청 목록" 기능은 유지해야함.
    // 일단 기존 handleCancel은 '거절'과 유사하거나, 버그일 수 있음. 여기서는 '초대 취소'를 위한 Mutation을 새로 정의함.

    const cancelInviteMutation = useMutation({
        mutationFn: (inviteId: number) => cancelGroupInvitation(programId, inviteId),
        onSuccess: () => {
            alert("초대가 취소되었습니다.");
            queryClient.invalidateQueries({ queryKey: ["groupInviteList", programId] });
        },
        onError: (err) => {
            console.error(err);
            alert("초대 취소에 실패했습니다.");
        }
    });

    const handleAction = (joinId: number, isAccepted: "ACCEPTED" | "DENIED") => {
        if (!window.confirm(isAccepted === "ACCEPTED" ? "승인하시겠습니까?" : "거절하시겠습니까?")) return;
        mutation.mutate({ joinId, isAccepted });
    };

    const handleCancelInvite = (inviteId: number) => {
        if (!window.confirm("정말 이 초대를 취소하시겠습니까?")) return;
        cancelInviteMutation.mutate(inviteId);
    };

    const isLoading = activeTab === "JOIN_REQUEST" ? isRequestLoading : isInviteLoading;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-[800px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">

                {/* 헤더 */}
                <div className="p-6 border-b border-grayscale-warm-gray flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-4">
                        <h2 className="font-headline text-2xl text-grayscale-dark-gray">그룹 관리</h2>
                    </div>
                    <button onClick={onClose} className="text-grayscale-warm-gray hover:text-grayscale-dark-gray">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* 탭 버튼 */}
                <div className="flex border-b border-grayscale-warm-gray">
                    <button
                        onClick={() => setActiveTab("JOIN_REQUEST")}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "JOIN_REQUEST" ? "border-b-2 border-primary-main text-primary-main" : "text-grayscale-warm-gray hover:text-grayscale-dark-gray"}`}
                    >
                        가입 신청 ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("INVITE_LIST")}
                        className={`flex-1 py-3 text-sm font-bold transition-colors ${activeTab === "INVITE_LIST" ? "border-b-2 border-primary-main text-primary-main" : "text-grayscale-warm-gray hover:text-grayscale-dark-gray"}`}
                    >
                        보낸 초대 목록
                    </button>
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
                                    <th className="px-6 py-4 font-bold bg-gray-50/50">유저</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50/50">이메일</th>
                                    <th className="px-6 py-4 font-bold text-center bg-gray-50/50">{activeTab === "JOIN_REQUEST" ? "승인 / 거절" : "상태 / 취소"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-grayscale-warm-gray/30">
                                {activeTab === "JOIN_REQUEST" ? (
                                    // 가입 신청 목록
                                    pendingRequests.length > 0 ? (
                                        pendingRequests.map((req: any) => (
                                            <tr key={req.joinId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={req.profileImage || "/default-profile.png"}
                                                            alt="profile"
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                        />
                                                        <span className="font-bold text-grayscale-dark-gray text-sm">
                                                            {req.nickname}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-grayscale-dark-gray">
                                                    {req.email}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button
                                                            onClick={() => handleAction(req.joinId, "ACCEPTED")}
                                                            className="px-3 py-1 bg-primary-main text-white text-xs rounded hover:bg-primary-dark transition-colors"
                                                        >
                                                            승인
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.joinId, "DENIED")}
                                                            className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 transition-colors"
                                                        >
                                                            거절
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-grayscale-warm-gray">
                                                대기 중인 가입 신청이 없습니다.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    // 초대 목록
                                    invites.length > 0 ? (
                                        invites.map((invite: any) => (
                                            <tr key={invite.inviteId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={invite.profileImage || "/default-profile.png"}
                                                            alt="profile"
                                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                        />
                                                        <span className="font-bold text-grayscale-dark-gray text-sm">
                                                            {invite.nickname}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-grayscale-dark-gray">
                                                    {invite.email}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <span className={`
                                                            text-xs px-2 py-1 rounded-full font-medium
                                                            ${invite.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                                invite.status === 'DENIED' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'}
                                                        `}>
                                                            {invite.status}
                                                        </span>
                                                        {invite.status === 'PENDING' && (
                                                            <button
                                                                onClick={() => handleCancelInvite(invite.inviteId)}
                                                                className="text-red-400 hover:text-red-500 p-1"
                                                                title="초대 취소"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-10 text-center text-grayscale-warm-gray">
                                                보낸 초대 내역이 없습니다.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
