import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@api/user/userApi";
import { getReceivedReviews, getWrittenReviews } from "@api/mypage";

type ViewMode = "참여 현황" | "활동 내역" | "작성 리뷰";

interface UserProfileCardProps {
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const UserProfileCard = ({ setViewMode }: UserProfileCardProps) => {
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await getUserProfile();
      // getResponse returns the full body: { message: string, data: UserProfileResponse }
      // We need to return the 'data' property which holds the actual user profile
      return response.data;
    },
  });

  // Fetch stats separately
  const { data: receivedReviewsData } = useQuery({
    queryKey: ["receivedReviewsStats"],
    queryFn: () => getReceivedReviews(0, 1),
  });

  const { data: writtenReviewsData } = useQuery({
    queryKey: ["writtenReviewsStats"],
    queryFn: () => getWrittenReviews(0, 1),
  });

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full animate-pulse rounded-lg bg-gray-100"></div>
    );
  }

  const stats = {
    submittedCodes: 0,
    writtenReviews: writtenReviewsData?.pageInfo.totalElements || 0,
    receivedReviews: receivedReviewsData?.pageInfo.totalElements || 0,
  };

  return (
    <div className="flex flex-col items-center gap-4 self-stretch overflow-hidden rounded-lg border border-[#F4F6FA] pt-6">
      {/* Avatar */}
      <div className="relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#30AEDC]">
        {userProfile?.profileImage ? (
          <img
            src={userProfile?.profileImage}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="text-center text-sm leading-[150%] font-normal text-white select-none"
            style={{ fontFamily: "Roboto" }}
          >
            {userProfile?.nickname.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center gap-1 self-stretch px-4">
        <div className="flex items-center justify-center self-stretch">
          <h2
            className="line-clamp-1 flex-1 overflow-hidden text-center text-2xl leading-[130%] font-medium tracking-[0.24px] text-ellipsis text-[#050505]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {userProfile?.nickname}
          </h2>
        </div>
        <div className="flex items-center justify-center self-stretch">
          <p
            className="line-clamp-1 flex-1 overflow-hidden text-center text-xs leading-[130%] font-normal tracking-[-0.12px] text-ellipsis text-[#333]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {userProfile?.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between self-stretch border-t border-[#F4F6FA] px-4 pt-4 pb-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center rounded-[100px] bg-[#ECEEF2] px-2.5 py-1">
            <span
              className="text-sm leading-none font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.submittedCodes}
            </span>
          </div>
          <span
            className="text-center text-sm leading-[130%] font-medium text-[#777A80]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            제출 코드
          </span>
        </div>
        <div
          className="flex cursor-pointer flex-col items-center gap-2 transition-opacity hover:opacity-70"
          onClick={() => setViewMode("작성 리뷰")}
        >
          <div className="flex items-center justify-center rounded-[100px] bg-[#ECEEF2] px-2.5 py-1">
            <span
              className="text-sm leading-none font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.writtenReviews}
            </span>
          </div>
          <span
            className="text-center text-sm leading-[130%] font-medium text-[#777A80]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            작성 리뷰
          </span>
        </div>
        <div
          className="flex cursor-pointer flex-col items-center gap-2 transition-opacity hover:opacity-70"
          onClick={() => setViewMode("활동 내역")}
        >
          <div className="flex items-center justify-center rounded-[100px] bg-[#ECEEF2] px-2.5 py-1">
            <span
              className="text-sm leading-none font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.receivedReviews}
            </span>
          </div>
          <span
            className="text-center text-sm leading-[130%] font-medium text-[#777A80]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            받은 리뷰
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
