import type { Alarm } from "@type/notification/notification.d.ts";
import { formatToRelativeTime } from "@utils/date";
import { getNotificationMessage } from "@utils/notificationMessage";

interface NotificationItemProps {
    alarm: Alarm;
    onClick: () => void;
    // onDelete removed as per requirement
    isDeleteMode: boolean;
    isSelected: boolean;
    onToggleSelect: () => void;
}

export default function NotificationItem({
    alarm,
    onClick,
    isDeleteMode,
    isSelected,
    onToggleSelect
}: NotificationItemProps) {
    const { isRead, type } = alarm;
    const timeAgo = formatToRelativeTime(alarm.createdAt);
    const message = getNotificationMessage(alarm);

    // Determine Icon or initial based on type? 
    // For now use a generic initial or icon
    // Determine Icon based on type
    const getIcon = () => {
        if (type.includes("JOIN")) return "👋";
        if (type.includes("INVITE")) return "✉️";
        if (type.includes("REVIEW")) return "📝";
        return "🔔";
    };

    // 클릭 불가능한 알람 타입 처리
    const isClickable = (() => {
      // GROUP_JOIN_UPDATE: 수락인 경우만 클릭 가능
      if (type === "GROUP_JOIN_UPDATE") {
        return alarm.message && (alarm.message.includes("수락") || alarm.message.includes("ACCEPTED"));
      }
      // GROUP_INVITE_UPDATE: 항상 클릭 불가
      if (type === "GROUP_INVITE_UPDATE") {
        return false;
      }
      // 나머지는 클릭 가능
      return true;
    })();

    // 알림 타입별 배지 정보 (초대 탭용)
    const getTypeBadge = () => {
      if (type === "GROUP_JOIN_APPLY") {
        return {
          label: "참여",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          borderColor: "border-blue-200",
        };
      }
      if (type === "GROUP_INVITE_APPLY") {
        return {
          label: "초대",
          bgColor: "bg-purple-100",
          textColor: "text-purple-700",
          borderColor: "border-purple-200",
        };
      }
      if (type === "GROUP_JOIN_UPDATE") {
        const isAccepted = alarm.message && (alarm.message.includes("수락") || alarm.message.includes("ACCEPTED"));
        if (isAccepted) {
          return {
            label: "수락",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            borderColor: "border-green-200",
          };
        } else {
          return {
            label: "거절",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            borderColor: "border-red-200",
          };
        }
      }
      if (type === "GROUP_INVITE_UPDATE") {
        const isAccepted = alarm.message && (alarm.message.includes("수락") || alarm.message.includes("ACCEPTED"));
        if (isAccepted) {
          return {
            label: "수락",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
            borderColor: "border-green-200",
          };
        } else {
          return {
            label: "거절",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
            borderColor: "border-red-200",
          };
        }
      }
      return null;
    };

    const typeBadge = getTypeBadge();

    return (
        <div
            className={`group relative w-full px-5 py-4 border-b border-gray-100 transition-all duration-200 flex items-start gap-4 ${
                !isRead 
                    ? "bg-gradient-to-r from-primary-50/30 via-white to-white border-l-2 border-l-primary-500" 
                    : "bg-white hover:bg-gray-50/50"
            } ${
                isClickable && !isDeleteMode 
                    ? "cursor-pointer hover:shadow-sm hover:border-gray-200" 
                    : "cursor-default"
            }`}
            onClick={isDeleteMode ? onToggleSelect : (isClickable ? onClick : undefined)}
        >
            {/* Checkbox for delete mode */}
            {isDeleteMode && (
                <div
                    className="flex-shrink-0 pt-0.5"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                            ? "bg-primary-500 border-primary-500 shadow-sm" 
                            : "bg-white border-gray-300 hover:border-primary-300"
                    }`}>
                        {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
            )}

            {/* Icon */}
            {!isDeleteMode && (
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 ${
                    !isRead 
                        ? "bg-gradient-to-br from-primary-100 to-primary-50 ring-2 ring-primary-200/50 shadow-sm" 
                        : "bg-gray-100 group-hover:bg-gray-200"
                }`}>
                    {getIcon()}
                    {!isRead && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-500 border-2 border-white animate-pulse"></span>
                    )}
                </div>
            )}

            <div className={`flex-1 min-w-0 flex flex-col gap-1.5 ${isDeleteMode ? 'pl-0' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                    <p className={`flex-1 text-sm leading-relaxed break-keep ${
                        !isRead 
                            ? "text-gray-900 font-semibold" 
                            : "text-gray-700 font-normal"
                    }`}>
                        {message}
                    </p>
                    {/* 타입 배지 (초대 탭 알림만 표시) */}
                    {typeBadge && (
                        <span className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg ${typeBadge.bgColor} ${typeBadge.textColor} border ${typeBadge.borderColor} text-xs font-bold shadow-sm`}>
                            {typeBadge.label}
                        </span>
                    )}
                </div>

                <div className="flex flex-row items-center gap-2.5">
                    <span className="text-xs text-gray-500 font-medium">
                        {timeAgo}
                    </span>
                    {!isRead && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200/50 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            NEW
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
