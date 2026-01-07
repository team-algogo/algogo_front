export interface WrittenCodeReview {
  submissionId: number;
  problemTitle: string;
  programType: "PROBLEMSET" | "GROUP" | "CAMPAIGN";
  programTitle: string;
  nickname: string;
  content: string;
  modifiedAt: string;
}

export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface WrittenReviewsResponse {
  pageInfo: PageInfo;
  receiveCodeReviews: WrittenCodeReview[]; // Note: API returns 'receiveCodeReviews' even for written reviews based on user request example
}
