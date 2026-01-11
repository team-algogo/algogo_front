import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@components/button/Button";
import Toast, { type ToastType } from "@components/toast/Toast";
import { updateGroup, checkGroupNameDuplicate } from "../../api/group/groupApi";

interface EditGroupModalProps {
    programId: number;
    initialData: {
        title: string;
        description: string;
        capacity: number;
    };
    onClose: () => void;
}

const EditGroupModal = ({ programId, initialData, onClose }: EditGroupModalProps) => {
    const [title, setTitle] = useState(initialData.title);
    const [description, setDescription] = useState(initialData.description);
    const [maxCount, setMaxCount] = useState<number | string>(initialData.capacity);

    // 이름이 변경되었을 때만 중복 체크 필요
    // 초기값과 같으면 중복 체크 패스 (= 유효하다고 간주)
    const isTitleChanged = title !== initialData.title;
    const [isTitleChecked, setIsTitleChecked] = useState(!isTitleChanged);

    const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

    const queryClient = useQueryClient();

    // --- API Mutation ---
    // (1) 중복 확인
    const checkDuplicateMutation = useMutation({
        mutationFn: checkGroupNameDuplicate,
        onSuccess: (response) => {
            const isAvailable = response.data?.isAvailable;
            const message = response.message;

            if (isAvailable) {
                setIsTitleChecked(true);
                setToastConfig({ message: message || "사용 가능한 그룹 이름입니다.", type: "success" });
            } else {
                setIsTitleChecked(false);
                setToastConfig({ message: message || "이미 존재하는 그룹 이름입니다.", type: "error" });
            }
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "중복 확인 중 오류가 발생했습니다.";
            setToastConfig({ message: errorMsg, type: "error" });
            setIsTitleChecked(false);
        }
    });

    // (2) 그룹 수정
    const updateMutation = useMutation({
        mutationFn: (data: { title: string; description: string; capacity: number }) => updateGroup(programId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groupDetail", programId] }); // 상세 정보 새로고침
            queryClient.invalidateQueries({ queryKey: ["groups"] }); // 리스트도 갱신
            setToastConfig({ message: "그룹 정보가 수정되었습니다.", type: "success" });
            setTimeout(() => onClose(), 500);
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.message || "그룹 수정에 실패했습니다.";
            setToastConfig({ message: errorMsg, type: "error" });
        },
    });

    // --- Handlers ---
    const handleCheckDuplicate = () => {
        if (!title.trim()) {
            setToastConfig({ message: "그룹 이름을 입력해주세요", type: "error" });
            return;
        }
        // 원래 이름과 같으면 중복 체크 불필요 (하지만 사용자가 눌렀다면 굳이 막을 필요는 없으나, API가 본인 이름도 중복으로 칠 수 있음 -> 서버 로직에 따라 다름)
        // 보통 본인 이름은 제외하고 체크해주거나, 클라이언트에서 "변경사항 없음" 처리.
        // 여기서는 변경된 경우에만 체크하도록 로직을 짰으므로, 변경 안된 상태에서 누르면 "현재 이름입니다" 라고 띄워주는게 나을 수도.
        if (!isTitleChanged) {
            setToastConfig({ message: "현재 사용 중인 그룹 이름입니다.", type: "success" });
            setIsTitleChecked(true);
            return;
        }
        checkDuplicateMutation.mutate(title);
    };

    const handleUpdate = () => {
        // 1. 이름 변경되었는데 중복체크 안했으면 차단
        if (isTitleChanged && !isTitleChecked) {
            setToastConfig({ message: "그룹 이름 중복 확인을 해주세요", type: "error" });
            return;
        }
        // 2. 필수 값 체크
        if (!title.trim()) {
            setToastConfig({ message: "그룹 이름을 입력해주세요", type: "error" });
            return;
        }
        if (maxCount === "") {
            setToastConfig({ message: "정원수를 입력해주세요", type: "error" });
            return;
        }

        updateMutation.mutate({
            title,
            description,
            capacity: Number(maxCount),
        });
    };

    return (
        <>
            {toastConfig && (
                <Toast
                    message={toastConfig.message}
                    type={toastConfig.type}
                    onClose={() => setToastConfig(null)}
                />
            )}

            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white w-[600px] rounded-2xl p-8 flex flex-col gap-8 shadow-xl relative">

                    <h2 className="font-headline text-2xl text-center text-grayscale-dark-gray">
                        Group 수정
                    </h2>

                    <div className="flex flex-col gap-6">

                        {/* Group 명 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-grayscale-dark-gray">
                                Group 명 <span className="text-alert-error text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Group 명을 입력해 주세요"
                                    className="flex-1 bg-grayscale-default rounded-lg px-4 py-3 outline-none placeholder:text-grayscale-warm-gray"
                                    maxLength={10}
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        if (e.target.value !== initialData.title) {
                                            setIsTitleChecked(false);
                                        } else {
                                            setIsTitleChecked(true); // 원래대로 돌아오면 true로
                                        }
                                    }}
                                />
                                <div className="w-[100px]">
                                    <button
                                        onClick={handleCheckDuplicate}
                                        disabled={checkDuplicateMutation.isPending || (title === initialData.title)}
                                        className="w-full h-full bg-white border border-grayscale-warm-gray rounded-lg text-sm text-grayscale-dark-gray hover:bg-grayscale-default transition-colors disabled:opacity-50"
                                    >
                                        중복 확인
                                    </button>
                                </div>
                            </div>
                            <div className="text-right text-xs text-grayscale-warm-gray">
                                {title.length} / 10자
                            </div>
                        </div>

                        {/* 최대 정원수 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-grayscale-dark-gray">
                                최대 정원수 <span className="text-alert-error text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="최대 인원을 입력해 주세요"
                                className="w-full bg-grayscale-default rounded-lg px-4 py-3 outline-none placeholder:text-grayscale-warm-gray"
                                value={maxCount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") setMaxCount("");
                                    else setMaxCount(Number(val));
                                }}
                            />
                        </div>

                        {/* Group 설명 입력 */}
                        <div className="flex flex-col gap-2">
                            <label className="font-bold text-grayscale-dark-gray">
                                Group 설명 <span className="text-alert-error text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="Group에 대한 설명을 입력해 주세요"
                                className="w-full h-[120px] bg-grayscale-default rounded-lg px-4 py-3 outline-none resize-none placeholder:text-grayscale-warm-gray"
                                maxLength={50}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <div className="text-right text-xs text-grayscale-warm-gray">
                                {description.length} / 50자
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <div>
                            <Button variant="default" onClick={onClose}>
                                취소
                            </Button>
                        </div>
                        <div>
                            <Button
                                variant="primary"
                                onClick={handleUpdate}
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? "수정 중..." : "수정하기"}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default EditGroupModal;
