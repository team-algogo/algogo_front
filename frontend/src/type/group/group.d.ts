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

export interface ProblemResponseDto {
  id: number;
  platformType: string;
  problemNo: string;
  title: string;
  difficultyType: string;
  problemLink: string;
}

export interface GroupProblemItem {
  programProblemId: number;
  participantCount: number;
  submissionCount: number;
  solvedCount: number;
  viewCount: number;
  startDate: string;
  endDate: string;
  userDifficultyType: string;
  difficultyViewType: string;
  problemResponseDto: ProblemResponseDto;
}

export interface GroupProblemListResponse {
  page: PageInfo;
  sort: {
    by: string;
    direction: string;
  };
  problemList: GroupProblemItem[];
}

export interface ProblemItem {
  problemId: number;
  startDate: string;
  endDate: string;
  userDifficultyType: "EASY" | "MEDIUM" | "HARD";
  difficultyViewType: "USER_DIFFICULTY" | "PROBLEM_DIFFICULTY";
}

export interface GroupProblemAddRequest {
  problems: ProblemItem[];
}
