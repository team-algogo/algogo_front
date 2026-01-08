import getResponse from "@api/getResponse";
import type { ProblemSetSearchResults } from "@type/problemset/problemSet";

export const getProblemSetSearchByProblems = async (keyword: string, page: number = 0, size: number = 10) => {
    if (!keyword) return { page: { number: 0, size, totalElements: 0, totalPages: 0 }, problemSetList: [] };

    const url = `/api/v1/problem-sets/search/by-problems?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    const data = await getResponse<ProblemSetSearchResults>(url);

    return data.data;
};
