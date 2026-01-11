import client from "@api/client";
import type Response from "@type/response";

export const deleteProblemSet = async (programId: number) => {
  const response = await client.delete<Response<null>>(
    `/api/v1/problem-sets/${programId}`,
  );
  return response.data;
};
