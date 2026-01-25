import useToastStore, { type ToastType } from "@store/useToastStore";

const useToast = () => {
    const { addToast } = useToastStore();

    const showToast = (message: string, type: ToastType = "success") => {
        // SSE 알림 패턴 감지 (우하단으로 표시)
        const sseNotificationPatterns = [
            "님이 그룹에 참여 신청을 보냈습니다",
            "님이 초대를 수락했습니다",
            "님이 초대를 거절했습니다",
            "님이 그룹에 가입했습니다",
            "님이 그룹을 탈퇴했습니다",
            "새로운 알림이 있습니다",
        ];

        // SSE 알림 패턴이 포함되어 있으면 우하단, 아니면 상단 가운데
        const position = sseNotificationPatterns.some((pattern) => message.includes(pattern))
            ? "bottom-right"
            : "top-center";

        addToast({
            message,
            type,
            position,
        });
    };

    return { showToast };
};

export default useToast;
