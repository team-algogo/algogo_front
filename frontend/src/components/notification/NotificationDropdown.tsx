import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationItem from "./NotificationItem";
import InviteModal from "./InviteModal";
import { getNotificationList } from "@api/notification/getNotificationList";
import { deleteNotification } from "@api/notification/deleteNotification";
import { respondToJoinRequest } from "@api/notification/respondToJoinRequest";
import { respondToInvite } from "@api/notification/respondToInvite";
import type { Alarm } from "@type/notification/notification.d.ts";

type TabType = "NOTIFICATION" | "INVITE";

export default function NotificationDropdown() {
    const [activeTab, setActiveTab] = useState<TabType>("NOTIFICATION");
    const [selectedNotification, setSelectedNotification] = useState<Alarm | null>(null);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data: notificationData, isLoading, isSuccess } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotificationList,
    });

    // Invalidate alarm count when notifications are fetched (server marks them as read)
    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ["alarmCount"] });
        }
    }, [isSuccess, queryClient]);

    const deleteMutation = useMutation({
        mutationFn: deleteNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            setSelectedIds([]);
            setIsDeleteMode(false);
        },
    });

    const respondToJoinMutation = useMutation({
        mutationFn: respondToJoinRequest,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            setSelectedNotification(null);
            alert(variables.isAccepted === "ACCEPTED" ? "참여 신청을 수락했습니다." : "참여 신청을 거절했습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to respond to join request", error);
            if (error.response?.status === 400) {
                alert("이미 처리된 요청입니다.");
            } else {
                alert("요청 처리에 실패했습니다.");
            }
        }
    });

    const respondToInviteMutation = useMutation({
        mutationFn: respondToInvite,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            setSelectedNotification(null);
            alert(variables.isAccepted === "ACCEPTED" ? "초대를 수락했습니다." : "초대를 거절했습니다.");
        },
        onError: (error: any) => {
            console.error("Failed to respond to invite", error);
            if (error.response?.status === 400) {
                alert("이미 처리된 요청입니다.");
            } else {
                alert("요청 처리에 실패했습니다.");
            }
        }
    });



    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleBatchDelete = () => {
        if (selectedIds.length === 0) return;
        deleteMutation.mutate(selectedIds);
    };

    const notifications: Alarm[] = notificationData?.data?.alarms || [];

    // Filter Logic
    const filteredNotifications = notifications.filter((item) => {
        const isGroupRelated = item.type.startsWith("GROUP_");

        if (activeTab === "INVITE") {
            return isGroupRelated;
        } else {
            return !isGroupRelated;
        }
    });

    const handleNotificationClick = (item: Alarm) => {
        // Only open modal for invites or join requests
        if (activeTab === "INVITE" && (item.type === "GROUP_INVITE_APPLY" || item.type === "GROUP_JOIN_APPLY")) {
            setSelectedNotification(item);
        } else {
            // Navigate or other handling for normal notifications
            console.log("Clicked notification", item.id);
        }
    };

    const handleAcceptInvite = () => {
        if (!selectedNotification) return;

        const { type, payload } = selectedNotification;

        if (type === "GROUP_JOIN_APPLY") {
            if (payload?.programId && payload?.joinId) {
                respondToJoinMutation.mutate({
                    programId: payload.programId,
                    joinId: payload.joinId,
                    isAccepted: "ACCEPTED"
                });
            }
        } else if (type === "GROUP_INVITE_APPLY") {
            if (payload?.programId && payload?.inviteId) {
                respondToInviteMutation.mutate({
                    programId: payload.programId,
                    inviteId: payload.inviteId,
                    isAccepted: "ACCEPTED"
                });
            }
        }
    };

    const handleRejectInvite = () => {
        if (!selectedNotification) return;

        const { type, payload } = selectedNotification;

        if (type === "GROUP_JOIN_APPLY") {
            if (payload?.programId && payload?.joinId) {
                respondToJoinMutation.mutate({
                    programId: payload.programId,
                    joinId: payload.joinId,
                    isAccepted: "DENIED"
                });
            }
        } else if (type === "GROUP_INVITE_APPLY") {
            if (payload?.programId && payload?.inviteId) {
                respondToInviteMutation.mutate({
                    programId: payload.programId,
                    inviteId: payload.inviteId,
                    isAccepted: "DENIED"
                });
            }
        }
    };

    return (
        <>
            <div className="absolute top-[60px] right-0 w-[400px] bg-white rounded-[12px] shadow-lg border border-[#F4F4F5] overflow-hidden flex flex-col z-50">
                {/* Header / Tabs */}
                <div className="flex flex-row w-full h-[48px] border-b border-[#F4F4F5] bg-white relative">
                    <button
                        onClick={() => setActiveTab("NOTIFICATION")}
                        className={`flex-1 flex items-center justify-center text-[15px] font-medium transition-colors ${activeTab === "NOTIFICATION"
                            ? "text-[#333333] border-b-2 border-[#333333]"
                            : "text-[#999999] hover:text-[#555555]"
                            }`}
                    >
                        알림
                    </button>
                    <button
                        onClick={() => setActiveTab("INVITE")}
                        className={`flex-1 flex items-center justify-center text-[15px] font-medium transition-colors ${activeTab === "INVITE"
                            ? "text-[#333333] border-b-2 border-[#333333]"
                            : "text-[#999999] hover:text-[#555555]"
                            }`}
                    >
                        초대
                    </button>
                </div>

                {/* Content List */}
                <div className="max-h-[500px] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-8 flex justify-center text-[#999999] text-[14px]">Loading...</div>
                    ) : (
                        <div className="flex flex-col">
                            {activeTab === "INVITE" ? (
                                // Invite Tab Content
                                <>
                                    {filteredNotifications.length > 0 && (
                                        <div className="px-4 py-3 bg-[#F9FAFB] text-[13px] font-medium text-[#727479] border-b border-[#F4F4F5] flex justify-between items-center">
                                            <span>초대 알림 ({filteredNotifications.length})</span>
                                        </div>
                                    )}
                                    {filteredNotifications.map((item) => (
                                        <NotificationItem
                                            key={item.id}
                                            alarm={item}
                                            onClick={() => handleNotificationClick(item)}
                                            isDeleteMode={isDeleteMode}
                                            isSelected={selectedIds.includes(item.id)}
                                            onToggleSelect={() => toggleSelect(item.id)}
                                        />
                                    ))}
                                    {filteredNotifications.length === 0 && (
                                        <div className="p-12 flex flex-col items-center justify-center gap-2 text-[#999999]">
                                            <div className="text-[14px]">초대 관련 알림이 없습니다.</div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // Notification Tab Content (Split into 2 sections)
                                <>
                                    {/* Section 1: Required Reviews */}
                                    {(() => {
                                        const requiredReviews = filteredNotifications.filter(n => n.type === 'REQUIRED_REVIEW');
                                        return (
                                            <div className="flex flex-col border-b border-[#F4F4F5]">
                                                <div className="px-4 py-3 bg-[#F9FAFB] text-[13px] font-medium text-[#727479] border-b border-[#F4F4F5] flex justify-between items-center">
                                                    <span>작성해야할 리뷰 ({requiredReviews.length})</span>
                                                </div>
                                                {requiredReviews.length > 0 ? (
                                                    requiredReviews.map((item) => (
                                                        <NotificationItem
                                                            key={item.id}
                                                            alarm={item}
                                                            onClick={() => handleNotificationClick(item)}
                                                            isDeleteMode={isDeleteMode}
                                                            isSelected={selectedIds.includes(item.id)}
                                                            onToggleSelect={() => toggleSelect(item.id)}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="p-12 flex flex-col items-center justify-center gap-2 text-[#999999]">
                                                        <div className="text-[14px]">모든 알림을 확인했습니다.</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Section 2: New Comments (Others) */}
                                    {(() => {
                                        const otherNotifications = filteredNotifications.filter(n => n.type !== 'REQUIRED_REVIEW');
                                        return (
                                            <div className="flex flex-col">
                                                <div className="px-4 py-3 bg-[#F9FAFB] text-[13px] font-medium text-[#727479] border-b border-[#F4F4F5] flex justify-between items-center">
                                                    <span>새로운 댓글 ({otherNotifications.length})</span>
                                                </div>
                                                {otherNotifications.length > 0 ? (
                                                    otherNotifications.map((item) => (
                                                        <NotificationItem
                                                            key={item.id}
                                                            alarm={item}
                                                            onClick={() => handleNotificationClick(item)}
                                                            isDeleteMode={isDeleteMode}
                                                            isSelected={selectedIds.includes(item.id)}
                                                            onToggleSelect={() => toggleSelect(item.id)}
                                                        />
                                                    ))
                                                ) : (
                                                    <div className="p-12 flex flex-col items-center justify-center gap-2 text-[#999999]">
                                                        <div className="text-[14px]">모든 알림을 확인했습니다.</div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer for Batch Delete */}
                <div className="p-3 border-t border-[#F4F4F5] flex justify-center items-center bg-white">
                    {!isDeleteMode ? (
                        <button
                            onClick={() => setIsDeleteMode(true)}
                            className="text-[13px] text-[#727479] hover:text-[#333333] transition-colors"
                        >
                            알림 삭제
                        </button>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <button
                                onClick={() => {
                                    setIsDeleteMode(false);
                                    setSelectedIds([]);
                                }}
                                className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 text-[13px] font-medium hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={() => {
                                    // Check if all filtered are selected
                                    const allFilteredIds = filteredNotifications.map(n => n.id);
                                    const isAllSelected = allFilteredIds.every(id => selectedIds.includes(id));

                                    if (isAllSelected) {
                                        // Deselect all filtered
                                        setSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
                                    } else {
                                        // Select all filtered (merge unique)
                                        setSelectedIds(prev => [...new Set([...prev, ...allFilteredIds])]);
                                    }
                                }}
                                className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 text-[13px] font-medium hover:bg-blue-200 transition-colors"
                            >
                                {filteredNotifications.every(n => selectedIds.includes(n.id)) && filteredNotifications.length > 0 ? "선택 해제" : "전체 선택"}
                            </button>
                            <button
                                onClick={handleBatchDelete}
                                disabled={selectedIds.length === 0}
                                className={`flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors ${selectedIds.length > 0
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                삭제 ({selectedIds.length})
                            </button>
                        </div>
                    )}
                </div>
            </div>


            {selectedNotification && (() => {
                const isInvite = selectedNotification.type === "GROUP_INVITE_APPLY";
                const isJoinRequest = selectedNotification.type === "GROUP_JOIN_APPLY";

                // Only render modal if it's one of these types
                if (isInvite || isJoinRequest) {
                    return (
                        <InviteModal
                            type={isInvite ? 'INVITE' : 'JOIN_REQUEST'}
                            programId={selectedNotification.payload?.programId}
                            userId={selectedNotification.payload?.userId}
                            onClose={() => setSelectedNotification(null)}
                            onAccept={handleAcceptInvite}
                            onReject={handleRejectInvite}
                        />
                    );
                }
                return null;
            })()}
        </>
    );
}

