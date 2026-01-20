
import type { Alarm } from "@type/notification/notification.d.ts";

export const getNotificationMessage = (alarm: Alarm): string => {
    const { type, payload } = alarm;

    switch (type) {
        case "GROUP_JOIN_APPLY":
             // 5번 유저가 17번 프로그램에 참여신청을 넣은 경우
            return `${payload.userNickname || '알 수 없는 사용자'}님이 [${payload.programName || '그룹'}]에 참여 신청을 보냈습니다.`;

        case "GROUP_JOIN_UPDATE":
             if (alarm.message && (alarm.message.includes("수락") || alarm.message.includes("ACCEPTED"))) {
                 return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 신청을 수락했습니다.`;
             }
             if (alarm.message && (alarm.message.includes("거절") || alarm.message.includes("DENIED"))) {
                 return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 신청을 거절했습니다.`;
             }
             return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}] 참여 상태를 변경했습니다.`;

        case "GROUP_INVITE_APPLY":
             // 방장이 회원한테 초대를 보내면
            return `${payload.userNickname || '방장'}님이 [${payload.programName || '그룹'}]에 당신을 초대했습니다.`;

        case "GROUP_INVITE_UPDATE":
             if (alarm.message && (alarm.message.includes("수락") || alarm.message.includes("ACCEPTED"))) {
                  return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대를 수락했습니다.`;
             }
             if (alarm.message && (alarm.message.includes("거절") || alarm.message.includes("DENIED"))) {
                  return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대를 거절했습니다.`;
             }
            return `${payload.userNickname || '사용자'}님이 [${payload.programName || '그룹'}] 초대에 응답했습니다.`;

        case "REQUIRED_REVIEW":
            // 유저에게 제출건에 요구된 리뷰가 매칭되었습니다.
            return `${payload.userNickname || '사용자'}님의 [${payload.problemTitle || '문제'}] 코드 리뷰가 매칭되었습니다.`;

        case "REVIEW_CREATED":
            // 사용자가 제출 코드에 리뷰를 작성했을 때
            return `${payload.userNickname || '사용자'}님이 [${payload.problemTitle || '문제'}] 코드에 리뷰를 남겼습니다.`;

        case "REPLY_REVIEW":
            // 사용자가 대댓글을 달았을 때
            return `${payload.userNickname || '사용자'}님이 댓글에 답글을 남겼습니다.`;

        default:
            return alarm.message || "새로운 알림이 도착했습니다.";
    }
};
