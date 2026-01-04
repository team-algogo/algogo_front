import client from "../client";

interface AlarmCountResponse {
    message: string;
    data: {
        alarmCount: number;
    };
}

export const getAlarmCount = async (): Promise<AlarmCountResponse> => {
    const response = await client.get<AlarmCountResponse>("/api/v1/alarm/counts");
    return response.data;
};
