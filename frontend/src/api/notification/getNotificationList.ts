import getResponse from "@api/getResponse";
import type { NotificationListResponse } from "@type/notification/notification.d.ts";

export const getNotificationList = async () => {
    return await getResponse<NotificationListResponse>(`/api/v1/alarm/lists`);
};
