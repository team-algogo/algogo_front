import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@api/user/userApi';


const UserProfileCard = () => {
    const { data: userProfile, isLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await getUserProfile();
            // getResponse returns the full body: { message: string, data: UserProfileResponse }
            // We need to return the 'data' property which holds the actual user profile
            return response.data;
        },
    });

    if (isLoading) {
        return <div className="animate-pulse flex h-[200px] w-full bg-gray-100 rounded-lg"></div>;
    }

    // Map API response to UI needed structure
    // API: nickname, description, profileImage
    // UI: name, statusMessage, avatarInitial
    const name = userProfile?.nickname || 'Guest';
    const statusMessage = userProfile?.description || '상태 메시지가 없습니다.';
    const profileImage = userProfile?.profileImage;
    const avatarInitial = name.charAt(0).toUpperCase();

    // Stats are not yet provided by API, defaulting to 0
    const stats = {
        submittedCodes: 0,
        writtenReviews: 0,
        receivedReviews: 0
    };

    return (
        <div className="flex flex-col gap-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 items-center text-center">
            {/* Avatar */}
            <div className="size-24 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-sm">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-primary-600 text-3xl font-display">
                        {avatarInitial}
                    </span>
                )}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                    {name}
                </h2>
                <p className="text-sm text-gray-500 truncate px-2">
                    {statusMessage}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 w-full pt-4 border-t border-gray-100">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-gray-900">{stats.submittedCodes}</span>
                    <span className="text-xs text-gray-500">제출 코드</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-gray-100">
                    <span className="text-lg font-bold text-gray-900">{stats.writtenReviews}</span>
                    <span className="text-xs text-gray-500">작성 리뷰</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold text-gray-900">{stats.receivedReviews}</span>
                    <span className="text-xs text-gray-500">받은 리뷰</span>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
