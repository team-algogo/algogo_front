import client from "@api/client";
import type Response from "@type/response";

export interface RemoveProblemsRequest {
  programProblemIds: number[];
}

export interface RemoveProblemsResponse {
  // 응답 타입은 API 응답에 따라 조정 필요
  [key: string]: any;
}

export const removeProblems = async (
  programId: number,
  programProblemIds: number[],
) => {
  const body: RemoveProblemsRequest = {
    programProblemIds,
  };
  const response = await client.delete<Response<RemoveProblemsResponse>>(
    `/api/v1/problem-sets/${programId}/problems`,
    {
      data: body,
    },
  );
  return response.data;
};
