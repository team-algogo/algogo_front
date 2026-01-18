import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../button/Button";
import { joinGroup } from "../../../api/group/groupApi";
import Toast, { type ToastType } from "@components/toast/Toast";

import ConfirmModal from "@components/modal/ConfirmModal";

interface GroupProps {
  id: number; // programId
  title: string;
  description: string;
  memberCount: number;
  capacity: number;
  problemCount: number;
  createdAt: string;
  isMember: boolean;
  isLoggedIn?: boolean;
}

const Group = ({
  id,
  title,
  description,
  memberCount,
  capacity,
  problemCount,
  createdAt,
  isMember,
  isLoggedIn = false,
}: GroupProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Toast 상태 관리
  const [toastConfig, setToastConfig] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Confirm Modal State
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

  // [React Query] 그룹 참여 Mutation
  const { mutate: joinMutate, isPending } = useMutation({
    mutationFn: () => joinGroup(id),
    onSuccess: () => {
      setToastConfig({
        message:
          "참여신청이 완료되었습니다. 관리자의 승인이 될 때까지 기다려주세요.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["myGroups"] });
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "참여 신청 중 오류가 발생했습니다.";
      setToastConfig({ message: errorMsg, type: "error" });
    },
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isMember) {
      navigate(`/group/${id}`);
    } else {
      // 정원 초과 확인
      if (memberCount >= capacity) {
        setToastConfig({
          message: "정원이 가득 찬 그룹입니다.",
          type: "error",
        });
        return;
      }

      setConfirmModal({
        isOpen: true,
        title: "그룹 참여",
        message: `'${title}' 그룹에 참여 신청하시겠습니까?`,
        onConfirm: () => {
          joinMutate();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <div
        onClick={() => isLoggedIn ? navigate(`/group/${id}`) : window.location.href = "https://algogo.kr/intro"}
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between w-full p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden gap-6"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gray-100 group-hover:bg-primary-main transition-colors hidden md:block"></div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100 group-hover:bg-primary-main transition-colors md:hidden"></div>

        {/* Left: Info */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-main transition-colors truncate">
              {title}
            </h3>
            {isMember && (
              <span className="shrink-0 px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary-50 text-primary-600 border border-primary-100">
                참여중
              </span>
            )}
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">
              {createdAt}
            </span>
          </div>

          <p className="text-sm text-gray-500 line-clamp-1 leading-relaxed md:line-clamp-2">
            {description}
          </p>
        </div>

        {/* Right: Stats & Action */}
        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-1.5" title="멤버 수">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{memberCount} <span className="text-gray-300">/</span> {capacity}</span>
            </div>
            <div className="flex items-center gap-1.5" title="문제 수">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>{problemCount}</span>
            </div>
          </div>

          {!isMember && isLoggedIn && (
            <Button
              variant="secondary"
              className="!w-24 !h-9 !text-sm !font-bold hover:!bg-primary-main hover:!text-white group-hover:border-primary-main transition-all"
              onClick={handleButtonClick}
              disabled={isPending}
            >
              참여하기
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Group;
