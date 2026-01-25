import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "@components/button/Button";
import Toast, { type ToastType } from "@components/toast/Toast";
import { createGroup, checkGroupNameDuplicate } from "../../api/group/groupApi";

interface CreateGroupModalProps {
  onClose: () => void;
  onCreateSuccess?: () => void; // Pagination reset callback
}

const CreateGroupModal = ({ onClose, onCreateSuccess }: CreateGroupModalProps) => {
  // --- 1. 상태 관리 ---
  const [title, setTitle] = useState("");

  // 🔥 [누락되었던 부분] 중복 확인 완료 여부를 체크하는 상태입니다.
  const [isTitleChecked, setIsTitleChecked] = useState(false);

  const [maxCount, setMaxCount] = useState<number | string>("");
  const [description, setDescription] = useState("");

  // Toast 설정
  const [toastConfig, setToastConfig] = useState<{ message: string; type: ToastType } | null>(null);

  const queryClient = useQueryClient();

  // --- 2. API 연결 (React Query) ---

  // (1) 중복 확인 API
  const checkDuplicateMutation = useMutation({
    mutationFn: checkGroupNameDuplicate,
    onSuccess: (response) => {
      // API 응답 구조: { message: "...", data: { isAvailable: true/false } }
      const isAvailable = response.data?.isAvailable;
      const message = response.message;

      // Toast를 초기화한 후 다시 설정하여 매번 표시되도록 함
      setToastConfig(null);
      setTimeout(() => {
        if (isAvailable) {
          setIsTitleChecked(true); // ✅ 사용 가능하므로 체크 상태 true로 변경
          setToastConfig({
            message: message || "사용 가능한 그룹 이름입니다.",
            type: "success"
          });
        } else {
          setIsTitleChecked(false); // ❌ 중복이므로 체크 상태 false
          setToastConfig({
            message: message || "이미 존재하는 그룹 이름입니다.",
            type: "error"
          });
        }
      }, 10);
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || "중복 확인 중 오류가 발생했습니다.";
      setToastConfig(null);
      setTimeout(() => {
        setToastConfig({ message: errorMsg, type: "error" });
      }, 10);
      setIsTitleChecked(false);
    }
  });

  // (2) 그룹 생성 API
  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] }); // 리스트 새로고침
      queryClient.invalidateQueries({ queryKey: ["myGroups"] }); // 내 그룹 리스트 새로고침
      setToastConfig({ message: "그룹이 성공적으로 생성되었습니다!", type: "success" });
      if (onCreateSuccess) onCreateSuccess();
      setTimeout(() => onClose(), 500); // 0.5초 뒤 모달 닫기
    },
    onError: () => {
      setToastConfig({ message: "그룹 생성에 실패했습니다.", type: "error" });
    },
  });

  // --- 3. 핸들러 함수들 ---

  // 중복 확인 버튼 클릭 시
  const handleCheckDuplicate = () => {
    if (!title.trim()) {
      setToastConfig({ message: "그룹 이름을 입력해주세요", type: "error" });
      return;
    }
    checkDuplicateMutation.mutate(title);
  };

  // 만들기 버튼 클릭 시
  const handleCreateGroup = () => {
    // A. 중복 확인 여부 체크
    if (!isTitleChecked) {
      setToastConfig({ message: "그룹 이름 중복 확인을 해주세요", type: "error" });
      return;
    }

    // B. 제목 입력 체크 (혹시 모르니 한번 더)
    if (!title.trim()) {
      setToastConfig({ message: "그룹 이름을 입력해주세요", type: "error" });
      return;
    }

    // C. 정원수 체크
    if (maxCount === "" || Number(maxCount) <= 0) {
      setToastConfig({ message: "정원수를 입력해주세요", type: "error" });
      return;
    }
    if (Number(maxCount) > 100) {
      setToastConfig({ message: "최대 정원수는 100명입니다.", type: "error" });
      return;
    }

    // D. 그룹 생성 요청 전송
    createMutation.mutate({
      title,
      description,
      capacity: Number(maxCount),
    });
  };

  return (
    <>
      {/* Toast 메시지 표시 */}
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
            Group 만들기
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
                    // 🚨 중요: 글자를 고치면 다시 중복확인을 받아야 하므로 false로 초기화
                    setIsTitleChecked(false);
                  }}
                />
                <div className="w-[100px]">
                  <button
                    onClick={handleCheckDuplicate}
                    disabled={checkDuplicateMutation.isPending}
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
                  if (val === "") {
                    setMaxCount("");
                  } else {
                    const numVal = Number(val);
                    if (numVal > 100) {
                      setMaxCount(100); // 100을 넘으면 100으로 고정
                    } else {
                      setMaxCount(numVal);
                    }
                  }
                }}
              />
              <p className="text-xs text-grayscale-warm-gray">
                최소 1명부터 최대 100명까지 설정 가능합니다.
              </p>
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

          {/* Validation Feedback */}
          {(!isTitleChecked || !title.trim() || maxCount === "" || Number(maxCount) <= 0 || !description.trim()) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">다음 항목을 확인해주세요:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {!title.trim() && <li className="flex items-center gap-1.5"><span className="text-blue-600">•</span> Group 명을 입력해주세요</li>}
                    {title.trim() && !isTitleChecked && <li className="flex items-center gap-1.5"><span className="text-blue-600">•</span> Group 명 중복 확인을 해주세요</li>}
                    {(maxCount === "" || Number(maxCount) <= 0) && <li className="flex items-center gap-1.5"><span className="text-blue-600">•</span> 최대 정원수를 입력해주세요</li>}
                    {!description.trim() && <li className="flex items-center gap-1.5"><span className="text-blue-600">•</span> Group 설명을 입력해주세요</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <div>
              <Button variant="default" onClick={onClose}>
                취소
              </Button>
            </div>
            <div>
              <Button
                variant="primary"
                onClick={handleCreateGroup}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "생성 중..." : "만들기"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateGroupModal;