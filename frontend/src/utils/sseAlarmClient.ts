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
  onNotification: (data: SSENotificationData) => void,
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

  console.log("[SSE] Connecting to:", url);
  console.log("[SSE] Environment:", import.meta.env.MODE);
  console.log("[SSE] Token present:", !!token);

  eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
    heartbeatTimeout: 86400000,
  } as any);

  // INIT 이벤트
  eventSource.addEventListener("INIT", () => {
    console.log("[SSE] INIT event received - Connected!");
    onInit();
  });

  // NOTIFICATION 이벤트
  eventSource.addEventListener("NOTIFICATION", (event: any) => {
    console.log("[SSE] NOTIFICATION event received");
    console.log("[SSE] Raw event.data:", event.data);

    try {
      const rawData = event.data;
      const dto = JSON.parse(rawData) as SSENotificationData;
      
      console.log("[SSE] Parsed DTO:", dto);

      // 타입 표준화 (요구사항: alarmTypeName ?? type ?? alarmType?.name)
      const type = dto.alarmTypeName ?? dto.type ?? dto.alarmType?.name ?? (typeof dto.alarmType === 'string' ? dto.alarmType : undefined);
      
      console.log("[SSE] Extracted type:", type);
      console.log("[SSE] Type source - alarmTypeName:", dto.alarmTypeName, "type:", dto.type, "alarmType:", dto.alarmType);
      
      if (!type) {
        console.warn("[SSE] Type field not found in DTO:", dto);
        console.warn("[SSE] Available fields:", Object.keys(dto));
        return;
      }

      // 표준화된 타입으로 변환
      const normalizedData: Alarm = {
        id: dto.id,
        type: type as any,
        payload: dto.payload || {},
        message: dto.message || "",
        isRead: dto.isRead || false,
        createdAt: dto.createdAt || new Date().toISOString(),
      };

      console.log("[SSE] Normalized alarm:", normalizedData);
      onNotification(normalizedData);
    } catch (error) {
      console.error("[SSE] Failed to parse notification data:", error);
      console.error("[SSE] Raw data:", event.data);
    }
  });

  eventSource.onerror = (error: Event) => {
    console.error("[SSE] Error occurred:", error);
    if (onError) {
      onError(error);
    }
  };

  eventSource.onopen = () => {
    console.log("[SSE] Connection opened");
  };

  return eventSource;
};

export const disconnectSSE = () => {
  if (eventSource) {
    console.log("[SSE] Disconnecting...");
    eventSource.close();
    eventSource = null;
  }
};

