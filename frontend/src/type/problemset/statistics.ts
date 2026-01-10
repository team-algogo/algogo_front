export interface UserSimpleResponseDto {
  userId: number;
  profileImage: string | null;
  nickname: string;
}

export interface Algorithm {
  id: number;
  name: string;
}

export interface SubmissionResponseDto {
  submissionId: number;
  programProblemId: number;
  userId: number;
  language: string;
  code: string;
  strategy: string;
  execTime: number;
  memory: number;
  isSuccess: boolean;
  viewCount: number;
  createAt: string;
  modifiedAt: string;
  algorithmList: Algorithm[];
  aiScore: number | null;
  aiScoreReason: string | null;
}

export interface SubmissionItem {
  userSimpleResponseDto: UserSimpleResponseDto;
  submissionResponseDto: SubmissionResponseDto;
  reviewCount: number;
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SortInfo {
  by: string;
  direction: string;
}

export interface ProblemStatisticsResponse {
  page: PageInfo;
  sort: SortInfo;
  submissions: SubmissionItem[];
}

export interface SubmissionStats {
  submissionCount: number;
  successCount: number;
  failureCount: number;
  successRate: number;
}
