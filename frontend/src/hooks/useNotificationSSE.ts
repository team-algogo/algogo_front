import { useEffect } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@store/useAuthStore";
import useToastStore from "@store/useToastStore";
import { getNotificationMessage } from "@utils/notificationMessage";

const useNotificationSSE = () => {
    const { authorization, userType } = useAuthStore();
    const queryClient = useQueryClient();
    const { showToast } = useToastStore();

    useEffect(() => {
        // userType이 없거나 토큰이 없으면 연결하지 않음
        if (!userType || !authorization) return;

        let eventSource: EventSourcePolyfill | null = null;

        const connect = () => {
            eventSource = new EventSourcePolyfill(
                `${import.meta.env.VITE_API_BASE_URL}/api/v1/alarm/subscribe`,
                {
                    headers: {
                        Authorization: `Bearer ${authorization}`,
                    },
                    heartbeatTimeout: 86400000,
                } as any // Type casting to avoid type error with polyfill options
            );

            // INIT 이벤트 (최초 연결)
            eventSource.addEventListener("INIT", () => {
                console.log("SSE Connected!");
            });

            // 알림 수신 이벤트
            eventSource.addEventListener("NOTIFICATION", (event: any) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("알람 도착: ", data);
                    
                    // 1. 배지 카운트 갱신 (Invalidate queries)
                    queryClient.invalidateQueries({ queryKey: ['alarmCount'] });
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });

                    // 2. 토스트 메시지 출력
                    const message = getNotificationMessage(data);
                    
                    let toastType: "success" | "info" | "error" | "warning" = "success";

                    switch (data.type) {
                        case "GROUP_JOIN_APPLY":
                        case "GROUP_INVITE_APPLY":
                        case "REVIEW_CREATED":
                        case "REPLY_REVIEW":
                            toastType = "success";
                            break;
                            
                        case "GROUP_JOIN_UPDATE":
                        case "GROUP_INVITE_UPDATE":
                            // Check for denial keywords (English or Korean)
                            const isDenied = data.message?.includes("DENIED") || data.message?.includes("거절");
                            toastType = isDenied ? "error" : "success";
                            break;
                            
                        case "REQUIRED_REVIEW":
                            toastType = "warning";
                            break;
                            
                        default:
                            toastType = "info";
                    }

                    showToast(message, toastType);

                } catch (error) {
                    console.error("Failed to parse notification data:", error);
                }
            });

            eventSource.onerror = (e: any) => {
                console.error("SSE error, closing connection...", e);
                eventSource?.close();
            };
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("SSE Connection Closed");
            }
        };
    }, [authorization, userType, queryClient, showToast]);
};

export default useNotificationSSE;
