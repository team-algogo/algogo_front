
import type { Alarm } from "@type/notification/notification.d.ts";

export const getNotificationMessage = (alarm: Alarm): string => {
    const { type, payload } = alarm;

    switch (type) {
        case "GROUP_JOIN_APPLY":
            return `${payload.userNickname || '알 수 없는 사용자'}님이 [${payload.programName || '그룹'}]에 참여를 신청했습니다.`;

        case "GROUP_JOIN_UPDATE":
            if (alarm.message?.includes('ACCEPTED')) {
                return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 신청을 수락했습니다.`;
            }
            if (alarm.message?.includes('DENIED')) {
                return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 신청을 거절했습니다.`;
            }
            return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 신청을 처리했습니다.`;

        case "GROUP_INVITE_APPLY":
            return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}]에 초대했습니다.`;

        case "GROUP_INVITE_UPDATE":
            if (alarm.message?.includes('ACCEPTED')) {
                return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대를 수락했습니다.`;
            }
            if (alarm.message?.includes('DENIED')) {
                return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대를 거절했습니다.`;
            }
            return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대를 처리했습니다.`;

        case "REQUIRED_REVIEW":
            return `${payload.userNickname || '알 수 없는 사용자'}님의 [${payload.problemTitle || '문제'}] 코드 리뷰가 매칭되었습니다.`;

        case "REVIEW_CREATED":
            return `${payload.userNickname || '알 수 없는 사용자'}님이 [${payload.problemTitle || '문제'}] 코드에 리뷰를 남겼습니다.`;

        case "REPLY_REVIEW":
            return `${payload.userNickname || '알 수 없는 사용자'}님이 대댓글을 남겼습니다.`;

        default:
            return alarm.message || "새로운 알림이 있습니다.";
    }
};
