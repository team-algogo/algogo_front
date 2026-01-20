export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiProblemSet {
  programId: number;
  title: string;
  description: string;
  thumbnail: string;
  createAt: string;
  modifiedAt: string;
  programType: string;
  categories: string[];
  totalParticipants: number;
  problemCount: number;
  matchedProblems?: string[];
}

export interface ProblemSetListResponse {
  page: PageInfo;
  problemSetList: ApiProblemSet[];
}

export interface ProblemSetDetailResponse {
  programId: number;
  title: string;
  description: string;
  thumbnail: string;
  createAt: string;
  modifiedAt: string;
  programType: string;
  categories: string[];
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryListResponse {
  categoryList: Category[];
}

export interface ProblemSetSearchResults {
  page: PageInfo;
  problemSetList: ApiProblemSet[];
}

export interface ProblemSetSearchResponse {
  message: string;
  data: ProblemSetSearchResults;
}
