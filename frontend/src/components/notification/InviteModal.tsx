import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { getGroupDetail } from "@api/notification/getGroupDetail";
import { getUserDetailById } from "@api/auth/auth";
import { formatToDate } from "@utils/date";

export type ModalType = "INVITE" | "JOIN_REQUEST";

interface InviteModalProps {
  type: ModalType;
  programId?: number;
  userId?: number;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

export default function InviteModal({
  type,
  programId,
  userId,
  onClose,
  onAccept,
  onReject,
}: InviteModalProps) {
  // Fetch Group Data (for INVITE)
  const { data: groupData, isLoading: isGroupLoading } = useQuery({
    queryKey: ["groupDetail", programId],
    queryFn: () => getGroupDetail(programId!),
    enabled: type === "INVITE" && !!programId,
  });

  // Fetch User Data (for JOIN_REQUEST)
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getUserDetailById(userId!),
    enabled: type === "JOIN_REQUEST" && !!userId,
  });

  const isLoading = isGroupLoading || isUserLoading;

  // Handle data normalization
  const group = (groupData as any)?.data || groupData;
  const user = userData;

  if (isLoading) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-fade-in-up relative flex w-[400px] flex-col gap-6 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-900">
            {type === "INVITE"
              ? "아래 그룹에서 회원님을 초대했습니다."
              : "그룹 참여 신청이 도착했습니다."}
          </h2>
        </div>

        {/* Content Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
          {type === "INVITE" ? (
            <>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {group?.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {group?.description || "멋진 그룹입니다! 함께 공부해요."}
              </p>
              <div className="mt-2 flex items-center gap-4 border-t border-gray-200 pt-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span>
                    멤버 {group?.memberCount}/{group?.capacity}명
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>
                    {group?.createdAt ? formatToDate(group.createdAt) : "-"}{" "}
                    개설
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* User Profile for Join Request */}
              <div className="flex items-center gap-3">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.nickname}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-500">
                    {user?.nickname?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {user?.nickname}
                  </h3>
                </div>
              </div>

              <p className="rounded-lg border border-gray-100 bg-white p-3 text-sm leading-relaxed text-gray-600 italic">
                "{user?.description || "안녕하세요! 그룹에 참여하고 싶습니다."}"
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex gap-3">
          <button
            onClick={onAccept}
            className="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-600"
          >
            수락
          </button>
          <button
            onClick={onReject}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            거절
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <img src="/icons/xIcon.svg" alt="close" className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
}
