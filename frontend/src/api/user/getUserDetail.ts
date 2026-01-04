
import client from "@api/client";

export interface UserInfo {
    userId: number;
    email: string;
    description: string;
    nickname: string;
    profileImage: string | null;
    createdAt: string;
    modifiedAt: string;
}

export interface GetUserDetailResponse {
    message: string;
    data: UserInfo;
}

export const getUserDetail = async (userId: number): Promise<GetUserDetailResponse> => {
    const response = await client.get<GetUserDetailResponse>(`/api/v1/users/profiles/${userId}`);
    return response.data;
};
