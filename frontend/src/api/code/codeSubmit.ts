import client from "@api/client";
import getResponse from "@api/getResponse";

export interface ProgramProblemProps {
  id: number;
  platformType: string;
  problemNo: string;
  title: string;
  difficultyType: string;
  problemLink: string;
  userDifficultyType: string;
  difficultyViewType: string;
}

export interface AlgorithmItemProps {
  id: number;
  name: string;
}

export interface AlgorithmListProps {
  algorithmList: AlgorithmItemProps[];
}

export const getProblemInfo = async (program_problem_id: string) => {
  const response = await getResponse<ProgramProblemProps>(
    `/api/v1/problems/${program_problem_id}`,
  );
  return response.data;
};

export const getAlgorithm = async (keyword: string) => {
  const response = await getResponse<AlgorithmListProps>(
    `/api/v1/algorithms/search?keyword=${encodeURIComponent(keyword)}`,
  );
  return response.data;
};

export const postCodeSubmit = async (
  programProblemId: number,
  language: string,
  code: string,
  strategy: string,
  execTime: number,
  memory: number,
  isSuccess: boolean,
  algorithmList: number[],
) => {
  const response = await client.post("/api/v1/submissions", {
    programProblemId: programProblemId,
    language: language,
    code: code,
    strategy: strategy,
    execTime: execTime,
    memory: memory,
    isSuccess: isSuccess,
    algorithmList: algorithmList,
  });

  return response;
};
