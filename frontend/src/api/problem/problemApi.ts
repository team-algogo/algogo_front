import client from "../client";
import type Response from "../../type/response";

export interface ProblemSearchResult {
    id: number;
    platformType: string;
    problemNo: string;
    title: string;
    difficultyType: string;
    problemLink: string;
}

interface SearchResponse {
    problems: ProblemSearchResult[];
}

export const searchProblems = async (keyword: string) => {
    const response = await client.get<Response<SearchResponse>>(
        "/api/v1/problems/search",
        {
            params: { keyword },
        }
    );
    return response.data;
};

export const increaseViewCount = async (programProblemId: number) => {
    await client.patch(`/api/v1/problems/${programProblemId}`);
};
