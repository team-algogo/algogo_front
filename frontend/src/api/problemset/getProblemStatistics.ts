import client from "@api/client";
import type {
  ProblemStatisticsResponse,
  SubmissionStats,
} from "@type/problemset/statistics";

export interface StatisticsParams {
  page?: number;
  size?: number;
  programType?: string;
  sortBy?: string;
  sortDirection?: string;
  keyword?: string;
  nickname?: string;
  language?: string;
  isSuccess?: boolean;
  algorithm?: string;
  platform?: string;
}

export const getProblemStatistics = async (
  programProblemId: number,
  params: StatisticsParams = {},
) => {
  const { page = 0, size = 20, ...rest } = params;

  const { data } = await client.get<{ data: ProblemStatisticsResponse }>(
    `/api/v1/submissions/stats/${programProblemId}/lists`,
    {
      params: {
        page,
        size,
        ...rest,
      },
    },
  );
  return data.data;
};

export const getProblemSubmissionStats = async (programProblemId: number) => {
  const { data } = await client.get<{ data: SubmissionStats }>(
    `/api/v1/submissions/stats/${programProblemId}`,
  );
  return data.data;
};
