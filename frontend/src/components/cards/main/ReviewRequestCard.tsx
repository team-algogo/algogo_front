import type { RequiredCodeReview } from "@api/review/manageReview";
import { Link } from "react-router-dom";

// Helper Component for Timer
import TimeDisplay from "../../common/TimeDisplay";

const ReviewRequestCard = ({
  problemTitle,
  problemPlatform,
  programType,
  programTitle,
  submission,
}: RequiredCodeReview) => {
  const getProgramTypeLabel = (type: string) => {
    switch (type) {
      case "GROUP":
        return "Group";
      case "CAMPAIGN":
        return "Campaign";
      case "PROBLEMSET":
        return "Problemset";
      case "PERSONAL":
        return "Personal";
      default:
        return "Other";
    }
  };

  const typeColor =
    getProgramTypeLabel(programType) === "Group"
      ? { bg: "bg-[#FFF3E0]", text: "text-[#EF6C00]" } // Group: Orange
      : getProgramTypeLabel(programType) === "Campaign"
        ? { bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" } // Campaign: Blue
        : { bg: "bg-[#F5F5F5]", text: "text-[#757575]" }; // Problemset/Personal: Gray

  return (
    <Link
      to={`review/${submission.targetSubmissionId}`}
      className="flex w-full flex-col items-start gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)]"
    >
      {/* Header Badges */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center rounded-md px-2 py-1 ${typeColor.bg}`}
        >
          <span
            className={`${typeColor.text} text-xs leading-[130%] font-medium`}
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {getProgramTypeLabel(programType)}
          </span>
        </div>
        <span
          className="text-xs leading-[130%] font-normal text-[#727479]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          {programTitle}
        </span>
      </div>

      {/* Title */}
      <div className="flex w-full flex-col items-start gap-1">
        <span
          className="text-base leading-[130%] font-semibold tracking-[-0.16px] text-[#333]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          [{submission?.language ?? "Unknown"}] {problemTitle} 리뷰
        </span>
        {/* Tags */}
        <div className="flex items-start gap-1">
          <span
            className="text-xs leading-[130%] font-normal text-[#727479]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            #{problemPlatform}
          </span>
          {submission?.algorithmList?.map((algo) => (
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
            {submission?.reviewCount ?? 0}
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
            {submission?.viewCount ?? 0}
          </span>
        </div>

        {/* Timer */}
        <TimeDisplay createAt={submission?.createAt} />
      </div>
    </Link>
  );
};

export default ReviewRequestCard;
