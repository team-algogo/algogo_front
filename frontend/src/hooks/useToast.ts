import useToastStore, { type ToastType } from "@store/useToastStore";

const useToast = () => {
    const { addToast } = useToastStore();

    const showToast = (message: string, type: ToastType = "success") => {
        // 모든 토스트를 우하단으로 표시 (사용자 요청)
        const position = "bottom-right";

        addToast({
            message,
            type,
            position,
        });
    };

    return { showToast };
};

export default useToast;
