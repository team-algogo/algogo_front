import client from "@api/client";
import getResponse from "@api/getResponse";
import type { UserProfileResponse, ParticipationItem, ActivityHistoryItem } from "@type/mypage";

// 유저 프로필 조회
export const getUserProfile = async () => {
    const response = await getResponse<UserProfileResponse>("/api/v1/users/profiles");
    return response;
};

// 유저 참여 현황 조회
export const getUserParticipation = async (type: 'PROBLEM_SET' | 'CAMPAIGN' | 'GROUP') => {
    // 실제 엔드포인트는 백엔드 규격에 맞춰 수정 필요
    // 예시: /api/v1/users/participation?type=PROBLEM_SET
    const response = await getResponse<ParticipationItem[]>(`/api/v1/users/participation?type=${type}`);
    return response;
};

// 유저 활동 내역 조회
export const getUserActivityHistory = async () => {
    const response = await getResponse<ActivityHistoryItem[]>("/api/v1/users/history");
    return response;
};
