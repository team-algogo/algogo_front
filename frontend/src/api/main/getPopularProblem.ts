import getResponse from "@api/getResponse";

type ListType = "hot" | "recent" | "join-in";

interface PopularSubmissionListResponse {
  submissionIdList: number[];
}

interface PopularProblemListResponse {
  programProblemIdList: number[];
}

export const getPopularSubmissionList = async (type: ListType = "hot") => {
  const response = await getResponse<
    PopularSubmissionListResponse | PopularProblemListResponse
  >(`/api/v1/submissions/trends?type=${type}`);
  return response.data;
};
