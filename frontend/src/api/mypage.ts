import getResponse from '@api/getResponse';
import type { ReceivedReviewsResponse } from '@type/mypage/ReceivedReviews';

export const getReceivedReviews = async (page: number, size: number) => {
  const response = await getResponse<ReceivedReviewsResponse>(
    `/code-reviews/received?page=${page}&size=${size}`
  );
  return response.data;
};
