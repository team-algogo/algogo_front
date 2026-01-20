import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore";
import useToastStore, { type ToastItem } from "@store/useToastStore";
import { connectSSE, disconnectSSE } from "@utils/sseAlarmClient";
import { mapAlarmToToastMessage } from "@utils/toastMessageMapper";
import { respondToInvite } from "@api/notification/respondToInvite";
import { respondToJoinRequest } from "@api/notification/respondToJoinRequest";
import type { Alarm } from "@type/notification/notification.d.ts";

const useNotificationSSE = () => {
  const { authorization, userType } = useAuthStore();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  useEffect(() => {
    // userType이 없거나 토큰이 없으면 연결하지 않음
    if (!userType || !authorization) {
      console.log("[useNotificationSSE] Skipping connection - no userType or authorization");
      return;
    }

    console.log("[useNotificationSSE] Setting up SSE connection...");
    console.log(`[useNotificationSSE] Token exists: ${!!authorization}, UserType: ${userType}`);

    const onInit = () => {
      console.log("[useNotificationSSE] SSE INIT received - Connected!");
    };


    const onNotification = (alarm: Alarm) => {
      console.log("[useNotificationSSE] Notification received:", alarm);

      try {
        // 1. 배지 카운트 갱신
        queryClient.invalidateQueries({ queryKey: ["alarmCount"] });
        queryClient.invalidateQueries({ queryKey: ["notifications"] });

        // 2. 토스트 타입 결정
        let toastType: ToastItem["type"] = "success";

        switch (alarm.type) {
          case "GROUP_JOIN_APPLY":
          case "GROUP_INVITE_APPLY":
          case "REVIEW_CREATED":
          case "REPLY_REVIEW":
            toastType = "success";
            break;

          case "GROUP_JOIN_UPDATE":
          case "GROUP_INVITE_UPDATE": {
            const isDenied =
              alarm.message?.includes("DENIED") || alarm.message?.includes("거절");
            toastType = isDenied ? "error" : "success";
            break;
          }

          case "REQUIRED_REVIEW":
            toastType = "warning";
            break;

          default:
            toastType = "info";
        }

        // 3. 위치 결정 (SSE 알림은 항상 우하단)
        const position = "bottom-right";

        // 4. 메시지 매핑
        const toastMessage = mapAlarmToToastMessage(alarm);
        console.log("[useNotificationSSE] Mapped toast message:", toastMessage);

        // Action Buttons Logic
        const actions: any[] = []; // Explicitly typed array

        const handleAction = async (actionFn: () => Promise<any>, successMsg: string, errorMsg: string) => {
          try {
            await actionFn();
            addToast({ message: successMsg, type: "success", position: "bottom-right" });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
          } catch (error) {
            console.error(error);
            addToast({ message: errorMsg, type: "error", position: "bottom-right" });
          }
        };

        if (alarm.type === "GROUP_INVITE_APPLY" && alarm.payload?.inviteId && alarm.payload?.programId) {
          const { inviteId, programId } = alarm.payload;
          actions.push({
            label: "수락",
            variant: "primary",
            onClick: () => handleAction(
              () => respondToInvite({ programId, inviteId, isAccepted: "ACCEPTED" }),
              "초대를 수락했습니다.",
              "초대 수락 실패"
            )
          });
          actions.push({
            label: "거절",
            variant: "secondary",
            onClick: () => handleAction(
              () => respondToInvite({ programId, inviteId, isAccepted: "DENIED" }),
              "초대를 거절했습니다.",
              "초대 거절 실패"
            )
          });
        } else if (alarm.type === "GROUP_JOIN_APPLY" && alarm.payload?.joinId && alarm.payload?.programId) {
          const { joinId, programId } = alarm.payload;
          actions.push({
            label: "수락",
            variant: "primary",
            onClick: () => handleAction(
              () => respondToJoinRequest({ programId, joinId, isAccepted: "ACCEPTED" }),
              "가입 요청을 수락했습니다.",
              "가입 요청 수락 실패"
            )
          });
          actions.push({
            label: "거절",
            variant: "secondary",
            onClick: () => handleAction(
              () => respondToJoinRequest({ programId, joinId, isAccepted: "DENIED" }),
              "가입 요청을 거절했습니다.",
              "가입 요청 거절 실패"
            )
          });
        }

        // 5. 토스트 추가
        const toast: Omit<ToastItem, "id" | "createdAt"> = {
          message: toastMessage.title,
          description: toastMessage.description,
          type: toastType,
          position,
          cta: toastMessage.cta
            ? {
              label: toastMessage.cta.label,
              route: toastMessage.cta.route,
              params: toastMessage.cta.params,
            }
            : undefined,
          actions: actions.length > 0 ? actions : undefined,
        };

        console.log("[useNotificationSSE] Adding toast:", toast);
        addToast(toast);
        console.log("[useNotificationSSE] Toast added successfully");

      } catch (error) {
        console.error("[useNotificationSSE] Error processing notification:", error);
        // Fallback: Show raw message if something fails
        addToast({
          message: alarm.message || "새로운 알림이 도착했습니다.",
          type: "info",
          position: "bottom-right"
        });
      }
    };

    const onError = (error: Event) => {
      console.error("[useNotificationSSE] SSE error event:", error);
    };

    // SSE 연결
    connectSSE(authorization, onInit, onNotification, onError);

    return () => {
      console.log("[useNotificationSSE] Cleaning up SSE connection");
      disconnectSSE();
    };
  }, [authorization, userType, queryClient, addToast]);
};

export default useNotificationSSE;
