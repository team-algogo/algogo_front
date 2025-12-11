import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // React Query 훅 추가
import Button from "@components/button/Button";
import { createGroup } from "../../api/group/groupApi"; // 위에서 만든 API 함수 import
import Toast from "@pages/toast/Toast";

interface CreateGroupModalProps {
  onClose: () => void;
}

const CreateGroupModal = ({ onClose }: CreateGroupModalProps) => {
  // --- 상태 관리 ---
  const [maxCount, setMaxCount] = useState<number | string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- React Query 설정 ---
  const queryClient = useQueryClient(); // 캐시 관리자 호출

  const mutation = useMutation({
    mutationFn: createGroup, // 실행할 API 함수
    onSuccess: () => {
      // 1. 성공 시: 리스트 데이터 새로고침 (키가 "groups"로 시작하는 모든 쿼리 무효화 -> 재요청 유발)
      queryClient.invalidateQueries({ queryKey: ["groups"] });

      // 2. 성공 토스트 띄우기
      setToastMessage("그룹이 성공적으로 생성되었습니다!");

      // 3. 1.5초 뒤에 모달 닫기 (토스트 메시지를 보여줄 시간 확보)
      setTimeout(() => {
        onClose();
      }, 1500);
    },
    onError: (error) => {
      // 에러 처리 (필요 시 에러 메시지 파싱)
      console.error(error);
      setToastMessage("그룹 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  // --- 핸들러 ---
  const handleCreateGroup = () => {
    // 1. 유효성 검사
    if (maxCount === "") {
      setToastMessage("정원수를 입력해주세요");
      return;
    }

    const capacity = Number(maxCount);

    if (capacity < 1 || capacity > 100) {
      setToastMessage("정원수는 1~100명 사이만 가능합니다");
      return;
    }

    if (!title.trim()) {
      setToastMessage("그룹 이름을 입력해주세요");
      return;
    }

    if (!description.trim()) {
        setToastMessage("그룹 설명을 입력해주세요");
        return;
    }

    // 2. API 요청 전송 (mutate 실행)
    // 백엔드가 원하는 필드명(capacity)으로 매핑해서 보냅니다.
    mutation.mutate({
      title,
      description,
      capacity, 
    });
  };

  return (
    <>
      {/* 토스트 메시지 렌더링 */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      {/* 모달 UI */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-[600px] rounded-2xl p-8 flex flex-col gap-8 shadow-xl relative">
          
          <h2 className="font-headline text-2xl text-center text-grayscale-dark-gray">
            Group 만들기
          </h2>

          {/* 입력 폼 영역 */}
          <div className="flex flex-col gap-6">
            
            {/* 제목 */}
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
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="w-[100px]">
                  <button className="w-full h-full bg-white border border-grayscale-warm-gray rounded-lg text-sm text-grayscale-dark-gray hover:bg-grayscale-default transition-colors">
                    중복 확인
                  </button>
                </div>
              </div>
              <div className="text-right text-xs text-grayscale-warm-gray">
                {title.length} / 10자
              </div>
            </div>

            {/* 정원 (capacity) */}
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
              <p className="text-xs text-grayscale-warm-gray">
                최소 1명부터 최대 100명까지 설정 가능합니다.
              </p>
            </div>

            {/* 설명 */}
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

          {/* 하단 버튼 */}
          <div className="flex gap-3 mt-2">
            <div className="flex-1">
              <Button 
                variant="primary" 
                onClick={handleCreateGroup}
                // API 전송 중일 때 버튼 비활성화 (중복 클릭 방지)
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "생성 중..." : "만들기"}
              </Button>
            </div>
            <div className="flex-1">
              <Button variant="default" onClick={onClose}>
                취소
              </Button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CreateGroupModal;