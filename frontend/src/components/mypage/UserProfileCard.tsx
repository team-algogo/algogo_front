import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@api/user/userApi";

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

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full animate-pulse rounded-lg bg-gray-100"></div>
    );
  }

  // Map API response to UI needed structure
  // API: nickname, description, profileImage
  // UI: name, statusMessage, avatarInitial
  const name = userProfile?.nickname || "Guest";
  const statusMessage = userProfile?.description || "상태 메시지가 없습니다.";
  const profileImage = userProfile?.profileImage;
  const avatarInitial = name.charAt(0).toUpperCase();

  // Stats are not yet provided by API, defaulting to 0
  const stats = {
    submittedCodes: 0,
    writtenReviews: 0,
    receivedReviews: 0,
  };

  return (
    <div className="flex flex-col items-start gap-4 self-stretch overflow-hidden rounded-lg border border-[#F4F6FA]">
      {/* Avatar */}
      <div className="relative flex h-[120px] w-[120px] items-center justify-center overflow-hidden rounded-full bg-[#30AEDC]">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className="text-center text-sm leading-[150%] font-normal text-white select-none"
            style={{ fontFamily: "Roboto" }}
          >
            {avatarInitial}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="flex flex-col items-start gap-1 self-stretch px-4">
        <div className="flex items-center justify-between self-stretch">
          <h2
            className="line-clamp-1 flex-1 overflow-hidden text-2xl leading-[130%] font-medium tracking-[0.24px] text-ellipsis text-[#050505]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {name}
          </h2>
        </div>
        <div className="flex items-center justify-between self-stretch">
          <p
            className="line-clamp-1 flex-1 overflow-hidden text-xs leading-[130%] font-normal tracking-[-0.12px] text-ellipsis text-[#333]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            {statusMessage}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between self-stretch border-t border-[#F4F6FA] px-4 pt-4 pb-4">
        <div className="flex w-[46px] flex-col items-start gap-[3px]">
          <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#ECEEF2] px-1 py-0">
            <span
              className="text-xs leading-4 font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.submittedCodes}
            </span>
          </div>
          <span
            className="self-stretch text-xs leading-[130%] font-medium tracking-[-0.12px] text-[#777A80]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            제출 코드
          </span>
        </div>
        <div
          className="flex w-[46px] cursor-pointer flex-col items-start gap-[3px] transition-opacity hover:opacity-70"
          onClick={() => setViewMode("작성 리뷰")}
        >
          <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#ECEEF2] px-1 py-0">
            <span
              className="text-xs leading-4 font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.writtenReviews}
            </span>
          </div>
          <span
            className="self-stretch text-xs leading-[130%] font-medium tracking-[-0.12px] text-[#777A80]"
            style={{ fontFamily: "IBM Plex Sans KR" }}
          >
            작성 리뷰
          </span>
        </div>
        <div
          className="flex w-[46px] cursor-pointer flex-col items-start gap-[3px] transition-opacity hover:opacity-70"
          onClick={() => setViewMode("활동 내역")}
        >
          <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#ECEEF2] px-1 py-0">
            <span
              className="text-xs leading-4 font-bold text-[#777A80]"
              style={{ fontFamily: "IBM Plex Sans KR" }}
            >
              {stats.receivedReviews}
            </span>
          </div>
          <span
            className="self-stretch text-xs leading-[130%] font-medium tracking-[-0.12px] text-[#777A80]"
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
