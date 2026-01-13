
import type { RequiredCodeReview } from "../../type/mypage/RequiredReviews";

interface ReviewRequestsProps {
  requests: RequiredCodeReview[];
  totalCount: number;
}

// Helper Component for Timer
const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "";
  const created = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - created.getTime();

  // Convert to units
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (hours < 24) {
    if (hours < 1) return `방금 전`;
    return `${hours}시간 전`;
  }
  if (days < 7) {
    return `${days}일 전`;
  }
  if (weeks < 4) {
    return `${weeks}주 전`;
  }
  if (months < 12) {
    return `${months}달 전`;
  }
  return `${years}년 전`;
};

const TimeDisplay = ({ createAt }: { createAt?: string }) => {
  const relativeTime = getRelativeTime(createAt);

  return (
    <div className="flex items-center gap-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle cx="8" cy="8" r="6" stroke="#ff8e8eff" strokeWidth="1.5" />
        <path
          d="M8 4V8L10.5 10.5"
          stroke="#FF6B6B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-sm leading-[130%] font-normal text-[#FF6B6B]"
        style={{ fontFamily: "IBM Plex Sans KR" }}
      >
        {relativeTime}
      </span>
    </div>
  );
};


const ReviewRequests = ({ requests, totalCount }: ReviewRequestsProps) => {
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
      <div className="flex w-full items-center gap-2">
        <span
          className="text-xl leading-[130%] font-bold tracking-[-0.2px] text-[#050505]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          리뷰요청이 왔어요!
        </span>
        <div className="flex items-center justify-center gap-2.5 rounded-[100px] bg-[#FF3B30] px-2 py-0.5">
          <span
            className="text-xs leading-[130%] font-bold text-white"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {totalCount}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)]">
        {requests.length === 0 ? (
          <div className="flex w-full items-center justify-center py-4">
            <span className="text-[#9FA3AA]">아직 리뷰 요청이 없어요</span>
          </div>
        ) : (
          requests.map((req, idx) => {
            const typeColor =
              getProgramTypeLabel(req.programType) === "Group"
                ? { bg: "bg-[#FFF3E0]", text: "text-[#EF6C00]" } // Group: Orange
                : getProgramTypeLabel(req.programType) === "Campaign"
                  ? { bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" } // Campaign: Blue
                  : { bg: "bg-[#F5F5F5]", text: "text-[#757575]" }; // Problemset: Gray

            return (
              <div key={idx} className="flex w-full flex-col items-start gap-3">
                {/* Header Badges */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center rounded-md px-2 py-1 ${typeColor.bg}`}
                  >
                    <span
                      className={`${typeColor.text} text-xs leading-[130%] font-medium`}
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {getProgramTypeLabel(req.programType)}
                    </span>
                  </div>
                  <span
                    className="text-xs leading-[130%] font-normal text-[#727479]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    {req.programTitle}
                  </span>
                </div>

                {/* Title */}
                <div className="flex w-full flex-col items-start gap-1">
                  <span
                    className="text-base leading-[130%] font-semibold tracking-[-0.16px] text-[#333]"
                    style={{ fontFamily: "IBM Plex Sans KR" }}
                  >
                    [{req.submission?.language ?? "Unknown"}] {req.problemTitle}{" "}
                    리뷰
                  </span>
                  {/* Tags */}
                  <div className="flex items-start gap-1">
                    <span
                      className="text-xs leading-[130%] font-normal text-[#727479]"
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      #{req.problemPlatform}
                    </span>
                    {req.submission?.algorithmList?.map((algo) => (
                      <span
                        key={algo.id}
                        className="text-xs leading-[130%] font-normal text-[#727479]"
                        style={{ fontFamily: "IBM Plex Sans KR" }}
                      >
                        #{algo.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Info Row */}
                <div className="mt-1 flex w-full items-center gap-4 border-t border-[#F2F2F2] pt-3">
                  {/* Review Count */}
                  <div className="flex items-center gap-1">
                    <div
                      className="h-[16px] w-[16px] bg-[#727479]"
                      style={{
                        maskImage: 'url("/icons/reviewComentIcon.svg")',
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                        maskPosition: "center",
                        WebkitMaskImage: 'url("/icons/reviewComentIcon.svg")',
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                      }}
                    />
                    <span
                      className="text-sm leading-[130%] font-normal text-[#727479]"
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {req.submission?.reviewCount ?? 0}
                    </span>
                  </div>

                  {/* View Count */}
                  <div className="flex items-center gap-1">
                    <div
                      className="h-[18px] w-[18px] bg-[#727479]"
                      style={{
                        maskImage: 'url("/icons/viewOkIcon.svg")',
                        maskRepeat: "no-repeat",
                        maskSize: "contain",
                        maskPosition: "center",
                        WebkitMaskImage: 'url("/icons/viewOkIcon.svg")',
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "contain",
                      }}
                    />
                    <span
                      className="text-sm leading-[130%] font-normal text-[#727479]"
                      style={{ fontFamily: "IBM Plex Sans KR" }}
                    >
                      {req.submission?.viewCount ?? 0}
                    </span>
                  </div>

                  {/* Timer */}
                  <TimeDisplay createAt={req.submission?.createAt} />
                </div>
                {idx < requests.length - 1 && (
                  <div className="my-2 h-px w-full bg-[#F2F2F2]"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewRequests;
