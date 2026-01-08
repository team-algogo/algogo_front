import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../../button/Button";
import { joinGroup } from "../../../api/group/groupApi";
import Toast, { type ToastType } from "@components/toast/Toast";

interface GroupProps {
  id: number; // programId
  title: string;
  description: string;
  memberCount: number;
  problemCount: number;
  createdAt: string;
  isMember: boolean;
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
      if (window.confirm(`'${title}' 그룹에 참여 신청하시겠습니까?`)) {
        joinMutate();
      }
    }
  };

  const truncatedDescription =
    description.length > 50
      ? description.substring(0, 50) + "..."
      : description;

  return (
    <>
      {toastConfig && (
        <Toast
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}

      {/* Programmers Style: Simpler List Item */}
      <div
        onClick={isMember ? () => navigate(`/group/${id}`) : undefined}
        className="flex flex-col md:flex-row justify-between w-full px-5 py-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors items-start md:items-center gap-4 cursor-pointer"
      >
        {/* Left: Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-primary-main truncate transition-colors">
              {title}
            </h3>
            {isMember && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-50 text-primary-main border border-primary-100">
                참여중
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 truncate">
            {truncatedDescription}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1">
              <span>멤버</span>
              <span className="font-medium text-gray-700">{memberCount}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <span>문제</span>
              <span className="font-medium text-gray-700">{problemCount}</span>
            </div>
            <div className="w-[1px] h-3 bg-gray-300"></div>
            <span>{createdAt}</span>
          </div>
        </div>

        {/* Right: Action Button (Simple, but clear) */}
        {!isMember && (
          <div className="shrink-0">
            <Button
              variant="primary"
              className="!h-9 !px-4 !text-sm !font-medium"
              onClick={handleButtonClick}
              disabled={isPending}
            >
              참여하기
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Group;
