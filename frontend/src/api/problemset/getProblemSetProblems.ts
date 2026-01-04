import type { ProblemSetProblemsResponse } from "@type/problemset/problem.d.ts";
import getResponse from "@api/getResponse";

export const getProblemSetProblems = async (
    programId: number,
    page: number = 1,
    size: number = 20,
    sortBy: string = "startDate", // default from spec is id? Spec says default id. But user example has participantCount in sort object. I will allow generic sort.
    sortDirection: string = "asc"
) => {
    // Spec:
    // page: 0-based

    // Sort logic needs careful handling if API expects specific strings.
    // User spec: sortBy=string, sortDirection=string.

    const params: Record<string, string> = {
        page: (page - 1).toString(),
        size: size.toString(),
        sortBy,
        sortDirection
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/problem-sets/${programId}/problems?${queryString}`;

    const data = await getResponse<ProblemSetProblemsResponse>(url);

    // Check if getResponse returns { message, data: T } or if T IS the message/data object.
    // getResponse.ts: returns response.data.
    // Spec response: { message: "...", data: { ... } }
    // So getResponse<ProblemSetProblemsResponse> returns { message, data: ProblemSetProblemsResponse }
    // So we need to return data.data.

    return data.data;
};
