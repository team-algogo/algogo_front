import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MyGroupListCard from "@components/cards/group/MyGroupListCard";
import useToast from "@hooks/useToast";
import { getReceivedInvites, getSentJoins, respondToReceivedInvite, cancelSentJoin } from "@api/mypage";

import ConfirmModal from "@components/modal/ConfirmModal";
import type { Invite, Join } from "@type/mypage/InvitationStatus";

type Tab = "초대" | "신청";

const InvitationStatus = () => {
    const [activeTab, setActiveTab] = useState<Tab>("초대");
    const [selectedJoinToCancel, setSelectedJoinToCancel] = useState<Join | null>(null);
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: invitesData } = useQuery({
        queryKey: ["receivedInvites"],
        queryFn: getReceivedInvites,
    });

    const { data: joinsData } = useQuery({
        queryKey: ["sentJoins"],
        queryFn: getSentJoins,
    });

    const invites = (invitesData?.invites || []).filter(
        (invite) => invite.inviteStatus === "PENDING"
    );
    const joins = (joinsData?.joins || []).filter(
        (join) => join.joinStatus === "PENDING"
    );

    const respondMutation = useMutation({
        mutationFn: ({
            programId,
            inviteId,
            isAccepted,
        }: {
            programId: number;
            inviteId: number;
            isAccepted: "ACCEPTED" | "DENIED";
        }) => respondToReceivedInvite(programId, inviteId, isAccepted),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["receivedInvites"] });
            const message = variables.isAccepted === "ACCEPTED" ? "초대를 수락했습니다." : "초대를 거절했습니다.";
            showToast(message, "success");
        },
        onError: (error) => {
            console.error("Failed to respond to invite:", error);
            showToast("요청 처리에 실패했습니다.", "error");
        },
    });

    const handleRespond = (invite: Invite, isAccepted: boolean) => {
        respondMutation.mutate({
            programId: invite.groupRoom.programId,
            inviteId: invite.inviteId,
            isAccepted: isAccepted ? "ACCEPTED" : "DENIED",
        });
    };

    const cancelMutation = useMutation({
        mutationFn: ({
            programId,
            joinId,
        }: {
            programId: number;
            joinId: number;
        }) => cancelSentJoin(programId, joinId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sentJoins"] });
            showToast("참여 신청을 취소했습니다.", "success");
            setSelectedJoinToCancel(null);
        },
        onError: (error) => {
            console.error("Failed to cancel join request:", error);
            showToast("취소 요청에 실패했습니다.", "error");
        },
    });

    const handleCancelJoin = () => {
        if (!selectedJoinToCancel) return;
        cancelMutation.mutate({
            programId: selectedJoinToCancel.groupRoom.programId,
            joinId: selectedJoinToCancel.joinId,
        });
    };

    // Helper to get count
    const getCount = (tab: Tab) => {
        if (tab === "초대") return invites.length;
        return joins.length;
    };

    const currentCount = getCount(activeTab);

    return (
        <>
            {/* Main Header */}
            <div className="flex w-full items-center gap-2  mb-5">
                <h2
                    className="text-xl leading-[130%] font-bold tracking-[-0.2px] text-[#050505]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                >
                    초대 / 신청 현황
                </h2>
            </div>

            <div className="flex flex-col gap-8 w-full">
                {/* Tabs */}
                <div className="flex items-center border-b border-gray-200 w-full">
                    {(["초대", "신청"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-4 px-4 text-center font-medium text-base transition-colors relative ${activeTab === tab
                                ? "text-primary-600"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Sub Header & Content */}
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-lg text-[#050505]">
                            {activeTab === "초대" ? "내가 초대받은 그룹" : "내가 신청한 그룹"}
                        </span>
                        <div
                            className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs ${currentCount > 0
                                ? "bg-[#FF3B30] text-white"
                                : "bg-[#EBEBEB] text-[#727479]"
                                }`}
                        >
                            {currentCount}
                        </div>
                    </div>

                    {/* List */}
                    <div className="w-full">
                        {/* Empty State */}
                        {activeTab === "초대" && invites.length === 0 && (
                            <div className="py-20 text-center text-gray-400">
                                받은 초대가 없습니다.
                            </div>
                        )}
                        {activeTab === "신청" && joins.length === 0 && (
                            <div className="py-20 text-center text-gray-400">
                                신청한 그룹이 없습니다.
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {activeTab === "초대" &&
                                invites.map((invite: Invite) => (
                                    <MyGroupListCard
                                        key={`invite-${invite.inviteId}`}
                                        title={invite.groupRoom.title}
                                        description={invite.groupRoom.description}
                                        memberCount={invite.groupRoom.memberCount}
                                        problemCount={invite.groupRoom.programProblemCount}
                                        role={invite.groupRoom.isMember ? "USER" : "USER"}
                                        variant="mypage"
                                        onClick={() => { }} // Remove selection
                                        onAccept={() => handleRespond(invite, true)}
                                        onReject={() => handleRespond(invite, false)}
                                        hideRoleBadge={true}
                                    />
                                ))}

                            {activeTab === "신청" &&
                                joins.map((join: Join) => (
                                    <MyGroupListCard
                                        key={`join-${join.joinId}`}
                                        title={join.groupRoom.title}
                                        description={join.groupRoom.description}
                                        memberCount={join.groupRoom.memberCount}
                                        problemCount={join.groupRoom.programProblemCount}
                                        role={join.groupRoom.isMember ? "USER" : "USER"}
                                        variant="mypage"
                                        onCancel={() => setSelectedJoinToCancel(join)}
                                        hideRoleBadge={true}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirm Modal */}
            <ConfirmModal
                isOpen={!!selectedJoinToCancel}
                title="참여 신청 취소"
                message={`'${selectedJoinToCancel?.groupRoom.title}' 그룹 참여 신청을\n취소하시겠습니까?`}
                onConfirm={handleCancelJoin}
                onCancel={() => setSelectedJoinToCancel(null)}
                confirmLabel="취소하기"
                cancelLabel="닫기"
            />
        </>
    );
};

export default InvitationStatus;

