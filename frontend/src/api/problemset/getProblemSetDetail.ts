import type { ProblemSetDetailResponse } from "@type/problemset/problemSet.d.ts";
import getResponse from "@api/getResponse";

export const getProblemSetDetail = async (programId: number) => {
    const url = `/api/v1/problem-sets/${programId}`;
    const data = await getResponse<ProblemSetDetailResponse>(url);
    return data.data; // Response<T> returns { message, data }, getResponse returns response.data which is { message, data }. We need data.data
};
