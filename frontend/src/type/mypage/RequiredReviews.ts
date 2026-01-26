export interface Algorithm {
    id: number;
    name: string;
}

export interface Submission {
    targetSubmissionId: number;
    language: string;
    createAt: string;
    viewCount: number;
    algorithmList: Algorithm[];
    reviewCount: number;
    nickname: string;
}

export interface RequiredCodeReview {
    problemTitle: string;
    problemPlatform: string;
    programType: 'GROUP' | 'CAMPAIGN' | 'PROBLEMSET' | 'OTHER';
    programTitle: string;
    submission: Submission;
    subjectSubmissionCreatedAt: string;
}

export interface RequiredReviewsResponse {
    requiredCodeReviews: RequiredCodeReview[];
}
