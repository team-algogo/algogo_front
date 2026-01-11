import Button from "../button/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = "확인",
    cancelLabel = "취소",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white w-[400px] rounded-xl shadow-2xl p-6 flex flex-col gap-6 animate-fadeIn">
                <div className="flex flex-col gap-2 text-center">
                    <h3 className="font-headline text-xl text-grayscale-dark-gray">
                        {title}
                    </h3>
                    <p className="font-body text-grayscale-dark-gray whitespace-pre-wrap">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <Button variant="default" onClick={onCancel} className="!w-full">
                            {cancelLabel}
                        </Button>
                    </div>
                    <div className="flex-1">
                        <Button variant="primary" onClick={onConfirm} className="!w-full">
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
