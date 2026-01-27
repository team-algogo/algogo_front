import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationItem from "./NotificationItem";
import { getNotificationList } from "@api/notification/getNotificationList";
import { deleteNotification } from "@api/notification/deleteNotification";
import useToast from "@hooks/useToast";
import type { Alarm } from "@type/notification/notification.d.ts";
import { useNavigate } from "react-router-dom";

type TabType = "NOTIFICATION" | "INVITE";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState<TabType>("NOTIFICATION");
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // 각 섹션별 펼침 상태 관리
  const [isExpandedRequiredReview, setIsExpandedRequiredReview] = useState(false);
  const [isExpandedNewComment, setIsExpandedNewComment] = useState(false);
  const [isExpandedInvite, setIsExpandedInvite] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      showToast("알림이 삭제되었습니다.", "success");
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

  // Sort notifications by createdAt (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Filter Logic
  const filteredNotifications = sortedNotifications.filter((item) => {
    const isGroupRelated = item.type.startsWith("GROUP_");

    if (activeTab === "INVITE") {
      return isGroupRelated;
    } else {
      return !isGroupRelated;
    }
  });

  const handleNotificationClick = (item: Alarm) => {
    // 초대 탭의 알람 처리
    if (activeTab === "INVITE") {
      const { type, payload } = item;
      const programId = payload?.programId || payload?.program_id;

      // GROUP_JOIN_APPLY: 그룹방 페이지로 이동 (가입 요청 모달 자동 오픈)
      if (type === "GROUP_JOIN_APPLY") {
        if (programId) {
          navigate(`/group/${programId}`, {
            state: { openJoinRequestModal: true }
          });
          onClose();
        }
        return;
      }

      // GROUP_INVITE_APPLY: 마이페이지로 이동
      if (type === "GROUP_INVITE_APPLY") {
        navigate("/mypage?tab=invite");
        onClose();
        return;
      }

      // GROUP_JOIN_UPDATE: 수락인 경우 그룹방으로 이동, 거절인 경우 클릭 불가
      if (type === "GROUP_JOIN_UPDATE") {
        const isAccepted = item.message && (item.message.includes("수락") || item.message.includes("ACCEPTED"));
        if (isAccepted) {
          const programId = payload?.programId || payload?.program_id;
          if (programId) {
            navigate(`/group/${programId}`);
            onClose();
          }
        }
        // 거절인 경우 아무 동작 안 함
        return;
      }

      // GROUP_INVITE_UPDATE: 클릭 불가 (아무 동작 안 함)
      if (type === "GROUP_INVITE_UPDATE") {
        return;
      }
    }

    // 알림 탭의 리뷰 관련 알람 (기존 로직 유지)
    if (activeTab === "NOTIFICATION") {
      const submissionId = item.payload.submissionId || item.payload?.submission_id;
      if (submissionId) {
        navigate(`/review/${submissionId}`);
        // 페이지 이동 후 알람창 닫기
        onClose();
      } else {
        console.warn("No submissionId found for notification", item);
      }
    }
  };


  return (
    <>
      <div className="absolute top-[60px] right-0 z-50 flex w-[420px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl backdrop-blur-sm">
        {/* Header / Tabs */}
        <div className="relative flex h-[52px] w-full flex-row border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
          <button
            onClick={() => setActiveTab("NOTIFICATION")}
            className={`relative flex flex-1 items-center justify-center text-[15px] font-semibold transition-all duration-200 ${activeTab === "NOTIFICATION"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            알림
            {activeTab === "NOTIFICATION" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></span>
            )}
          </button>
          <div className="h-6 w-px bg-gray-200 my-auto"></div>
          <button
            onClick={() => setActiveTab("INVITE")}
            className={`relative flex flex-1 items-center justify-center text-[15px] font-semibold transition-all duration-200 ${activeTab === "INVITE"
              ? "text-gray-900"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            초대
            {activeTab === "INVITE" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></span>
            )}
          </button>
        </div>

        {/* Content List */}
        <div className="max-h-[520px] overflow-y-auto bg-gray-50/30">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-sm text-gray-500 font-medium">알림을 불러오는 중...</div>
            </div>
          ) : (
            <div className="flex flex-col">
              {activeTab === "INVITE" ? (
                // Invite Tab Content
                <>
                  {filteredNotifications.length > 0 && (
                    <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-3.5 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                        <span className="text-sm font-semibold text-gray-900">초대 알림</span>
                      </div>
                      <span className="ml-auto rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                        {filteredNotifications.length}
                      </span>
                    </div>
                  )}
                  {filteredNotifications.length > 0 ? (
                    <>
                      {(() => {
                        const MAX_DISPLAY = 10;
                        const displayCount = isExpandedInvite
                          ? filteredNotifications.length
                          : Math.min(filteredNotifications.length, MAX_DISPLAY);
                        const displayItems = filteredNotifications.slice(0, displayCount);
                        const hasMore = filteredNotifications.length > MAX_DISPLAY;

                        return (
                          <>
                            {displayItems.map((item) => (
                              <NotificationItem
                                key={item.id}
                                alarm={item}
                                onClick={() => handleNotificationClick(item)}
                                isDeleteMode={isDeleteMode}
                                isSelected={selectedIds.includes(item.id)}
                                onToggleSelect={() => toggleSelect(item.id)}
                              />
                            ))}
                            {hasMore && (
                              <button
                                onClick={() => setIsExpandedInvite(!isExpandedInvite)}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all border-t border-gray-100 group"
                              >
                                {isExpandedInvite ? (
                                  <>
                                    <svg className="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    접기
                                  </>
                                ) : (
                                  <>
                                    알람 더보기
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                                      +{filteredNotifications.length - MAX_DISPLAY}
                                    </span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 p-16">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <div className="text-sm font-medium text-gray-600">초대 관련 알림이 없습니다</div>
                      <div className="text-xs text-gray-400">새로운 초대가 도착하면 여기에 표시됩니다</div>
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
                    const MAX_DISPLAY = 10;
                    const displayCount = isExpandedRequiredReview
                      ? requiredReviews.length
                      : Math.min(requiredReviews.length, MAX_DISPLAY);
                    const displayItems = requiredReviews.slice(0, displayCount);
                    const hasMore = requiredReviews.length > MAX_DISPLAY;

                    return (
                      <div className="flex flex-col border-b border-gray-200 bg-white">
                        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-3.5 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            <span className="text-sm font-semibold text-gray-900">작성해야 할 리뷰</span>
                          </div>
                          <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            {requiredReviews.length}
                          </span>
                        </div>
                        {requiredReviews.length > 0 ? (
                          <>
                            {displayItems.map((item) => (
                              <NotificationItem
                                key={item.id}
                                alarm={item}
                                onClick={() => handleNotificationClick(item)}
                                isDeleteMode={isDeleteMode}
                                isSelected={selectedIds.includes(item.id)}
                                onToggleSelect={() => toggleSelect(item.id)}
                              />
                            ))}
                            {hasMore && (
                              <button
                                onClick={() => setIsExpandedRequiredReview(!isExpandedRequiredReview)}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all border-t border-gray-100 group"
                              >
                                {isExpandedRequiredReview ? (
                                  <>
                                    <svg className="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    접기
                                  </>
                                ) : (
                                  <>
                                    알람 더보기
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                                      +{requiredReviews.length - MAX_DISPLAY}
                                    </span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3 p-12">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-600">모든 알림을 확인했습니다</div>
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
                    const MAX_DISPLAY = 10;
                    const displayCount = isExpandedNewComment
                      ? otherNotifications.length
                      : Math.min(otherNotifications.length, MAX_DISPLAY);
                    const displayItems = otherNotifications.slice(0, displayCount);
                    const hasMore = otherNotifications.length > MAX_DISPLAY;

                    return (
                      <div className="flex flex-col bg-white">
                        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-3.5 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                            <span className="text-sm font-semibold text-gray-900">새로운 댓글</span>
                          </div>
                          <span className="ml-auto rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            {otherNotifications.length}
                          </span>
                        </div>
                        {otherNotifications.length > 0 ? (
                          <>
                            {displayItems.map((item) => (
                              <NotificationItem
                                key={item.id}
                                alarm={item}
                                onClick={() => handleNotificationClick(item)}
                                isDeleteMode={isDeleteMode}
                                isSelected={selectedIds.includes(item.id)}
                                onToggleSelect={() => toggleSelect(item.id)}
                              />
                            ))}
                            {hasMore && (
                              <button
                                onClick={() => setIsExpandedNewComment(!isExpandedNewComment)}
                                className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-all border-t border-gray-100 group"
                              >
                                {isExpandedNewComment ? (
                                  <>
                                    <svg className="w-4 h-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    접기
                                  </>
                                ) : (
                                  <>
                                    알람 더보기
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                                      +{otherNotifications.length - MAX_DISPLAY}
                                    </span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-3 p-12">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="text-sm font-medium text-gray-600">모든 알림을 확인했습니다</div>
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
        <div className="flex items-center justify-center border-t border-gray-200 bg-gradient-to-b from-white to-gray-50/50 p-4">
          {!isDeleteMode ? (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              알림 삭제
            </button>
          ) : (
            <div className="flex w-full gap-2.5">
              <button
                onClick={() => {
                  setIsDeleteMode(false);
                  setSelectedIds([]);
                }}
                className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 hover:shadow-sm"
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
                className="flex-1 rounded-lg bg-primary-50 py-2.5 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100 hover:shadow-sm"
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
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${selectedIds.length > 0
                  ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-md"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
                  }`}
              >
                삭제 {selectedIds.length > 0 && `(${selectedIds.length})`}
              </button>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
