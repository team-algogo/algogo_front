// import { useEffect, useState } from "react";
import type { RequiredCodeReview } from "@api/review/manageReview";
import { Link } from "react-router-dom";

// Helper to format relative time
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

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
        return "스터디";
      case "CAMPAIGN":
        return "캠페인";
      case "PROBLEMSET":
        return "문제집";
      case "PERSONAL":
        return "개인";
      default:
        return "기타";
    }
  };

  const typeColor =
    getProgramTypeLabel(programType) === "스터디"
      ? { bg: "bg-[#FFF3E0]", text: "text-[#EF6C00]" } // Group: Orange
      : getProgramTypeLabel(programType) === "캠페인"
        ? { bg: "bg-[#E3F2FD]", text: "text-[#1976D2]" } // Campaign: Blue
        : { bg: "bg-[#F5F5F5]", text: "text-[#757575]" }; // Problemset/Personal: Gray

  const timeAgo = formatTimeAgo(submission?.createAt);

  return (
    <Link
      to={`review/${submission.targetSubmissionId}`}
      className="flex w-full flex-col items-start gap-3 rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08)] h-full"
    >
      {/* Header Badges */}
      <div className="flex items-center gap-2 w-full">
        <div
          className={`flex items-center justify-center rounded-md px-2 py-1 ${typeColor.bg} flex-shrink-0`}
        >
          <span
            className={`${typeColor.text} text-xs leading-[130%] font-medium`}
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {getProgramTypeLabel(programType)}
          </span>
        </div>
        <span
          className="text-xs leading-[130%] font-normal text-[#727479] truncate"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          {programTitle}
        </span>
      </div>

      {/* Title */}
      <div className="flex w-full flex-col items-start gap-1">
        <span
          className="text-base leading-[130%] font-semibold tracking-[-0.16px] text-[#333] line-clamp-1 w-full"
          style={{ fontFamily: "IBM Plex Sans KR" }}
          title={`[${submission?.language ?? "Unknown"}] ${problemTitle} 리뷰`}
        >
          [{submission?.language ?? "Unknown"}] {problemTitle} 리뷰
        </span>
        {/* Tags */}
        <div className="flex flex-wrap items-start gap-1 w-full h-[36px] overflow-hidden">
          {problemPlatform && (
            <span
              className="text-xs leading-[130%] font-normal text-[#727479]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              #{problemPlatform}
            </span>
          )}
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
      <div className="mt-auto flex w-full items-center justify-between border-t border-[#F2F2F2] pt-3">
        <div className="flex items-center gap-4">
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
        </div>


        {/* Time Ago */}
        <span
          className="text-xs font-normal text-[#727479]"
          style={{ fontFamily: "IBM Plex Sans KR" }}
        >
          {timeAgo}
        </span>
      </div>
    </Link>
  );
};

export default ReviewRequestCard;
