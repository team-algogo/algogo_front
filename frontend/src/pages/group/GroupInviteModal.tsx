import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { searchUsersForGroup, inviteUserToGroup } from "../../api/group/groupApi";
import ConfirmModal from "@components/modal/ConfirmModal";
import Toast, { type ToastType } from "@components/toast/Toast";

interface GroupInviteModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupInviteModal({ programId, onClose }: GroupInviteModalProps) {
    const [keyword, setKeyword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    // 유저 검색
    const { data: searchData, isLoading: isSearching } = useQuery({
        queryKey: ["searchUsers", searchQuery],
        queryFn: () => searchUsersForGroup(searchQuery),
        enabled: !!searchQuery,
    });

    const userList = searchData?.data?.users || [];

    // 초대 Mutation
    const inviteMutation = useMutation({
        mutationFn: (userId: number) => inviteUserToGroup(programId, userId),
        onSuccess: () => {
            setToastConfig({ message: "초대 요청을 보냈습니다.", type: "success" });
        },
        onError: (err: any) => {
            console.error(err);
            const msg = err.response?.data?.message || "초대에 실패했습니다.";
            setToastConfig({ message: msg, type: "error" });
        },
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        setSearchQuery(keyword.trim());
    };

    const handleInvite = (userId: number, nickname: string) => {
        setConfirmModal({
            isOpen: true,
            title: "멤버 초대",
            message: `'${nickname}'님을 그룹에 초대하시겠습니까?`,
            onConfirm: () => {
                inviteMutation.mutate(userId);
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            {toastConfig && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig(null)}
                />
            )}
            <div className="bg-white w-[600px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">

                {/* 헤더 */}
                <div className="p-6 border-b border-grayscale-warm-gray flex justify-between items-center bg-gray-50">
                    <h2 className="font-headline text-2xl text-grayscale-dark-gray flex items-center gap-2">
                        멤버 초대
                    </h2>
                    <button onClick={onClose} className="text-grayscale-warm-gray hover:text-grayscale-dark-gray">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* 검색 바 */}
                <div className="p-6 border-b border-grayscale-warm-gray">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 border border-grayscale-warm-gray rounded-lg px-4 py-2 focus:outline-none focus:border-primary-main"
                            placeholder="이메일을 입력해주세요."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-primary-main text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-bold"
                        >
                            검색
                        </button>
                    </form>
                </div>

                {/* 리스트 영역 */}
                <div className="flex-1 overflow-auto p-0 min-h-[300px]">
                    {isSearching ? (
                        <div className="flex justify-center items-center h-full text-grayscale-warm-gray">
                            검색 중...
                        </div>
                    ) : searchQuery && userList.length === 0 ? (
                        <div className="flex justify-center items-center h-full text-grayscale-warm-gray">
                            검색 결과가 없습니다.
                        </div>
                    ) : !searchQuery ? (
                        <div className="flex justify-center items-center h-full text-grayscale-warm-gray">
                            유저를 검색하여 멤버를 초대해보세요.
                        </div>
                    ) : (
                        <div className="divide-y divide-grayscale-warm-gray/30">
                            {userList.map((user: any) => (
                                <div key={user.userId} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.profileImage || "/icons/userIcon.svg"}
                                            onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                            alt="profile"
                                            className={`w-12 h-12 rounded-full object-cover border border-gray-200 ${!user.profileImage || (user.profileImage as string).includes("userIcon") ? "p-2 bg-gray-100 object-contain" : ""}`}
                                        />
                                        <div>
                                            <div className="font-bold text-grayscale-dark-gray text-sm">
                                                {user.nickname}
                                            </div>
                                            <div className="text-xs text-grayscale-warm-gray">
                                                {user.email}
                                            </div>
                                            {user.description && (
                                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                    {user.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleInvite(user.userId, user.nickname)}
                                        className="text-sm bg-gray-100 hover:bg-primary-light hover:text-primary-dark text-gray-600 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                                    >
                                        초대
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
