import type { ReceiveCodeReview } from "../../type/mypage/ReceivedReviews";
import { useNavigate } from "react-router-dom";

interface ReceivedReviewsProps {
  reviews: ReceiveCodeReview[];
  totalElements: number;
}

const ReceivedReviews = ({ reviews, totalElements }: ReceivedReviewsProps) => {
  const navigate = useNavigate();
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${days / 7}주 전`;
    if (days < 365) return `${days / 30}개월 전`;
    return `${days / 365}년 전`;
  };

  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case "GROUP":
        return "Group";
      case "CAMPAIGN":
        return "Campaign";
      case "PROBLEMSET":
        return "Problemset";
      default:
        return "Other";
    }
  };

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="flex w-full items-center gap-2  mb-5">
        <span
          className="text-xl leading-[130%] font-bold tracking-[-0.2px] text-[#050505]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          내가 받은 리뷰
        </span>
        <div
          className={`flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${totalElements > 0
            ? "bg-[#FF3B30] text-white"
            : "bg-[#EBEBEB] text-[#727479]"
            }`}
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          {totalElements}
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-3">
        {/* Empty State */}
        {totalElements === 0 ? (
          <div className="flex w-full items-center justify-center py-10">
            <span
              className="text-base leading-[130%] font-medium text-[#9FA3AA]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              아직 받은 리뷰가 없어요
            </span>
          </div>
        ) : (
          reviews.map((review) => {
            const typeColor =
              getProgramTypeLabel(review.programType) === "Group"
                ? { bg: "bg-[#FFF3E0]", text: "text-[#EF6C00]" } // Group: Orange
                : getProgramTypeLabel(review.programType) === "Campaign"
                  ? { bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" } // Campaign: Blue
                  : { bg: "bg-[#F5F5F5]", text: "text-[#757575]" }; // Problemset: Gray

              return (
              <div
                key={review.submissionId}
                onClick={() => navigate(`/review/${review.submissionId}`)}
                className="flex w-full flex-col items-start gap-3 rounded-2xl border border-[#F2F2F2] bg-white p-5 cursor-pointer hover:border-[#0D6EFD] transition-colors"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center rounded-md px-2 py-1 ${typeColor.bg}`}
                  >
                    <span
                      className={`${typeColor.text} text-xs leading-[130%] font-medium`}
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {getProgramTypeLabel(review.programType)}
                    </span>
                  </div>
                  <span
                    className="text-xs leading-[130%] font-normal text-[#727479]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {review.programTitle}
                  </span>
                </div>

                <div className="flex w-full flex-col items-start gap-2">
                  <span
                    className="text-base leading-[130%] font-medium tracking-[-0.16px] text-[#333]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {review.problemTitle}
                  </span>
                  <div className="flex w-full items-start gap-2 rounded-lg bg-[#F8F9FA] p-3">
                    <span
                      className="text-sm leading-[160%] font-normal text-[#333]"
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {review.content}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E0E0E0] text-[8px]">
                    {review.nickname[0]}
                  </div>
                  <span
                    className="text-xs leading-[130%] font-normal text-[#727479]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {review.nickname}
                  </span>
                  <span
                    className="text-xs leading-[130%] font-normal text-[#9FA3AA]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {getTimeAgo(review.modifiedAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReceivedReviews;
