import type { PageInfo } from "./problemSet.d.ts";

export interface ProblemMetadata {
    id: number;
    platformType: "BOJ" | "PROGRAMMERS" | "SWEA" | string;
    problemNo: string;
    title: string;
    difficultyType: string;
    problemLink: string;
}

export interface Problem {
    programProblemId: number;
    participantCount: number;
    submissionCount: number;
    solvedCount: number;
    viewCount: number;
    startDate: string;
    endDate: string;
    userDifficultyType: string;
    difficultyViewType: string;
    problemResponseDto?: ProblemMetadata;
    problem?: ProblemMetadata;
}

export interface ProblemSetProblemsResponse {
    isLogined: boolean;
    page: PageInfo;
    sort: {
        by: string;
        direction: string;
    };
    problemList: Problem[];
}
