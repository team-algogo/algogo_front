import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../button/Button";
import TextLink from "../../textLink/TextLink";
import { joinGroup } from "../../../api/group/groupApi"; // API 경로 확인해주세요
import Toast, { type ToastType } from "@components/toast/Toast";

interface GroupProps {
  id: number; // programId
  title: string;
  description: string;
  memberCount: number;
  problemCount: number;
  createdAt: string;
  isMember: boolean; // [추가] 멤버 여부
}

const Group = ({
  id,
  title,
  description,
  memberCount,
  problemCount,
  createdAt,
  isMember,
}: GroupProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Toast 상태 관리
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // [React Query] 그룹 참여 Mutation
  const { mutate: joinMutate, isPending } = useMutation({
    mutationFn: () => joinGroup(id),
    onSuccess: () => {
      // 성공 시 Toast 띄우기
      setToastConfig({
        message:
          "참여신청이 완료되었습니다. 관리자의 승인이 될 때까지 기다려주세요.",
        type: "success",
      });
      // 리스트 갱신 (참여 상태 변경 반영 등을 위해)
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "참여 신청 중 오류가 발생했습니다.";
      setToastConfig({ message: errorMsg, type: "error" });
    },
  });

  // 버튼 클릭 핸들러
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않게 방지

    if (isMember) {
      // 1. 이미 멤버인 경우 -> 상세보기 페이지 이동
      navigate(`/group/${id}`);
    } else {
      // 2. 멤버가 아닌 경우 -> 참여하기 요청
      // 로그인 체크가 필요하다면 여기서 userType 확인 로직 추가 가능
      if (window.confirm(`'${title}' 그룹에 참여 신청하시겠습니까?`)) {
        joinMutate();
      }
    }
  };

  // [수정] 설명글 10자 제한 처리
  const truncatedDescription =
    description.length > 25
      ? description.substring(0, 25) + "..."
      : description;

  return (
    <>
      {/* Toast 렌더링 */}
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}

      <div className="flex justify-between w-full px-6 py-4 border-2 border-grayscale-warm-gray rounded-lg items-center gap-4">
        {/* Left Side: 텍스트 영역 
           flex-1과 min-w-0을 주어 공간이 부족하면 줄어들게 설정 
        */}
        <div className="flex flex-col gap-y-2 flex-1 min-w-0">
          <div className="text-title truncate">{title}</div>

          {/* 10자 제한된 설명글 */}
          <div className="text-body text-grayscale-dark-gray h-[24px]">
            {truncatedDescription}
          </div>

          <div className="flex gap-2 flex-wrap">
            <TextLink src="#">
              <img src="/icons/groupIcon.svg" className="size-4" />
              멤버 {memberCount}명
            </TextLink>
            <TextLink src="#">
              <img src="/icons/bookIcon.svg" className="size-4" />
              문제 {problemCount}개
            </TextLink>
            <TextLink src="#">
              <img src="/icons/clockIcon.svg" className="size-4" />
              {createdAt}
            </TextLink>
          </div>
        </div>

        {/* Right Side: 버튼 영역 
           shrink-0을 주어 왼쪽 텍스트가 길어져도 버튼 크기가 찌그러지지 않게 고정
        */}
        <div className="flex justify-center items-center shrink-0">
          <Button
            // isMember에 따라 스타일(variant) 변경 (예: 상세보기는 primary, 참여는 secondary)
            variant={isMember ? "primary" : "secondary"}
            onClick={handleButtonClick}
            disabled={isPending} // API 호출 중 비활성화
          >
            {isMember ? (
              // 상세보기 버튼 (아이콘 변경 가능)
              <>
                <img
                  src="/icons/searchIcon.svg"
                  className="w-4 h-4"
                  alt="search"
                />
                상세보기
              </>
            ) : (
              // 참여하기 버튼
              <>
                <img src="/icons/addMemberIcon.svg" alt="add" />
                참여하기
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Group;
