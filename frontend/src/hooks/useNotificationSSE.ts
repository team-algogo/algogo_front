import { useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore";
import useToastStore, { type ToastItem } from "@store/useToastStore";
import { connectSSE, disconnectSSE } from "@utils/sseAlarmClient";
import { mapAlarmToToastMessage } from "@utils/toastMessageMapper";
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

    const onInit = () => {
      console.log("[useNotificationSSE] SSE INIT received - Connected!");
    };

    const onNotification = (alarm: Alarm) => {
      console.log("[useNotificationSSE] Notification received:", alarm);

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

      // 3. 메시지 매핑
      const toastMessage = mapAlarmToToastMessage(alarm);
      console.log("[useNotificationSSE] Mapped toast message:", toastMessage);

      // 4. CTA 생성 (있을 경우)
      const cta =
        toastMessage.cta?.route
          ? {
              label: toastMessage.cta.label,
              onClick: () => {
                // navigate는 ToastItem에서 처리
              },
            }
          : undefined;

      // 5. 토스트 추가
      const toast: Omit<ToastItem, "id" | "createdAt"> = {
        message: toastMessage.title,
        description: toastMessage.description,
        type: toastType,
        cta: toastMessage.cta
          ? {
              label: toastMessage.cta.label,
              route: toastMessage.cta.route,
              params: toastMessage.cta.params,
            }
          : undefined,
      };

      console.log("[useNotificationSSE] Adding toast:", toast);
      addToast(toast);
      console.log("[useNotificationSSE] Toast added successfully");
    };

    const onError = (error: Event) => {
      console.error("[useNotificationSSE] SSE error:", error);
    };

    // SSE 연결
    const eventSource = connectSSE(authorization, onInit, onNotification, onError);

    return () => {
      console.log("[useNotificationSSE] Cleaning up SSE connection");
      disconnectSSE();
    };
  }, [authorization, userType, queryClient, addToast]);
};

export default useNotificationSSE;
