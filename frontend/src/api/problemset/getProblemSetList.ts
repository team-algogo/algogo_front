import type { ProblemSetListResponse } from "@type/problemset/ProblemSetType";
import getResponse from "@api/getResponse";

export const getProblemSetList = async (
    category: string = "전체",
    sortBy: string = "createdAt",
    sortDirection: string = "desc",
    keyword: string = "",
    page: number = 1,
    size: number = 10
) => {
    const params: Record<string, string> = {
        sortBy,
        sortDirection,
        page: (page - 1).toString(),
        size: size.toString(),
    };

    if (category !== "전체") {
        if (category === "기업대비") params.category = "enterprise";
        else if (category === "알고리즘") params.category = "algorithm";
        else params.category = category;
    }

    if (keyword) {
        params.keyword = keyword;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `/api/v1/problem-sets/lists${queryString ? `?${queryString}` : ""}`;

    const data = await getResponse<ProblemSetListResponse>(url);

    return data.data;
};
