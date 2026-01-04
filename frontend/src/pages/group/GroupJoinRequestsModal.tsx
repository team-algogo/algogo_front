import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupJoinRequests, respondToJoinRequest, cancelGroupInvitation } from "../../api/group/groupApi";

interface GroupJoinRequestsModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupJoinRequestsModal({ programId, onClose }: GroupJoinRequestsModalProps) {
    const queryClient = useQueryClient();

    const { data: requestData, isLoading } = useQuery({
        queryKey: ["groupJoinRequests", programId],
        queryFn: () => fetchGroupJoinRequests(programId),
        enabled: !!programId,
    });

    const requests = requestData?.data?.users || [];
    // PENDING 상태인 유저만 보여주기 (이미 처리된 요청은 보통 리스트에서 사라지거나 필터링함. 요구사항: "이사람들을 ADMIN이 승인을 해야지")
    // API 응답에 status가 있으므로 PENDING인 사람들만 보여주는게 맞아보임.
    const pendingRequests = requests.filter((u: any) => u.status === "PENDING");

    const mutation = useMutation({
        mutationFn: ({ joinId, isAccepted }: { joinId: number; isAccepted: "ACCEPTED" | "DENIED" }) =>
            respondToJoinRequest(programId, joinId, isAccepted),
        onSuccess: (_, variables) => {
            const msg = variables.isAccepted === "ACCEPTED" ? "승인되었습니다." : "거절되었습니다.";
            alert(msg);
            queryClient.invalidateQueries({ queryKey: ["groupJoinRequests", programId] });
            // 멤버 리스트나 카운트도 갱신 필요할 수 있음
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] });
        },
        onError: (err) => {
            console.error(err);
            alert("처리 중 오류가 발생했습니다.");
        }
    });

    const cancelMutation = useMutation({
        mutationFn: (joinId: number) => cancelGroupInvitation(programId, joinId),
        onSuccess: () => {
            alert("초대가 취소되었습니다.");
            queryClient.invalidateQueries({ queryKey: ["groupJoinRequests", programId] });
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

    const handleCancel = (joinId: number) => {
        if (!window.confirm("정말 이 초대를 취소하시겠습니까? (또는 요청 삭제)")) return;
        cancelMutation.mutate(joinId);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-[800px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">

                {/* 헤더 */}
                <div className="p-6 border-b border-grayscale-warm-gray flex justify-between items-center bg-gray-50">
                    <h2 className="font-headline text-2xl text-grayscale-dark-gray flex items-center gap-2">
                        가입 신청 목록
                        <span className="text-base font-normal text-grayscale-warm-gray">({pendingRequests.length})</span>
                    </h2>
                    <button onClick={onClose} className="text-grayscale-warm-gray hover:text-grayscale-dark-gray">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
                                    <th className="px-6 py-4 font-bold bg-gray-50/50">신청자</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50/50">이메일</th>
                                    <th className="px-6 py-4 font-bold text-center bg-gray-50/50">승인 / 거절</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-grayscale-warm-gray/30">
                                {pendingRequests.length > 0 ? (
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
                                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                                    <button
                                                        onClick={() => handleCancel(req.joinId)}
                                                        className="text-red-400 hover:text-red-500 p-1"
                                                        title="초대 취소 / 삭제"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
