import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationItem from "./NotificationItem";
import InviteModal from "./InviteModal";
import { getNotificationList } from "@api/notification/getNotificationList";
import { deleteNotification } from "@api/notification/deleteNotification";
import { respondToJoinRequest } from "@api/notification/respondToJoinRequest";
import { respondToInvite } from "@api/notification/respondToInvite";
import Toast, { type ToastType } from "@components/toast/Toast";
import type { Alarm } from "@type/notification/notification.d.ts";
import { useNavigate } from "react-router-dom";

type TabType = "NOTIFICATION" | "INVITE";

export default function NotificationDropdown() {
  const [activeTab, setActiveTab] = useState<TabType>("NOTIFICATION");
  const [selectedNotification, setSelectedNotification] =
    useState<Alarm | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch notifications
  const {
    data: notificationData,
    isLoading,
    isSuccess,
  } = useQuery({
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
      setToastConfig({ message: "알림이 삭제되었습니다.", type: "success" });
    },
  });

  const respondToJoinMutation = useMutation({
    mutationFn: respondToJoinRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setSelectedNotification(null);
      setToastConfig({
        message: variables.isAccepted === "ACCEPTED"
          ? "참여 신청을 수락했습니다."
          : "참여 신청을 거절했습니다.",
        type: "success"
      });
    },
    onError: (error: any) => {
      console.error("Failed to respond to join request", error);
      const msg = error.response?.data?.message || "요청 처리에 실패했습니다.";
      setToastConfig({ message: msg, type: "error" });
    },
  });

  const respondToInviteMutation = useMutation({
    mutationFn: respondToInvite,
    onSuccess: (data: any, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setSelectedNotification(null);
      setToastConfig({
        message: data?.message || (variables.isAccepted === "ACCEPTED"
          ? "초대를 수락했습니다."
          : "초대를 거절했습니다."),
        type: "success"
      });
    },
    onError: (error: any) => {
      console.error("Failed to respond to invite", error);
      const msg = error.response?.data?.message || "요청 처리에 실패했습니다.";
      setToastConfig({ message: msg, type: "error" });

      // 이미 처리된 경우(400 등)에도 목록 갱신 시도
      if (error.response?.status === 400 || error.response?.status === 409) {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      }
    },
  });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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
    if (
      activeTab === "INVITE" &&
      (item.type === "GROUP_INVITE_APPLY" || item.type === "GROUP_JOIN_APPLY")
    ) {
      setSelectedNotification(item);
    } else {
      // Navigate or other handling for normal notifications
      navigate(`/review/${item.payload.submissionId}`);
      console.log("Clicked notification", item.id);
    }
  };

  const handleAcceptInvite = () => {
    console.log("handleAcceptInvite called", selectedNotification);
    if (!selectedNotification) return;

    const { type, payload } = selectedNotification;
    console.log("Payload:", payload);

    // Fallback for snake_case
    const pId = payload?.programId || payload?.program_id;
    const jId = payload?.joinId || payload?.join_id;
    const iId = payload?.inviteId || payload?.invite_id;

    if (type === "GROUP_JOIN_APPLY") {
      if (pId && jId) {
        console.log("Mutating join request accept");
        respondToJoinMutation.mutate({
          programId: pId,
          joinId: jId,
          isAccepted: "ACCEPTED",
        });
      } else {
        console.error("Missing payload for JOIN_APPLY", payload);
      }
    } else if (type === "GROUP_INVITE_APPLY") {
      if (pId && iId) {
        console.log("Mutating invite accept");
        respondToInviteMutation.mutate({
          programId: pId,
          inviteId: iId,
          isAccepted: "ACCEPTED",
        });
      } else {
        console.error("Missing payload for INVITE_APPLY", payload);
      }
    }
  };

  const handleRejectInvite = () => {
    console.log("handleRejectInvite called", selectedNotification);
    if (!selectedNotification) return;

    const { type, payload } = selectedNotification;

    // Fallback for snake_case
    const pId = payload?.programId || payload?.program_id;
    const jId = payload?.joinId || payload?.join_id;
    const iId = payload?.inviteId || payload?.invite_id;

    if (type === "GROUP_JOIN_APPLY") {
      if (pId && jId) {
        console.log("Mutating join request deny");
        respondToJoinMutation.mutate({
          programId: pId,
          joinId: jId,
          isAccepted: "DENIED",
        });
      }
    } else if (type === "GROUP_INVITE_APPLY") {
      if (pId && iId) {
        console.log("Mutating invite deny");
        respondToInviteMutation.mutate({
          programId: pId,
          inviteId: iId,
          isAccepted: "DENIED",
        });
      }
    }
  };

  return (
    <>
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}
      <div className="absolute top-[60px] right-0 z-50 flex w-[400px] flex-col overflow-hidden rounded-[12px] border border-[#F4F4F5] bg-white shadow-lg">
        {/* Header / Tabs */}
        <div className="relative flex h-[48px] w-full flex-row border-b border-[#F4F4F5] bg-white">
          <button
            onClick={() => setActiveTab("NOTIFICATION")}
            className={`flex flex-1 items-center justify-center text-[15px] font-medium transition-colors ${activeTab === "NOTIFICATION"
              ? "border-b-2 border-[#333333] text-[#333333]"
              : "text-[#999999] hover:text-[#555555]"
              }`}
          >
            알림
          </button>
          <button
            onClick={() => setActiveTab("INVITE")}
            className={`flex flex-1 items-center justify-center text-[15px] font-medium transition-colors ${activeTab === "INVITE"
              ? "border-b-2 border-[#333333] text-[#333333]"
              : "text-[#999999] hover:text-[#555555]"
              }`}
          >
            초대
          </button>
        </div>

        {/* Content List */}
        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8 text-[14px] text-[#999999]">
              Loading...
            </div>
          ) : (
            <div className="flex flex-col">
              {activeTab === "INVITE" ? (
                // Invite Tab Content
                <>
                  {filteredNotifications.length > 0 && (
                    <div className="flex items-center justify-between border-b border-[#F4F4F5] bg-[#F9FAFB] px-4 py-3 text-[13px] font-medium text-[#727479]">
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
                    <div className="flex flex-col items-center justify-center gap-2 p-12 text-[#999999]">
                      <div className="text-[14px]">
                        초대 관련 알림이 없습니다.
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Notification Tab Content (Split into 2 sections)
                <>
                  {/* Section 1: Required Reviews */}
                  {(() => {
                    const requiredReviews = filteredNotifications.filter(
                      (n) => n.type === "REQUIRED_REVIEW",
                    );
                    return (
                      <div className="flex flex-col border-b border-[#F4F4F5]">
                        <div className="flex items-center justify-between border-b border-[#F4F4F5] bg-[#F9FAFB] px-4 py-3 text-[13px] font-medium text-[#727479]">
                          <span>
                            작성해야할 리뷰 ({requiredReviews.length})
                          </span>
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
                          <div className="flex flex-col items-center justify-center gap-2 p-12 text-[#999999]">
                            <div className="text-[14px]">
                              모든 알림을 확인했습니다.
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Section 2: New Comments (Others) */}
                  {(() => {
                    const otherNotifications = filteredNotifications.filter(
                      (n) => n.type !== "REQUIRED_REVIEW",
                    );
                    return (
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between border-b border-[#F4F4F5] bg-[#F9FAFB] px-4 py-3 text-[13px] font-medium text-[#727479]">
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
                          <div className="flex flex-col items-center justify-center gap-2 p-12 text-[#999999]">
                            <div className="text-[14px]">
                              모든 알림을 확인했습니다.
                            </div>
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
        <div className="flex items-center justify-center border-t border-[#F4F4F5] bg-white p-3">
          {!isDeleteMode ? (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="text-[13px] text-[#727479] transition-colors hover:text-[#333333]"
            >
              알림 삭제
            </button>
          ) : (
            <div className="flex w-full gap-2">
              <button
                onClick={() => {
                  setIsDeleteMode(false);
                  setSelectedIds([]);
                }}
                className="flex-1 rounded-lg bg-gray-100 py-2 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={() => {
                  // Check if all filtered are selected
                  const allFilteredIds = filteredNotifications.map((n) => n.id);
                  const isAllSelected = allFilteredIds.every((id) =>
                    selectedIds.includes(id),
                  );

                  if (isAllSelected) {
                    // Deselect all filtered
                    setSelectedIds((prev) =>
                      prev.filter((id) => !allFilteredIds.includes(id)),
                    );
                  } else {
                    // Select all filtered (merge unique)
                    setSelectedIds((prev) => [
                      ...new Set([...prev, ...allFilteredIds]),
                    ]);
                  }
                }}
                className="flex-1 rounded-lg bg-blue-100 py-2 text-[13px] font-medium text-blue-600 transition-colors hover:bg-blue-200"
              >
                {filteredNotifications.every((n) =>
                  selectedIds.includes(n.id),
                ) && filteredNotifications.length > 0
                  ? "선택 해제"
                  : "전체 선택"}
              </button>
              <button
                onClick={handleBatchDelete}
                disabled={selectedIds.length === 0}
                className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition-colors ${selectedIds.length > 0
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
              >
                삭제 ({selectedIds.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedNotification &&
        (() => {
          const isInvite = selectedNotification.type === "GROUP_INVITE_APPLY";
          const isJoinRequest =
            selectedNotification.type === "GROUP_JOIN_APPLY";

          // Only render modal if it's one of these types
          if (isInvite || isJoinRequest) {
            return (
              <InviteModal
                type={isInvite ? "INVITE" : "JOIN_REQUEST"}
                programId={
                  selectedNotification.payload?.programId ||
                  selectedNotification.payload?.program_id
                }
                userId={
                  selectedNotification.payload?.userId ||
                  selectedNotification.payload?.user_id
                }
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
