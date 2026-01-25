import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGroupJoinRequests, respondToJoinRequest, cancelGroupInvitation, fetchGroupInviteList } from "../../api/group/groupApi";
import Toast, { type ToastType } from "@components/toast/Toast";
import ConfirmModal from "@components/modal/ConfirmModal";
import Button from "@components/button/Button";
import Pagination from "@components/pagination/Pagination";

interface GroupJoinRequestsModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupJoinRequestsModal({ programId, onClose }: GroupJoinRequestsModalProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"JOIN_REQUEST" | "INVITE_LIST">("JOIN_REQUEST");
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

    // Pagination State
    const [page, setPage] = useState(0);
    const PAGE_SIZE = 5;

    // Reset page when tab changes
    if (activeTab === "JOIN_REQUEST" && page > 0 && activeTab !== "JOIN_REQUEST") {
        // This logic is tricky inside render if not effect. Better use effect.
    }

    // Better way:
    // const [page, setPage] = useState(0);
    // useEffect(() => setPage(0), [activeTab]); -> requires import useEffect

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

    // Pagination Slice Logic
    const offset = page * PAGE_SIZE;

    // We only paginate what we are showing
    // If Join Request Tab: use pendingRequests
    // If Invite List Tab: use invites

    const currentList = activeTab === "JOIN_REQUEST" ? pendingRequests : invites.filter((i: any) => i.status === "PENDING");
    const totalElements = currentList.length;

    // Sent Invitations: Only show PENDING ones
    const pendingInvites = activeTab === "INVITE_LIST" ? invites.filter((i: any) => i.status === "PENDING") : [];

    // Derived sub-lists
    const paginatedRequests = activeTab === "JOIN_REQUEST" ? pendingRequests.slice(offset, offset + PAGE_SIZE) : [];
    const paginatedInvites = activeTab === "INVITE_LIST" ? pendingInvites.slice(offset, offset + PAGE_SIZE) : [];

    // 가입 신청 승인/거절
    const mutation = useMutation({
        mutationFn: ({ joinId, isAccepted }: { joinId: number; isAccepted: "ACCEPTED" | "DENIED" }) =>
            respondToJoinRequest(programId, joinId, isAccepted),
        onSuccess: (_, variables) => {
            const msg = variables.isAccepted === "ACCEPTED" ? "승인되었습니다." : "거절되었습니다.";
            setToastConfig({ message: msg, type: "success" });
            queryClient.invalidateQueries({ queryKey: ["groupJoinRequests", programId] });
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] });
        },
        onError: (err) => {
            console.error(err);
            setToastConfig({ message: "처리 중 오류가 발생했습니다.", type: "error" });
        }
    });

    const cancelInviteMutation = useMutation({
        mutationFn: (inviteId: number) => cancelGroupInvitation(programId, inviteId),
        onSuccess: () => {
            setToastConfig({ message: "초대가 취소되었습니다.", type: "success" });
            queryClient.invalidateQueries({ queryKey: ["groupInviteList", programId] });
        },
        onError: (err) => {
            console.error(err);
            setToastConfig({ message: "초대 취소에 실패했습니다.", type: "error" });
        }
    });

    const handleAction = (joinId: number, isAccepted: "ACCEPTED" | "DENIED") => {
        setConfirmModal({
            isOpen: true,
            title: isAccepted === "ACCEPTED" ? "가입 승인" : "가입 거절",
            message: isAccepted === "ACCEPTED" ? "이 유저의 가입을 승인하시겠습니까?" : "이 유저의 가입을 거절하시겠습니까?",
            onConfirm: () => {
                mutation.mutate({ joinId, isAccepted });
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const handleCancelInvite = (inviteId: number) => {
        setConfirmModal({
            isOpen: true,
            title: "초대 취소",
            message: "정말 이 초대를 취소하시겠습니까?",
            onConfirm: () => {
                cancelInviteMutation.mutate(inviteId);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    const isLoading = activeTab === "JOIN_REQUEST" ? isRequestLoading : isInviteLoading;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {toastConfig && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig(null)}
                />
            )}
            <div className="bg-white w-[800px] min-h-[600px] max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden relative border border-gray-100">

                {/* 헤더 */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="font-headline text-2xl font-bold text-gray-900">그룹 관리</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* 탭 버튼 */}
                <div className="flex border-b border-gray-100 px-8 bg-white pt-2">
                    <button
                        onClick={() => setActiveTab("JOIN_REQUEST")}
                        className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === "JOIN_REQUEST"
                            ? "border-primary-main text-primary-main"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        가입 신청
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeTab === "JOIN_REQUEST" ? "bg-primary-50 text-primary-main" : "bg-gray-100 text-gray-500"}`}>
                            {pendingRequests.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("INVITE_LIST")}
                        className={`pb-4 px-4 text-sm font-bold transition-all border-b-2 ${activeTab === "INVITE_LIST"
                            ? "border-primary-main text-primary-main"
                            : "border-transparent text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        보낸 초대 목록
                        <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeTab === "INVITE_LIST" ? "bg-primary-50 text-primary-main" : "bg-gray-100 text-gray-500"}`}>
                            {invites.filter((i: any) => i.status === "PENDING").length}
                        </span>
                    </button>
                </div>


                {/* 리스트 영역 */}
                <div className="flex-1 overflow-auto p-0 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-60 text-gray-400 font-medium">
                            로딩 중...
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-gray-50/95 backdrop-blur-sm z-10 box-border border-b border-gray-100">
                                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-8 py-4 w-[40%]">유저</th>
                                        <th className="px-6 py-4 w-[35%]">이메일</th>
                                        <th className="px-6 py-4 w-[25%] text-center">{activeTab === "JOIN_REQUEST" ? "승인 / 거절" : "취소"}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activeTab === "JOIN_REQUEST" ? (
                                        // 가입 신청 목록
                                        paginatedRequests.length > 0 ? (
                                            paginatedRequests.map((req: any) => (
                                                <tr key={req.joinId} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={req.profileImage || "/icons/userIcon.svg"}
                                                                onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                                                alt="profile"
                                                                className={`w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm ${!req.profileImage || (req.profileImage as string).includes("userIcon") ? "p-2 bg-gray-50 object-contain" : ""}`}
                                                            />
                                                            <span className="font-bold text-gray-900 text-base">
                                                                {req.nickname}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-500 font-medium font-mono">{req.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center gap-2">
                                                            <Button
                                                                onClick={() => handleAction(req.joinId, "ACCEPTED")}
                                                                variant="primary"
                                                                className="!py-1.5 !px-3 !h-auto text-xs font-bold"
                                                            >
                                                                승인
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleAction(req.joinId, "DENIED")}
                                                                variant="text"
                                                                className="!py-1.5 !px-3 !h-auto text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 border-none"
                                                            >
                                                                거절
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-20 text-center text-gray-400 gap-2 flex-col">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-3xl">📭</span>
                                                        <span>대기 중인 가입 신청이 없습니다.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        // 초대 목록
                                        paginatedInvites.length > 0 ? (
                                            paginatedInvites.map((invite: any) => (
                                                <tr key={invite.inviteId} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={invite.profileImage || "/icons/userIcon.svg"}
                                                                onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                                                alt="profile"
                                                                className={`w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm ${!invite.profileImage || (invite.profileImage as string).includes("userIcon") ? "p-2 bg-gray-50 object-contain" : ""}`}
                                                            />
                                                            <span className="font-bold text-gray-900 text-base">
                                                                {invite.nickname}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-500 font-medium font-mono">{invite.email}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center gap-3">
                                                            <span className={`
                                                            text-xs px-2.5 py-1 rounded-full font-bold bg-yellow-50 text-yellow-600
                                                        `}>
                                                                대기중
                                                            </span>
                                                            <button
                                                                onClick={() => handleCancelInvite(invite.inviteId)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-alert-error hover:bg-red-50 rounded-lg transition-all"
                                                                title="초대 취소"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-20 text-center text-gray-400 gap-2 flex-col">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-3xl">📨</span>
                                                        <span>보낸 초대 내역이 없습니다.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>

                {/* Pagination Footer */}
                {totalElements > 0 && (
                    <div className="px-8 py-4 border-t border-gray-100 flex justify-center bg-white">
                        <Pagination
                            pageInfo={{
                                number: page,
                                size: PAGE_SIZE,
                                totalElements: totalElements,
                                totalPages: Math.ceil(totalElements / PAGE_SIZE),
                            }}
                            currentPage={page + 1}
                            onPageChange={(p) => setPage(p - 1)}
                        />
                    </div>
                )}

            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            />
        </div >
    );
}
