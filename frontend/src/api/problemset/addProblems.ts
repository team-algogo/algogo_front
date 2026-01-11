import client from "@api/client";
import type Response from "@type/response";

export interface AddProblemsRequest {
  problems: Array<{
    problemId: number;
  }>;
}

export interface AddProblemsResponse {
  // 응답 타입은 API 응답에 따라 조정 필요
  [key: string]: any;
}

export const addProblems = async (programId: number, problemIds: number[]) => {
  const body: AddProblemsRequest = {
    problems: problemIds.map((problemId) => ({
      problemId,
    })),
  };
  const response = await client.post<Response<AddProblemsResponse>>(
    `/api/v1/problem-sets/${programId}/problems`,
    body,
  );
  return response.data;
};
