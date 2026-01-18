import { useNavigate } from "react-router-dom";

interface ProblemSetCardProps {
  programId: number;
  title: string;
  description: string;
  thumbnail: string;
  categories: string[];
  totalParticipants: number;
  problemCount?: number;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  onEdit?: (programId: number) => void;
  onDelete?: (programId: number) => void;
}

export default function ProblemSetCard({
  programId,
  title,
  description,
  thumbnail,
  categories,
  totalParticipants,
  problemCount = 0,
  isAdmin = false,
  isLoggedIn = false,
  onEdit,
  onDelete,
}: ProblemSetCardProps) {
  const navigate = useNavigate();
  const displayCategory =
    categories && categories.length > 0 ? categories[0] : "";

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(programId);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(programId);
    }
  };

  return (
    <div
      onClick={() => isLoggedIn ? navigate(`/problemset/${programId}`) : window.location.href = "https://algogo.kr/intro"}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300 hover:shadow-md"
    >
      {/* Thumbnail Section */}
      <div
        className="relative h-[180px] w-full overflow-hidden bg-gray-100"
        style={{
          backgroundImage: thumbnail
            ? `url(${thumbnail})`
            : `linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay for better text readability */}
        {thumbnail && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        )}
        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          {displayCategory && (
            <div
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${displayCategory.includes("알고리즘")
                  ? "bg-teal-50 text-teal-700"
                  : "bg-blue-50 text-blue-700"
                }`}
            >
              {displayCategory}
            </div>
          )}
        </div>
        {/* ADMIN 버튼 - Top Right */}
        {isAdmin && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-gray-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0D6EFD]"
              title="수정"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.16667 2.33333L11.6667 5.83333M9.91667 1.16667L10.85 0.233333C11.05 0.0333333 11.3167 0 11.5833 0C11.85 0 12.1167 0.0333333 12.3167 0.233333L13.7667 1.68333C13.9667 1.88333 14 2.15 14 2.41667C14 2.68333 13.9667 2.95 13.7667 3.15L12.8333 4.08333M9.91667 1.16667L2.33333 8.75V11.6667H5.25L12.8333 4.08333M9.91667 1.16667L12.8333 4.08333"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-gray-700 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600"
              title="삭제"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.33333 3.5H11.6667M5.83333 6.41667V10.5M8.16667 6.41667V10.5M9.33333 3.5V12.25C9.33333 12.7083 8.95833 13.0833 8.5 13.0833H5.5C5.04167 13.0833 4.66667 12.7083 4.66667 12.25V3.5M6.125 3.5V2.33333C6.125 1.875 6.5 1.5 6.95833 1.5H7.04167C7.5 1.5 7.875 1.875 7.875 2.33333V3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Title and Description */}
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-lg leading-[1.4] font-bold text-gray-900">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4.5H14M4 2V7M12 2V7M3.5 14H12.5C13.0523 14 13.5 13.5523 13.5 13V8.5C13.5 7.94772 13.0523 7.5 12.5 7.5H3.5C2.94772 7.5 2.5 7.94772 2.5 8.5V13C2.5 13.5523 2.94772 14 3.5 14Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium tabular-nums">
              {problemCount || 0}개
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2.5 14C2.5 11.5147 4.51472 9.5 7 9.5H9C11.4853 9.5 13.5 11.5147 13.5 14"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-medium tabular-nums">
              {totalParticipants.toLocaleString()}명
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
