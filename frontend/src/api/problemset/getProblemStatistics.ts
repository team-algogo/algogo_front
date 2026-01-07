import client from "@api/client";
import type { ProblemStatisticsResponse } from "@type/problemset/statistics";

export interface StatisticsParams {
    page?: number;
    size?: number;
    programType?: string;
    sortBy?: string;
    sortDirection?: string;
    keyword?: string;
    language?: string;
    isSuccess?: boolean;
    algorithm?: string;
    platform?: string;
}

export const getProblemStatistics = async (
    programProblemId: number,
    params: StatisticsParams = {}
) => {
    const {
        page = 0,
        size = 20,
        ...rest
    } = params;

    const { data } = await client.get<{ data: ProblemStatisticsResponse }>(
        `/api/v1/submissions/stats/${programProblemId}`,
        {
            params: {
                page,
                size,
                ...rest,
            },
        }
    );
    return data.data;
};
