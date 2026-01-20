import Button from "@components/button/Button";
import PopupModalHeader from "@components/modal/popup/PopupModalHeader";

interface InvitationResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (isAccepted: boolean) => void;
    groupName: string;
}

const InvitationResponseModal = ({
    isOpen,
    onClose,
    onConfirm,
    groupName,
}: InvitationResponseModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-[400px] rounded-xl shadow-2xl p-6 flex flex-col gap-6 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <PopupModalHeader>초대 응답</PopupModalHeader>

                <div className="flex flex-col gap-2 text-center">
                    <p className="font-body text-grayscale-dark-gray whitespace-pre-wrap">
                        <span className="font-bold">{groupName}</span> 그룹의 초대를<br />
                        수락하시겠습니까?
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <Button variant="default" onClick={() => onConfirm(false)} className="!w-full">
                            거절
                        </Button>
                    </div>
                    <div className="flex-1">
                        <Button variant="primary" onClick={() => onConfirm(true)} className="!w-full">
                            수락
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvitationResponseModal;
