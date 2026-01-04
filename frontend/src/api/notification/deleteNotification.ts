import client from "@api/client";

export const deleteNotification = async (alarmIds: number[]) => {
    const response = await client.delete("/api/v1/alarm", {
        data: { alarmIds },
    });
    return response.data;
};
