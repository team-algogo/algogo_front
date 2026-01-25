
import getResponse from "@api/getResponse";


export interface ProblemSetMeItem {
    programId: number;
    title: string;
    description: string;
    createAt: string;
    modifiedAt: string;
    programType: string;
    categories: string[];
    totalParticipants: number;
    problemCount: number;
    solvedCount: number;
    thumbnail?: string; // Optional as not in JSON, but used in UI
}

export interface ProblemSetMeResponse {
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
    problemSetLists: ProblemSetMeItem[];
}

export const getProblemSetMe = async (page: number = 0, size: number = 6, sortBy: string = 'createdAt', sortDirection: string = 'desc') => {
    const response = await getResponse<ProblemSetMeResponse>(`/api/v1/problem-sets/me?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
    return response;
};
