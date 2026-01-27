import { EventSourcePolyfill } from "event-source-polyfill";
import type { Alarm } from "@type/notification/notification.d.ts";

export interface SSENotificationData {
  id: number;
  alarmTypeName?: string;
  type?: string;
  alarmType?: { name?: string };
  payload?: any;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
}

let eventSource: EventSourcePolyfill | null = null;

export const connectSSE = (
  token: string,
  onInit: () => void,
  onNotification: (data: Alarm) => void,
  onError?: (error: Event) => void
) => {
  // 기존 연결이 있으면 닫기
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }

  const baseURL = import.meta.env.VITE_API_BASE_URL || "";
  // 개발 환경에서는 프록시 사용, 프로덕션에서는 직접 URL
  const url = import.meta.env.PROD
    ? `${baseURL}/api/v1/alarm/subscribe`
    : `/api/v1/alarm/subscribe`;



  eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    heartbeatTimeout: 86400000,
  } as any);

  // INIT 이벤트
  eventSource.addEventListener("INIT", () => {
    onInit();
  });

  // NOTIFICATION 이벤트
  const handleEvent = (event: any) => {

    try {
      const rawData = event.data;
      let dto: SSENotificationData;

      try {
        dto = JSON.parse(rawData) as SSENotificationData;
      } catch (parseError) {
        console.error("[SSE] JSON parse failed, utilizing raw text as message:", parseError);
        // Fallback for non-JSON messages (unlikely but possible)
        onNotification({
          id: Date.now(),
          type: "INFO" as any,
          payload: {},
          message: rawData,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        return;
      }



      // 타입 표준화 (요구사항: alarmTypeName ?? type ?? alarmType?.name)
      // If type is missing, fallback to 'INFO' instead of returning
      const rawType = dto.alarmTypeName ?? dto.type ?? dto.alarmType?.name ?? (typeof dto.alarmType === 'string' ? dto.alarmType : undefined);
      const type = rawType || "INFO";

      if (!rawType) {
        console.warn("[SSE] Type field not found in DTO, defaulting to INFO:", dto);
      }

      // 표준화된 타입으로 변환
      const normalizedData: Alarm = {
        id: dto.id || Date.now(),
        type: type as any,
        payload: dto.payload || {},
        message: dto.message || "알림이 도착했습니다.",
        isRead: dto.isRead || false,
        createdAt: dto.createdAt || new Date().toISOString(),
      };

      onNotification(normalizedData);
    } catch (error) {
      console.error("[SSE] Critical error in handleEvent:", error);
      // Last resort fallback
      onNotification({
        id: Date.now(),
        type: "INFO" as any,
        payload: {},
        message: "알림 처리 중 오류가 발생했습니다.",
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  eventSource.addEventListener("NOTIFICATION", handleEvent);
  // Default 'message' event fallback
  eventSource.addEventListener("message", handleEvent);

  eventSource.onerror = (error: Event) => {
    // console.error("[SSE] Error occurred:", error); // Reduce noise if needed
    if (onError) {
      onError(error);
    }
  };

  eventSource.onopen = () => {
    // SSE 연결 열림
  };

  return eventSource;
};

export const disconnectSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};

