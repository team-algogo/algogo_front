import { useQuery } from "@tanstack/react-query";
import { getGroupDetail } from "@api/notification/getGroupDetail";
import { getUserDetail } from "@api/user/getUserDetail";
import { formatToDate } from "@utils/date";

export type ModalType = 'INVITE' | 'JOIN_REQUEST';

interface InviteModalProps {
    type: ModalType;
    programId?: number;
    userId?: number;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
}

export default function InviteModal({ type, programId, userId, onClose, onAccept, onReject }: InviteModalProps) {
    // Fetch Group Data (for INVITE)
    const { data: groupData, isLoading: isGroupLoading } = useQuery({
        queryKey: ["groupDetail", programId],
        queryFn: () => getGroupDetail(programId!),
        enabled: type === 'INVITE' && !!programId,
    });

    // Fetch User Data (for JOIN_REQUEST)
    const { data: userData, isLoading: isUserLoading } = useQuery({
        queryKey: ["userDetail", userId],
        queryFn: () => getUserDetail(userId!),
        enabled: type === 'JOIN_REQUEST' && !!userId,
    });

    const isLoading = isGroupLoading || isUserLoading;

    // Handle data normalization
    const group = (groupData as any)?.data || groupData;
    const user = userData?.data;

    if (isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-[400px] p-6 flex flex-col gap-6 relative animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-bold text-gray-900">
                        {type === 'INVITE'
                            ? "아래 그룹에서 회원님을 초대했습니다."
                            : "그룹 참여 신청이 도착했습니다."}
                    </h2>
                </div>

                {/* Content Card */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col gap-4">
                    {type === 'INVITE' ? (
                        <>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-gray-800">{group?.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {group?.description || "멋진 그룹입니다! 함께 공부해요."}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 pt-3 border-t border-gray-200">
                                <div className="flex items-center gap-1">
                                    <span>👥</span>
                                    <span>멤버 {group?.memberCount}/{group?.capacity}명</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span>📅</span>
                                    <span>{group?.createdAt ? formatToDate(group.createdAt) : "-"} 개설</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* User Profile for Join Request */}
                            <div className="flex items-center gap-3">
                                {user?.profileImage ? (
                                    <img src={user.profileImage} alt={user.nickname} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl">
                                        {user?.nickname?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{user?.nickname}</h3>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100 italic">
                                "{user?.description || "안녕하세요! 그룹에 참여하고 싶습니다."}"
                            </p>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onAccept}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 shadow-blue-200 shadow-lg transition-colors"
                    >
                        수락
                    </button>
                    <button
                        onClick={onReject}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        거절
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <img src="/icons/xIcon.svg" alt="close" className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
