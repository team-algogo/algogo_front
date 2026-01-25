
import client from "../client";

export interface MySubmissionResponse {
    message: string;
    data: {
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
        submissions: MySubmissionItem[];
    };
}

export interface MySubmissionItem {
    submissionResponseDto: {
        submissionId: number;
        programProblemId: number;
        userId: number;
        language: string;
        code: string;
        strategy: string;
        execTime: number;
        memory: number;
        isSuccess: boolean;
        viewCount: number;
        createAt: string;
        modifiedAt: string;
        algorithmList: {
            id: number;
            name: string;
        }[];
        aiScore: number | null;
        aiScoreReason: string | null;
    };
    reviewCount: number;
    problemResponseDto: {
        id: number;
        platformType: string;
        problemNo: string;
        title: string;
        difficultyType: string;
        problemLink: string;
    };
    programResponseDto: {
        id: number;
        title: string;
        thumbnail: string | null;
        programType: {
            id: number;
            name: string;
        };
    };
}

export interface GetMySubmissionsParams {
    page?: number;
    size?: number;
    sort?: string;
    direction?: string;
    language?: string;
    isSuccess?: boolean;
}

export const getMySubmissions = async (
    params: GetMySubmissionsParams = {},
): Promise<MySubmissionResponse> => {
    const { page = 0, size = 20, sort, direction, language, isSuccess } = params;

    // Construct query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    if (sort) queryParams.append('sortBy', sort);
    if (direction) queryParams.append('sortDirection', direction);
    if (language) queryParams.append('language', language);
    if (isSuccess !== undefined) queryParams.append('isSuccess', isSuccess.toString());

    const response = await client.get(`/api/v1/submissions/me?${queryParams.toString()}`);
    return response.data;
};
