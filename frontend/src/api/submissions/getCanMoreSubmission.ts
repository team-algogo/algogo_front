import getResponse from "@api/getResponse";

export interface CanMoreSubmissionResponse {
  canMoreSubmission: boolean;
}

export const getCanMoreSubmission = async (programId: number) => {
  const response = await getResponse<CanMoreSubmissionResponse>(
    `/api/v1/submissions/more/${programId}`
  );
  return response.data;
};

