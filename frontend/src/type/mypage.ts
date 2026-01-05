export interface UserStats {
    submittedCodes: number;
    writtenReviews: number;
    receivedReviews: number;
}

export interface UserProfileResponse {
    userId: number;
    email: string;
    description: string;
    nickname: string;
    profileImage: string | null;
    createdAt: string;
    modifiedAt: string;
}

export interface ParticipationItem {
    id: number;
    title: string;
    category: '기업대비' | '알고리즘';
    progress: number;
    problemCount: number;
    memberCount: number;
    thumbnailUrl: string;
    isCompleted: boolean;
}

export interface ActivityHistoryItem {
    id: number;
    type: string;
    content: string;
    createdAt: string;
}
