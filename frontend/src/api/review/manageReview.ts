import getResponse from "@api/getResponse";

export interface PageInfoProps {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ReceiveReviewProps {
  submissionId: number;
  problemTitle: string;
  programType: "group" | null;
  programTitle: string;
  nickname: string;
  content: string;
  modifiedAt: string;
}

export interface ReceiveReviewList {
  pageInfo: PageInfoProps;
  receiveCodeReviews: ReceiveReviewProps[];
}

// 알고리즘 타입
export interface Algorithm {
  id: number;
  name: string;
}

// 제출 정보
export interface Submission {
  targetSubmissionId: number;
  language: "JAVA" | "CPP" | "PYTHON" | string;
  createAt: string;
  viewCount: number;
  algorithmList: Algorithm[];
  reviewCount: number;
  nickname: string;
}

// 코드 리뷰 대상
export interface RequiredCodeReview {
  problemTitle: string;
  problemPlatform: "BOJ" | "PROGRAMMERS" | string; // enum화 가능
  programType: "GROUP" | "PERSONAL" | string;
  programTitle: string;
  submission: Submission;
}

export interface RequiredCodeReviewList {
  requiredCodeReviews: RequiredCodeReview[];
}

// 내가 받은 리뷰 관리
export const getRecieveReview = async (size?: number, page?: number) => {
  const response = await getResponse<ReceiveReviewList>(
    `/api/v1/reviews/lists/receive?size=${size}&page=${page}`,
  );
  return response;
};

// 내가 할 리뷰 관리
export const getRequireReview = async () => {
  const response = await getResponse<RequiredCodeReviewList>(
    `/api/v1/reviews/lists/require`,
  );
  return response;
};
