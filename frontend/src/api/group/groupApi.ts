// src/api/groupApi.ts
import client from "../client";

export interface GroupListParams {
  page?: number;          // 페이지 번호 (default: 0)
  size?: number;          // 페이지 당 개수 (default: 10)
  sortBy?: string;        // 정렬 기준 (createdAt, title 등)
  sortDirection?: string; // 정렬 방향 (asc, desc)
  keyword?: string;       // 검색어
}

// create시 사용하는 body type
export interface CreateGroupRequest {
  title: string;
  description: string;
  capacity: number;
}

// 정렬 옵션 타입 정의
import type  Response  from "../../type/response";
import type  { GroupListResponse }  from "../../type/group/group";

export const fetchGroupList = async (params: GroupListParams) => {
  const response = await client.get<Response<GroupListResponse>>(
    "/api/v1/groups/lists",
    {
      params: {
        page: params.page,
        size: params.size,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        keyword: params.keyword, // 기존 search -> keyword로 변경
      },
    }
  );
  return response.data;
};

export const createGroup = async (data: CreateGroupRequest) => {
  const response = await client.post<Response<null>>(
    "/api/v1/groups", 
    data
  );
  return response.data;
};