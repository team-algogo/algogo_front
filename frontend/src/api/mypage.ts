import getResponse from "@api/getResponse";
import type { ReceivedReviewsResponse } from "@type/mypage/ReceivedReviews";
import type { RequiredReviewsResponse } from "@type/mypage/RequiredReviews";
import type { WrittenReviewsResponse } from "@type/mypage/WrittenReviews";

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
