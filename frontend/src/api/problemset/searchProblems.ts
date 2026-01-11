import getResponse from "@api/getResponse";

export interface SearchProblem {
  id: number;
  platformType: string;
  problemNo: string;
  title: string;
  difficultyType: string;
  problemLink: string;
}

export interface SearchProblemsResponse {
  problems: SearchProblem[];
}

export const searchProblems = async (keyword: string) => {
  const response = await getResponse<SearchProblemsResponse>(
    `/api/v1/problems/search?keyword=${encodeURIComponent(keyword)}`,
  );
  return response.data;
};
