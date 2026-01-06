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
        <div className="flex flex-col items-start gap-4 self-stretch rounded-lg border border-[#F4F6FA] overflow-hidden">
            {/* Avatar */}
            <div className="flex w-[120px] h-[120px] justify-center items-center bg-[#30AEDC] rounded-full overflow-hidden relative">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white text-center text-sm font-normal leading-[150%] select-none" style={{ fontFamily: 'Roboto' }}>
                        {avatarInitial}
                    </span>
                )}
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start gap-1 self-stretch px-4">
                <div className="flex justify-between items-center self-stretch">
                    <h2
                        className="flex-1 overflow-hidden text-[#050505] text-ellipsis text-2xl font-medium leading-[130%] tracking-[0.24px] line-clamp-1"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        {name}
                    </h2>
                </div>
                <div className="flex justify-between items-center self-stretch">
                    <p
                        className="flex-1 overflow-hidden text-[#333] text-ellipsis text-xs font-normal leading-[130%] tracking-[-0.12px] line-clamp-1"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        {statusMessage}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center self-stretch border-t border-[#F4F6FA] pt-4 px-4 pb-4">
                <div className="flex w-[46px] flex-col items-start gap-[3px]">
                    <div className="inline-flex px-1 py-0 justify-center items-center gap-1 rounded-lg bg-[#ECEEF2]">
                        <span className="text-[#777A80] text-xs font-bold leading-4" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                            {stats.submittedCodes}
                        </span>
                    </div>
                    <span
                        className="self-stretch text-[#777A80] text-xs font-medium leading-[130%] tracking-[-0.12px]"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        제출 코드
                    </span>
                </div>
                <div className="flex w-[46px] flex-col items-start gap-[3px]">
                    <div className="inline-flex px-1 py-0 justify-center items-center gap-1 rounded-lg bg-[#ECEEF2]">
                        <span className="text-[#777A80] text-xs font-bold leading-4" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                            {stats.writtenReviews}
                        </span>
                    </div>
                    <span
                        className="self-stretch text-[#777A80] text-xs font-medium leading-[130%] tracking-[-0.12px]"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        작성 리뷰
                    </span>
                </div>
                <div className="flex w-[46px] flex-col items-start gap-[3px]">
                    <div className="inline-flex px-1 py-0 justify-center items-center gap-1 rounded-lg bg-[#ECEEF2]">
                        <span className="text-[#777A80] text-xs font-bold leading-4" style={{ fontFamily: 'IBM Plex Sans KR' }}>
                            {stats.receivedReviews}
                        </span>
                    </div>
                    <span
                        className="self-stretch text-[#777A80] text-xs font-medium leading-[130%] tracking-[-0.12px]"
                        style={{ fontFamily: 'IBM Plex Sans KR' }}
                    >
                        받은 리뷰
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
