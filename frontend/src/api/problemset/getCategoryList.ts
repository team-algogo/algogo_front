import type { CategoryListResponse } from "@type/problemset/problemSet.d.ts";
import getResponse from "@api/getResponse";

export const getCategoryList = async () => {
    const url = `/api/v1/problem-sets/categories`;
    const data = await getResponse<CategoryListResponse>(url);
    return data.data.categoryList;
};
