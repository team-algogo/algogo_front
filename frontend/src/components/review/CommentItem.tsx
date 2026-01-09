import { type FC, useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import type { SubmissionReviewProps } from "@api/code/reviewSubmit";
import { getUserDetailById, type UserDetailProps } from "@api/auth/auth";
import { formatDistanceToNow } from "date-fns";

export interface CommentItemProps extends SubmissionReviewProps {
  onReply?: (parentId: number, text: string) => void;
  isOwner?: boolean;
  currentUserId?: number;
  onDelete?: (reviewId: number) => void;
  onUpdate?: (reviewId: number, content: string) => void;
  onLike?: (reviewId: number) => void;
  onUnlike?: (reviewId: number) => void;
  depth?: number;
  hasNextSibling?: boolean;
}

const CommentItem: FC<CommentItemProps> = ({
  reviewId,
  userId,
  likeCount,
  isLike,
  codeLine,
  content,
  children,
  onReply,
  currentUserId,
  onDelete,
  onUpdate,
  onLike,
  onUnlike,
  depth = 0,
  hasNextSibling = false,
  modifiedAt,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);

  const isMine = userId === currentUserId;

  const handleIsEditing = () => {
    setIsEditing(false);
  };

  const handleIsReplying = () => {
    setIsReplying(false);
  };

  useEffect(() => {
    setLocalLikeCount(likeCount);
    if (isLike) {
      setIsLiked(isLike);
    }
  }, [likeCount, isLike]);
  const [userDetail, setUserDetail] = useState<UserDetailProps | null>(null);

  const getUserInfoById = async (id: number) => {
    try {
      const response = await getUserDetailById(id);
      setUserDetail(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    getUserInfoById(userId);
  }, [userId]);

  const handleReplySubmit = (text: string) => {
    if (onReply) {
      onReply(reviewId, text);
      setIsReplying(false);
    }
  };

  const handleUpdate = (updatedContent: string) => {
    if (onUpdate) {
      onUpdate(reviewId, updatedContent);
      setIsEditing(false);
    }
  };

  const handleLike = () => {
    if (isLiked) {
      if (onUnlike) onUnlike(reviewId);
      setIsLiked(false);
      setLocalLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      if (onLike) onLike(reviewId);
      setIsLiked(true);
      setLocalLikeCount((prev) => prev + 1);
    }
  };

  // Parse markdown code blocks
  const parseCommentContent = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    const parts: (
      | string
      | { type: "code"; language?: string; code: string }
    )[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = text.slice(lastIndex, match.index);
        if (textPart.trim()) {
          parts.push(textPart);
        }
      }

      // Add code block
      const language = match[1] || "";
      const code = match[2].trim();
      parts.push({ type: "code", language, code });

      lastIndex = codeBlockRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const textPart = text.slice(lastIndex);
      if (textPart.trim()) {
        parts.push(textPart);
      }
    }

    // If no code blocks found, return original text
    if (parts.length === 0) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }

    return (
      <div>
        {parts.map((part, index) => {
          if (typeof part === "string") {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {part}
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="mt-1 mb-0 overflow-hidden rounded-lg border border-gray-200/80 bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-sm"
              >
                {part.language && (
                  <div className="border-b border-gray-200/60 bg-gradient-to-r from-gray-100 to-gray-50/50 px-4 py-2">
                    <span className="text-xs font-bold tracking-wide text-gray-700 uppercase">
                      {part.language}
                    </span>
                  </div>
                )}
                <pre className="overflow-x-auto p-4">
                  <code className="font-mono text-xs leading-relaxed text-gray-900">
                    {part.code}
                  </code>
                </pre>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col">
      {/* Main Comment Row */}
      <div className="group flex w-full gap-3">
        {/* Left Column: Avatar + Timeline Line */}
        <div className="flex w-10 shrink-0 flex-col items-center">
          <div className="z-10 bg-white">
            {userDetail?.profileImage ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white shadow-md ring-2 ring-gray-100">
                <img
                  src={userDetail.profileImage}
                  alt={userDetail.nickname}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                  isMine
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
                }`}
              >
                {userDetail?.nickname?.slice(0, 2) || "U"}
              </div>
            )}
          </div>
          {/* Thread Vertical Line Below Avatar */}
          {/* Show line if: has children OR has next sibling (same level) */}
          {(children.length > 0 || hasNextSibling) && (
            <div className="mt-1.5 w-0.5 flex-1 bg-gray-200" />
          )}
        </div>

        {/* Right Column: Comment Box */}
        <div className="min-w-0 flex-1">
          <div className="relative rounded-md border border-gray-300 bg-white">
            {/* Speech Bubble Arrow (Left) */}
            <div className="absolute top-2.5 -left-2 h-3 w-3 rotate-45 border-b border-l border-gray-300 bg-gray-100" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-2 rounded-t-md border-b border-gray-200 bg-gray-100 px-2.5 py-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {userDetail?.nickname}
                </span>
                <span className="text-grayscale-warm-gray text-xs">
                  {modifiedAt
                    ? formatDistanceToNow(new Date(modifiedAt), {
                        addSuffix: true,
                      })
                    : ""}
                </span>
                {codeLine && (
                  <span className="text-primary-main inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium ring-1 ring-blue-700/10 ring-inset">
                    {codeLine}번 줄
                  </span>
                )}
                {isMine && (
                  <span className="inline-flex items-center rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                    Author
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Right side actions in header if needed, or badges */}
                {isMine && !isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-grayscale-warm-gray hover:text-primary-main"
                      title="Edit"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                        <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(reviewId)}
                      className="hover:text-alert-error text-grayscale-warm-gray"
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="rounded-b-md bg-white px-2.5 py-2">
              {isEditing ? (
                <div>
                  <CommentInput
                    initSelectedLine={() => {}}
                    onReset={handleIsEditing}
                    onSubmit={handleUpdate}
                    selectedLine={codeLine || null}
                    initialContent={content}
                    compact={true}
                  />
                </div>
              ) : (
                <div className="text-sm leading-relaxed text-gray-800">
                  {parseCommentContent(content)}
                </div>
              )}
            </div>

            {/* Footer / Reactions (Optional) for GitHub style, usually bottom left of body or separate row */}
            <div className="flex items-center gap-3 px-2.5 pb-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`group flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all duration-200 ${
                  isLiked
                    ? "bg-gradient-to-br from-red-50 to-pink-50 text-red-600 shadow-sm hover:from-red-100 hover:to-pink-100 hover:shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                  >
                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
                {localLikeCount > 0 && (
                  <span
                    className={`font-semibold ${
                      isLiked ? "text-red-700" : "text-gray-600"
                    }`}
                  >
                    {localLikeCount}
                  </span>
                )}
              </button>

              {/* Reply Button - Only show if depth is less than 1 (max depth 2) */}
              {depth < 1 && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-grayscale-warm-gray flex items-center gap-1 text-xs font-medium hover:text-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.78 1.97a.75.75 0 0 1 0 1.06L3.81 6h6.44A4.75 4.75 0 0 1 15 10.75v2.5a.75.75 0 0 1-1.5 0v-2.5a3.25 3.25 0 0 0-3.25-3.25H3.81l2.97 2.97a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reply
                </button>
              )}
            </div>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="mt-2 ml-1">
              <CommentInput
                initSelectedLine={() => {}}
                onReset={handleIsReplying}
                onSubmit={handleReplySubmit}
                selectedLine={null}
                placeholder="Leave a reply"
                compact={true}
              />
            </div>
          )}

          {/* Recursive Children (Replies) */}
          {children.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {children.map((reply, index) => (
                <CommentItem
                  key={reply.reviewId}
                  {...reply}
                  onReply={onReply}
                  isOwner={isMine}
                  currentUserId={currentUserId}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onLike={onLike}
                  onUnlike={onUnlike}
                  depth={depth + 1}
                  hasNextSibling={index < children.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
