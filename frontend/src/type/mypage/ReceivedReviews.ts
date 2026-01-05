export interface ReceiveCodeReview {
    submissionId: number;
    problemTitle: string;
    programType: 'PROBLEMSET' | 'GROUP' | 'CAMPAIGN';
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

export interface ReceivedReviewsResponse {
    pageInfo: PageInfo;
    receiveCodeReviews: ReceiveCodeReview[];
}
