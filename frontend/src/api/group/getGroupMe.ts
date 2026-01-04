import getResponse from "@api/getResponse";

export interface GroupMeItem {
    programId: number;
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    capacity: number;
    memberCount: number;
    programProblemCount: number;
    role: string;
}

export interface GroupMeResponse {
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    sort: {
        by: string;
        direction: string;
    };
    groupLists: GroupMeItem[];
}

export const getGroupMe = async (page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDirection: string = 'desc') => {
    const response = await getResponse<GroupMeResponse>(`/api/v1/groups/lists/me?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
    return response;
};
