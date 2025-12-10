export interface GroupItem {
  programId: number;
  title: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
  capacity: number;
  memberCount: number;
  programProblemCount: number;
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface GroupListResponse {
  page: PageInfo;
  sort: {
    by: string;
    direction: string;
  };
  groupLists: GroupItem[];
}
