
import getResponse from "@api/getResponse";

export interface ProblemSetMeItem {
    programId: number;
    title: string;
    description: string;
    thumbnail: string;
    createdAt: string;
    modifiedAt: string;
}

export interface ProblemSetMeResponse {
    programList: ProblemSetMeItem[];
}

export const getProblemSetMe = async (sortBy: string = 'createdAt', sortDirection: string = 'desc') => {
    const response = await getResponse<ProblemSetMeResponse>(`/api/v1/problem-sets/me?sortBy=${sortBy}&sortDirection=${sortDirection}`);
    return response;
};
