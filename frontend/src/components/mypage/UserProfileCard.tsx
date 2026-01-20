import type { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@api/user/userApi";
import { getReceivedReviews, getWrittenReviews, getRequiredReviews } from "@api/mypage";

type ViewMode = "참여 현황" | "리뷰 요청" | "받은 리뷰" | "작성 리뷰" | "초대/신청 현황";

interface UserProfileCardProps {
    setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const UserProfileCard = ({ setViewMode }: UserProfileCardProps) => {
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const response = await getUserProfile();
            return response.data;
        },
    });

    const { data: receivedReviewsData } = useQuery({
        queryKey: ["receivedReviewsStats"],
        queryFn: () => getReceivedReviews(0, 1),
    });

    const { data: writtenReviewsData } = useQuery({
        queryKey: ["writtenReviewsStats"],
        queryFn: () => getWrittenReviews(0, 1),
    });

    const { data: requiredReviewsData } = useQuery({
        queryKey: ["requiredReviewsStats"],
        queryFn: getRequiredReviews,
    });

    // Calculate stats safely
    const stats = {
        reviewRequests: requiredReviewsData?.requiredCodeReviews?.length || 0,
        writtenReviews: writtenReviewsData?.pageInfo?.totalElements || 0,
        receivedReviews: receivedReviewsData?.pageInfo?.totalElements || 0,
    };

    // Use userProfile description if available, else a default message
    const description = userProfile?.description || "한 줄 소개가 없습니다.";


    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 items-center text-center animate-pulse">
                <div className="size-24 rounded-full bg-gray-200"></div>
                <div className="flex flex-col gap-2 w-full items-center">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-gray-100">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 items-center text-center">
            {/* Avatar */}
            <div className="size-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-sm">
                {userProfile?.profileImage ? (
                    <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-primary-600 text-3xl font-display">
                        {userProfile?.nickname?.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                    {userProfile?.nickname}
                </h2>
                <p className="text-sm text-gray-500 truncate px-2">
                    {description}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-gray-100">
                <div
                    className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => setViewMode("리뷰 요청")}
                >
                    <span className="text-lg font-bold text-gray-900">{stats.reviewRequests}</span>
                    <span className="text-xs text-gray-500">리뷰 요청</span>
                </div>
                <div
                    className="flex flex-col items-center gap-1 border-x border-gray-100 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => setViewMode("받은 리뷰")}
                >
                    <span className="text-lg font-bold text-gray-900">{stats.receivedReviews}</span>
                    <span className="text-xs text-gray-500">받은 리뷰</span>
                </div>
                <div
                    className="flex flex-col items-center gap-1 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => setViewMode("작성 리뷰")}
                >
                    <span className="text-lg font-bold text-gray-900">{stats.writtenReviews}</span>
                    <span className="text-xs text-gray-500">작성 리뷰</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
