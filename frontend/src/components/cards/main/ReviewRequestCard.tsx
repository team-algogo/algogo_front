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
  subjectSubmissionCreatedAt,
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
      ? { bg: "bg-orange-50 text-orange-600", border: "border-orange-100" }
      : getProgramTypeLabel(programType) === "캠페인"
        ? { bg: "bg-primary-50 text-primary-600", border: "border-primary-100" }
        : { bg: "bg-gray-50 text-gray-500", border: "border-gray-100" };

  const timeAgo = formatTimeAgo(subjectSubmissionCreatedAt);

  return (
    <Link
      to={`review/${submission.targetSubmissionId}`}
      className="group relative flex h-full min-h-[180px] w-full transform flex-col justify-between overflow-hidden rounded-2xl bg-white border-2 border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary-100 p-5"
    >
      {/* Top Banner / Badge */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg ${typeColor.bg} border ${typeColor.border}`}>
          <span className="text-xs font-semibold">{getProgramTypeLabel(programType)}</span>
        </div>
        <span className="text-xs text-gray-400 font-medium truncate max-w-[120px]">
          {programTitle}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          [{submission?.language ?? "Unknown"}] {problemTitle} 리뷰
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {problemPlatform && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              #{problemPlatform}
            </span>
          )}
          {submission?.algorithmList?.slice(0, 3).map((algo) => (
            <span
              key={algo.id}
              className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
            >
              #{algo.name}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary-500 transition-colors">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span className="text-xs font-medium">{submission?.reviewCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary-500 transition-colors">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="text-xs font-medium">{submission?.viewCount ?? 0}</span>
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium group-hover:text-gray-600 transition-colors">
          {timeAgo}
        </span>
      </div>
    </Link>
  );
};

export default ReviewRequestCard;
