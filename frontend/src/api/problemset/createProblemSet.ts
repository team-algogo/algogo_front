import client from "@api/client";
import type Response from "@type/response";

export interface CreateProblemSetResponse {
  programId: number;
  title: string;
  description: string;
  thumbnail: string;
  createAt: string;
  modifiedAt: string;
  programType: string;
}

export const createProblemSet = async (formData: FormData) => {
  const response = await client.post<Response<CreateProblemSetResponse>>(
    "/api/v1/problem-sets",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

