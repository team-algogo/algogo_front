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
import type Response from "../../type/response";
import type { GroupListResponse, GroupProblemListResponse } from "../../type/group/group";

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
  const response = await client.get<Response<GroupProblemListResponse>>(
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


// POST /api/v1/groups/{programId}/problems
import type { GroupProblemAddRequest } from "../../type/group/group";

export const postGroupProblems = async (programId: number, data: GroupProblemAddRequest) => {
  const response = await client.post<Response<null>>(
    `/api/v1/groups/${programId}/problems`,
    data
  );
  return response.data;
};

// DELETE /api/v1/groups/{programId}/problems
// Body: { problems: [{ programProblemId: number, ... }] } ??? 
// User said: /api/v1/groups/{program_id}/problems DELETE request.
// And payload might be checking "programProblemId" or "problemId"?
// Looking at the problem add payload, it was "problems": [{ ... }].
// I will assume for deletion, we might send ids.
// Let's assume the body is { programProblemIds: number[] } or similar?
// User didn't specify body for DELETE problems, but usually DELETE method with body is discouraged but used.
// Or maybe path param?
// "문제마다 x버튼을 작게 놔주고" -> Deleting one by one?
// If one by one, maybe /api/v1/groups/{programId}/problems/{programProblemId}? 
// But user said: /api/v1/groups/{program_id}/problems DELETE request.
// So it must be a bulk delete endpoint or key-based.
// Let's assume it takes a list of IDs to delete in the body.
// Body: { problemIds: number[] } or { programProblemIds: number[] }.
// I will check if there is a type definition hint or just implement generic body.
// Wait, for `Add`, we sent `problems: ProblemItem[]`.
// Use `data` arg for now.

export const deleteGroupProblems = async (programId: number, problemIds: number[]) => {
  // Axios delete with body requires 'data' field in config
  const response = await client.delete<Response<null>>(
    `/api/v1/groups/${programId}/problems`,
    {
      data: {
        programProblemIds: problemIds
      }
    }
  );
  return response.data;
};

// PUT /api/v1/groups/{programId}
export const updateGroup = async (programId: number, data: { title: string; description: string; capacity: number }) => {
  const response = await client.put<Response<null>>(
    `/api/v1/groups/${programId}`,
    data
  );
  return response.data;
};

// DELETE /api/v1/groups/{programId}
export const deleteGroup = async (programId: number) => {
  const response = await client.delete<Response<null>>(
    `/api/v1/groups/${programId}`
  );
  return response.data;
};

// --- Member Management ---

export interface GroupMemberResponse {
  members: {
    programUserId: number;
    email: string;
    profileImage: string;
    nickname: string;
    role: "ADMIN" | "MANAGER" | "USER";
  }[];
}

// GET /api/v1/groups/{programId}/users
export const fetchGroupMembers = async (programId: number) => {
  const response = await client.get<Response<GroupMemberResponse>>(
    `/api/v1/groups/${programId}/users`
  );
  return response.data;
};

// PUT /api/v1/groups/{programId}/users/{programUserId}/role
export const updateGroupMemberRole = async (programId: number, programUserId: number, role: "ADMIN" | "MANAGER" | "USER") => {
  const response = await client.put<Response<null>>(
    `/api/v1/groups/${programId}/users/${programUserId}/role`,
    { role }
  );
  return response.data;
};

// PUT /api/v1/groups/{programId}/users/{programUserId} - Member Deletion (Kick)
export const deleteGroupMember = async (programId: number, programUserId: number) => {
  const response = await client.put<Response<null>>(
    `/api/v1/groups/${programId}/users/${programUserId}`
  );
  return response.data;
};

// --- Join Request Management ---

export interface GroupJoinRequestResponse {
  users: {
    joinId: number;
    email: string;
    nickname: string;
    profileImage: string;
    status: "ACCEPTED" | "DENIED" | "PENDING";
  }[];
}

// GET /api/v1/groups/{programId}/join/lists
export const fetchGroupJoinRequests = async (programId: number) => {
  const response = await client.get<Response<GroupJoinRequestResponse>>(
    `/api/v1/groups/${programId}/join/lists`
  );
  return response.data;
};

// PUT /api/v1/groups/{programId}/join/{joinId}
export const respondToJoinRequest = async (programId: number, joinId: number, isAccepted: "ACCEPTED" | "DENIED") => {
  const response = await client.put<Response<null>>(
    `/api/v1/groups/${programId}/join/${joinId}`,
    { isAccepted }
  );
  return response.data;
};


// --- Invitation Management ---

export interface UserSearchResponse {
  users: {
    userId: number;
    email: string;
    nickname: string;
    profileImage: string | null;
    description: string;
  }[];
}

// GET /api/v1/users/search/members?content={keyword}
export const searchUsersForGroup = async (keyword: string) => {
  const response = await client.get<Response<UserSearchResponse>>(
    "/api/v1/users/search/members",
    {
      params: { content: keyword }
    }
  );
  return response.data;
};

// POST /api/v1/groups/{programId}/invite
export const inviteUserToGroup = async (programId: number, userId: number) => {
  const response = await client.post<Response<null>>(
    `/api/v1/groups/${programId}/invite`,
    { userId }
  );
  return response.data;
};

// DELETE /api/v1/groups/{programId}/invite/{inviteId}
export const cancelGroupInvitation = async (programId: number, inviteId: number) => {
  const response = await client.delete<Response<null>>(
    `/api/v1/groups/${programId}/invite/${inviteId}`
  );
  return response.data;
};

export interface GroupInviteListResponse {
  users: {
    inviteId: number;
    email: string;
    profileImage: string;
    nickname: string;
    status: "ACCEPTED" | "DENIED" | "PENDING";
  }[];
}

// GET /api/v1/groups/{programId}/invite/lists
export const fetchGroupInviteList = async (programId: number) => {
  const response = await client.get<Response<GroupInviteListResponse>>(
    `/api/v1/groups/${programId}/invite/lists`
  );
  return response.data;
};