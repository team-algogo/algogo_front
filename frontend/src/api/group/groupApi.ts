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

// 중복 체크 
export interface CheckGroupResponse {
  isAvailable: boolean;
}

export interface MyGroupListResponse {
  groupLists: {
    programId: number;
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    capacity: number;
    memberCount: number;
    programProblemCount: number;
    role: "ADMIN" | "USER"; // 역할 필드 중요
  }[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface GroupProblemParams {
  programId: number;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: string;
}

export const joinGroup = async (programId: number) => {
  const response = await client.post<Response<null>>(
    `/api/v1/groups/${programId}/join`
  );
  return response.data;
};

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

export const checkGroupNameDuplicate = async (groupTitle: string) => {
  const response = await client.post<Response<CheckGroupResponse>>(
    "/api/v1/groups/check/groupnames",
    {
      groupTitle, 
    }
  );
  return response.data; 
};

// 메인 그룹 페이지 (로그인시) 좌측에 뿌려주는 내가 참여한 그룹방 리스트 
export const fetchMyGroupList = async () => {
  // 정렬 조건 등은 고정해서 요청
  const response = await client.get<Response<MyGroupListResponse>>(
    "/api/v1/groups/lists/me",
    {
      params: {
        sortBy: "createdAt",
        sortDirection: "desc", // 보통 최신순
        page: 0,
        size: 100, // 스크롤 방식이므로 넉넉하게 한 번에 가져오기
      },
    }
  );
  return response.data;
};

// GET /api/v1/groups/{programId}
export const fetchGroupDetail = async (programId: number) => {
  const response = await client.get<Response<any>>(
    `/api/v1/groups/${programId}`
  );
  return response.data;
};

export const fetchGroupProblemList = async (params: GroupProblemParams) => {
  const { programId, page, size, sortBy, sortDirection } = params;
  const response = await client.get<Response<any>>(
    `/api/v1/groups/${programId}/problems/lists`,
    {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
      },
    }
  );
  return response.data;
};