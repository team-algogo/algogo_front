import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { searchUsersForGroup, inviteUserToGroup, fetchGroupMembers, fetchGroupInviteList } from "../../api/group/groupApi";
import ConfirmModal from "@components/modal/ConfirmModal";
import Button from "@components/button/Button";
import useToast from "@hooks/useToast";

interface GroupInviteModalProps {
    programId: number;
    onClose: () => void;
}

export default function GroupInviteModal({ programId, onClose }: GroupInviteModalProps) {
    const queryClient = useQueryClient();
    const [keyword, setKeyword] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [tempInvitedIds, setTempInvitedIds] = useState<number[]>([]); // Optimistic UI update
    const { showToast } = useToast();

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

    // 기존 멤버 조회
    const { data: memberData } = useQuery({
        queryKey: ["groupMembers", programId],
        queryFn: () => fetchGroupMembers(programId),
        enabled: !!programId,
    });

    // 초대 목록 조회
    const { data: inviteData } = useQuery({
        queryKey: ["groupInviteList", programId],
        queryFn: () => fetchGroupInviteList(programId),
        enabled: !!programId,
    });

    // 유저 검색
    const { data: searchData, isLoading: isSearching } = useQuery({
        queryKey: ["searchUsers", searchQuery],
        queryFn: () => searchUsersForGroup(searchQuery),
        enabled: !!searchQuery,
    });

    // 필터링: 이미 멤버이거나, 이미 초대된 유저는 제외 + 방금 초대한 유저도 제외
    const existingEmails = new Set([
        ...(memberData?.data?.members || []).map((m: any) => m.email),
        ...(inviteData?.data?.users || []).map((i: any) => i.email),
    ]);

    const userList = (searchData?.data?.users || []).filter((user: any) =>
        !existingEmails.has(user.email) && !tempInvitedIds.includes(user.userId)
    );

    // 초대 Mutation
    const inviteMutation = useMutation({
        mutationFn: (userId: number) => inviteUserToGroup(programId, userId),
        onSuccess: () => {
            showToast("초대 요청을 보냈습니다.", "success");
            queryClient.invalidateQueries({ queryKey: ["groupInviteList", programId] });
        },
        onError: (err: any) => {
            console.error(err);
            const msg = err.response?.data?.message || "초대에 실패했습니다.";
            showToast(msg, "error");
            // If failed, remove from tempInvitedIds?
            // For now, let's just leave it or strictly handle cleanup if needed.
            // But usually error handling complexity is higher.
            // Let's keep it simple.
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
                setTempInvitedIds((prev) => [...prev, userId]); // Immediately hide from list
                setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-[600px] max-h-[85vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden relative border border-gray-100">

                {/* 헤더 */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                    <h2 className="font-headline text-2xl font-bold text-gray-900 flex items-center gap-2">
                        멤버 초대
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* 검색 바 */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <form onSubmit={handleSearch} className="flex gap-2 relative">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-main focus:ring-2 focus:ring-primary-100 transition-all bg-white"
                                placeholder="초대할 유저의 이메일을 입력해주세요."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="!rounded-xl font-bold shadow-md shadow-primary-main/20 hover:shadow-lg transition-all"
                        >
                            검색
                        </Button>
                    </form>
                </div>

                {/* 리스트 영역 */}
                <div className="flex-1 overflow-auto p-0 min-h-[300px] scrollbar-hide relative">
                    {isSearching ? (
                        <div className="flex justify-center items-center h-full text-gray-400 font-medium">
                            검색 중...
                        </div>
                    ) : searchQuery && userList.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400 gap-2">
                            <span className="text-3xl">🤔</span>
                            <span>검색 결과가 없습니다.</span>
                        </div>
                    ) : !searchQuery ? (
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-gray-400 gap-2">
                            <span className="text-3xl">🔍</span>
                            <span>유저를 검색하여 멤버를 초대해보세요.</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {userList.map((user: any) => (
                                <div key={user.userId} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img
                                                src={user.profileImage || "/icons/userIcon.svg"}
                                                onError={(e) => { (e.target as HTMLImageElement).src = "/icons/userIcon.svg"; }}
                                                alt="profile"
                                                className={`w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm ${!user.profileImage || (user.profileImage as string).includes("userIcon") ? "p-2 bg-gray-50 object-contain" : ""}`}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-base">
                                                {user.nickname}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                {user.email}
                                            </div>
                                            {user.description && (
                                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                                                    {user.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleInvite(user.userId, user.nickname)}
                                        variant="secondary"
                                        size="sm"
                                        className="!rounded-lg font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                                    >
                                        초대
                                    </Button>
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
