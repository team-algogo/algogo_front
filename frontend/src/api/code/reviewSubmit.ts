import getResponse from "@api/getResponse";
import type { AlgorithmItemProps } from "./codeSubmit";
import client from "@api/client";

export interface SubmissionDetailProps {
  submissionId: number;
  programProblemId: number;
  userId: number;
  language: string;
  code: string;
  strategy: string;
  execTime: number;
  memory: number;
  isSuccess: boolean;
  createAt: string;
  modifiedAt: string;
  algorithmList: AlgorithmItemProps[];
  aiScore: number;
  aiScoreReason: string;
}

export interface SubmissionHistoryProps {
  submissions: SubmissionDetailProps[];
}

export interface SubmissionReviewProps {
  reviewId: number;
  parentReviewId?: number;
  userId: number;
  submissionId: number;
  likeCount: number;
  codeLine: number;
  content: string;
  createdAt: string;
  modifiedAt: string;
  isLike: boolean;
  children: SubmissionReviewProps[];
}

export const getSubmissionDetail = async (submissionId: string) => {
  const response = await getResponse<SubmissionDetailProps>(
    `/api/v1/submissions/${submissionId}`,
  );
  return response.data;
};

export const getSubmissionHistory = async (submissionId: string) => {
  const response = await getResponse<SubmissionHistoryProps>(
    `/api/v1/submissions/${submissionId}/histories`,
  );
  return response.data;
};

export const getSubmissionReview = async (submissionId: number) => {
  const response = await getResponse<{ reviews: SubmissionReviewProps[] }>(
    `/api/v1/reviews?submission_id=${submissionId}`,
  );
  return response.data.reviews;
};

export const postReview = async (
  submissionId: number,
  content: string,
  parentReviewId: number | null,
  codeLine: number | null,
) => {
  const response = await client.post("/api/v1/reviews", {
    parentReviewId: parentReviewId,
    submissionId: submissionId,
    codeLine: codeLine,
    content: content,
  });

  return response.data;
};

export const updateReview = async (
  reviewId: number,
  content: string,
  codeLine = null,
) => {
  const response = await client.patch<SubmissionReviewProps>(
    `/api/v1/reviews/${reviewId}`,
    {
      codeLine: codeLine,
      content: content,
    },
  );

  return response.data;
};

export const deleteReview = async (reviewId: number) => {
  const response = client.delete(`/api/v1/reviews/${reviewId}`);
  return response;
};

export const postLikeReview = async (reviewId: number) => {
  const response = client.post(`/api/v1/reviews/${reviewId}/likes`);
  return response;
};

export const deleteLikeReview = (reviewId: number) => {
  const response = client.delete(`/api/v1/reviews/${reviewId}/likes`);
  return response;
};
