import getResponse from "@api/getResponse";
import type { GroupDetailResponse } from "@type/notification/groupDetail.d.ts";

export const getGroupDetail = async (programId: number) => {
    return await getResponse<GroupDetailResponse>(`/api/v1/groups/${programId}`);
};
