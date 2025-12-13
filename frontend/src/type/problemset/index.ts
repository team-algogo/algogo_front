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
}

export interface ProblemSetListResponse {
    problemSetList: ApiProblemSet[];
}
