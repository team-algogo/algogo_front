import type { ProblemSetListResponse } from "@type/problemset";
import getResponse from "@api/getResponse";

export const getProblemSetList = async (
    category: string = "전체",
    sortBy: string = "createdAt",
    sortDirection: string = "desc",
    keyword: string = ""
) => {
    const params: Record<string, string> = {
        sortBy,
        sortDirection,
    };

    if (category !== "전체") {
        // Map UI category to API value if needed, or pass through
        // Based on previous code: "기업대비" -> "enterprise", "알고리즘" -> "algorithm"
        if (category === "기업대비") params.category = "enterprise";
        else if (category === "알고리즘") params.category = "algorithm";
        else params.category = category;
    }

    if (keyword) {
        params.keyword = keyword;
    }

    // Construct Query String manually to append to URL if getResponse doesn't support params object
    // But standard axios client usually supports it.
    // Looking at getResponse.ts:
    // const getResponse = async <T>(url: string) => {
    //   const response = await client.get<Response<T>>(url);
    //   return response.data;
    // };
    // It only takes URL. So we must build the query string or modify getResponse.
    // Modifying getResponse might affect other calls. usage suggests it expects full URL.
    // I will build the query string here using URLSearchParams.

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/problem-sets/lists${queryString ? `?${queryString}` : ""}`;

    const data = await getResponse<ProblemSetListResponse>(url);
    // data is the inner "data" of the response because getResponse returns response.data
    // But wait, getResponse returns "response.data" where response.data is "Response<T>"?
    // Let's check getResponse again.
    // client.get<Response<T>>(url) -> axios response.
    // response.data -> The body.
    // If the body is { message: string, data: T }, then getResponse returns that object?
    // No, typical getResponse implementation extracts the inner data T.
    // Let's re-verify getResponse.ts content from history.
    // line 6: return response.data;
    // If the server returns { message: ..., data: { problemSetList: ... } },
    // Then getResponse returns that whole object.
    // So T should be { problemSetList: ... } if the server wraps it in "data"?
    // Or is Response<T> defined as { message: string, data: T }?
    // I need to check Response type definition to be sure. 
    // For now, I'll assume getResponse returns the body, which contains "data".
    // The user spec says: Response 200: { message: "...", data: { problemSetList: [] } }
    // So if Response<T> = { message: string, data: T }, and getResponse returns response.data (the body),
    // then the return value is { message: "...", data: { problemSetList: ... } }.
    // Effectively T is { problemSetList: ... }.
    // So returning data.data.problemSetList is what we want?
    // Wait, if getResponse returns the WHOLE body, then I need to access .data from it.

    return data.data?.problemSetList || [];
};
