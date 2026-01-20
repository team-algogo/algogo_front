import getResponse from "@api/getResponse";
import client from "@api/client";
import type Response from "@type/response";

import type { ReceivedReviewsResponse } from "@type/mypage/ReceivedReviews";
import type { RequiredReviewsResponse } from "@type/mypage/RequiredReviews";
import type { WrittenReviewsResponse } from "@type/mypage/WrittenReviews";

import type { InvitesResponseData, JoinsResponseData } from "@type/mypage/InvitationStatus";

export const getReceivedReviews = async (page: number, size: number) => {
  const response = await getResponse<ReceivedReviewsResponse>(
    `/api/v1/reviews/lists/receive?page=${page}&size=${size}`,
  );
  return response.data;
};

export const getRequiredReviews = async () => {
  const response = await getResponse<RequiredReviewsResponse>(
    "/api/v1/reviews/lists/require",
  );
  return response.data;
};

export const getWrittenReviews = async (page: number, size: number) => {
  const response = await getResponse<WrittenReviewsResponse>(
    `/api/v1/reviews/lists/done?page=${page}&size=${size}`,
  );
  return response.data;
};

export const getReceivedInvites = async () => {
  const response = await getResponse<InvitesResponseData>(
    "/api/v1/groups/invites/received",
  );
  return response.data;
};

export const getSentJoins = async () => {
  const response = await getResponse<JoinsResponseData>(
    "/api/v1/groups/joins/sent",
  );
  return response.data;
};

export const respondToReceivedInvite = async (
  programId: number,
  inviteId: number,
  isAccepted: "ACCEPTED" | "DENIED",
) => {
  const response = await client.put<Response<null>>(
    `/api/v1/groups/${programId}/invite/${inviteId}`,
    { isAccepted },
  );
  return response.data;
};

export const cancelSentJoin = async (programId: number, joinId: number) => {
  const response = await client.delete<Response<null>>(
    `/api/v1/groups/${programId}/join/${joinId}`,
  );
  return response.data;
};
