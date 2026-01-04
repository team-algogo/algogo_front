
export interface GroupDetailResponse {
    programId: number;
    title: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
    capacity: number;
    memberCount: number;
    programProblemCount: number;
    isMember: boolean;
    groupRole?: "ADMIN" | "USER";
}
