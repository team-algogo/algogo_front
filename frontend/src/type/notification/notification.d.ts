
export type AlarmType =
    | "GROUP_JOIN_APPLY"   // Group join application (to Admin)
    | "GROUP_JOIN_UPDATE"  // Group join status update (to User)
    | "GROUP_INVITE_APPLY" // Group invite (to User)
    | "GROUP_INVITE_UPDATE"// Group invite status update (to Admin)
    | "REQUIRED_REVIEW"    // Code review required (to User)
    | "REVIEW_CREATED"     // New review/comment (to User)
    | "REPLY_REVIEW";      // Reply to a review/comment (to User)

export interface AlarmPayload {
    programId?: number;
    userId?: number;
    userNickname?: string; // Generic nickname field
    programName?: string;

    // Join/Invite specific
    joinId?: number;
    inviteId?: number;

    // Review specific
    submissionId?: number;
    programProblemId?: number;
    reviewId?: number;
    problemTitle?: string;
    targetSubmissionAuthorNickname?: string;

    // Reply specific
    parentReviewId?: number;
    parentUserId?: number;
    parentUserName?: string;

    // Allow other properties
    [key: string]: any;
}

export interface Alarm {
    id: number;
    type: AlarmType;
    payload: AlarmPayload;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationListResponse {
    alarms: Alarm[];
}
