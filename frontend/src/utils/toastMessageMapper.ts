import type { Alarm } from "@type/notification/notification.d.ts";

export interface ToastMessage {
  title: string;
  description?: string;
  cta?: {
    label: string;
    route: string;
    params?: Record<string, any>;
  };
}

// 타입별 메시지 매핑 (요구사항에 맞춤)
const getToastMessageByType = (type: string, payload: any, message?: string): ToastMessage => {
  const userNickname = payload?.userNickname || "사용자";
  const programName = payload?.programName || "그룹";
  const problemTitle = payload?.problemTitle || "문제";
  const programId = payload?.programId || payload?.program_id;
  const submissionId = payload?.submissionId || payload?.submission_id;

  switch (type) {
    case "GROUP_JOIN_APPLY":
      return {
        title: `${userNickname}님이 '${programName}' 참여를 신청했습니다`,
        description: `${userNickname}님의 참여 신청을 확인해주세요`,
        cta: programId
          ? {
            label: "확인하기",
            route: `/group/${programId}`,
            params: { openJoinRequestModal: true },
          }
          : undefined,
      };

    case "GROUP_JOIN_UPDATE": {
      const isAccepted = message?.includes("수락") || message?.includes("ACCEPTED");
      return {
        title: `'${programName}' 참여 신청 ${isAccepted ? "수락" : "거절"}되었습니다`,
        description: isAccepted
          ? `${programName} 그룹에 참여할 수 있습니다`
          : `참여 신청이 거절되었습니다`,
        cta:
          isAccepted && programId
            ? {
              label: "그룹 보기",
              route: `/group/${programId}`,
            }
            : undefined,
      };
    }

    case "GROUP_INVITE_APPLY":
      return {
        title: `${userNickname}님이 '${programName}'에 초대했습니다`,
        description: `그룹 초대를 확인하고 응답해주세요`,
        cta: {
          label: "마이페이지에서 확인",
          route: "/mypage",
        },
      };

    case "GROUP_INVITE_UPDATE": {
      const isAccepted = message?.includes("수락") || message?.includes("ACCEPTED");
      return {
        title: `${userNickname}님이 '${programName}' 초대에 ${isAccepted ? "수락" : "거절"}했습니다`,
        description: isAccepted ? "새로운 멤버가 그룹에 참여했습니다" : "초대가 거절되었습니다",
      };
    }

    case "REQUIRED_REVIEW":
      return {
        title: `'${problemTitle}' 리뷰 요청 매칭되었습니다`,
        description: `대상: ${userNickname}님의 코드를 리뷰해주세요`,
        cta: submissionId
          ? {
            label: "리뷰하러 가기",
            route: `/review/${submissionId}`,
          }
          : undefined,
      };

    case "REVIEW_CREATED":
      return {
        title: `${userNickname}님이 '${problemTitle}'에 리뷰를 작성했습니다`,
        description: "새로운 리뷰를 확인해보세요",
        cta: submissionId
          ? {
            label: "리뷰 보기",
            route: `/review/${submissionId}`,
          }
          : undefined,
      };

    case "REPLY_REVIEW":
      return {
        title: `${userNickname}님이 내 리뷰에 대댓글을 남겼습니다`,
        description: "답글을 확인해보세요",
        cta: submissionId
          ? {
            label: "대댓글 보기",
            route: `/review/${submissionId}`,
          }
          : undefined,
      };

    default:
      if (message) {
        return { title: message };
      }
      // If no message, try to construct one from type
      return {
        title: `새로운 알림 (${type})`,
        description: "알림 내용을 확인해주세요.",
      };
  }
};

export const mapAlarmToToastMessage = (alarm: Alarm): ToastMessage => {
  console.log("[mapAlarmToToastMessage] Mapping alarm:", alarm);
  return getToastMessageByType(alarm.type, alarm.payload, alarm.message);
};
