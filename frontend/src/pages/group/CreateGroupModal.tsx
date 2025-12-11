import { useState } from "react";
import Button from "@components/button/Button";
import Toast from "@pages/toast/Toast";

interface CreateGroupModalProps {
  onClose: () => void;
}

const CreateGroupModal = ({ onClose }: CreateGroupModalProps) => {
  // --- 상태 관리 ---
  // maxCount: 초기값은 빈 문자열("")로 두어 placeholder가 보이게 하거나, 
  // 입력 시 숫자처리를 위해 number | string 타입을 유지
  const [maxCount, setMaxCount] = useState<number | string>(""); 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 토스트 메시지 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- 핸들러: 만들기 버튼 클릭 시 검증 ---
  const handleCreateGroup = () => {
    // 1. 빈 값 체크
    if (maxCount === "") {
      setToastMessage("정원수를 입력해주세요");
      return;
    }

    const countNumber = Number(maxCount);

    // 2. 범위 체크 (1 ~ 100)
    if (countNumber < 1 || countNumber > 100) {
      setToastMessage("정원수는 1~100명 사이만 가능합니다");
      return;
    }

    // 3. (선택사항) 제목 등 다른 필수값 체크도 필요하면 여기에 추가
    if (!title.trim()) {
       setToastMessage("그룹 이름을 입력해주세요");
       return;
    }

    // 4. 모든 검증 통과 시 API 호출 로직 실행
    console.log("생성 성공!", { title, maxCount: countNumber, description });
    // API 호출 후 모달 닫기 -> onClose();
  };

  return (
    <>
      {/* 토스트 메시지가 있을 때만 렌더링 */}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          onClose={() => setToastMessage(null)} 
        />
      )}

      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white w-[600px] rounded-2xl p-8 flex flex-col gap-8 shadow-xl relative">
          
          <h2 className="font-headline text-2xl text-center text-grayscale-dark-gray">
            Group 만들기
          </h2>

          <div className="flex flex-col gap-6">
            {/* Group 명 */}
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

            {/* 최대 정원수 (수정된 부분) */}
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
                  // 빈 값이면 빈 문자열로, 아니면 숫자로 변환 안 하고 문자열 그대로 뒀다가 제출 시 검증해도 됨
                  // 여기서는 사용자 편의를 위해 '지우기'가 가능하도록 로직 유지
                  if (val === "") {
                    setMaxCount("");
                  } else {
                    setMaxCount(Number(val));
                  }
                }}
              />
              <p className="text-xs text-grayscale-warm-gray">
                최소 1명부터 최대 100명까지 설정 가능합니다.
              </p>
            </div>

            {/* Group 설명 */}
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

          <div className="flex gap-3 mt-2">
            <div className="flex-1">
              <Button variant="primary" onClick={handleCreateGroup}>
                만들기
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