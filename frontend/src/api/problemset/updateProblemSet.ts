import client from "@api/client";
import type Response from "@type/response";

export interface UpdateProblemSetResponse {
  programId: number;
  title: string;
  description: string;
  thumbnail: string;
  createAt: string;
  modifiedAt: string;
  programType: string;
  categories: string[];
  totalParticipants: number;
  problemCount: number;
}

export const updateProblemSet = async (
  programId: number,
  formData: FormData,
) => {
  const response = await client.put<Response<UpdateProblemSetResponse>>(
    `/api/v1/problem-sets/${programId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
