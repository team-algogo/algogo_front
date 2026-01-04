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

    return (
        <div
            className={`w-full px-4 py-3 border-b border-[#F2F2F2] hover:bg-[#F8F9FA] cursor-pointer transition-colors flex items-start gap-3 ${!isRead ? "bg-[#F8FAFC]" : "bg-white"
                }`}
            onClick={isDeleteMode ? onToggleSelect : onClick}
        >
            {/* Checkbox for delete mode */}
            {isDeleteMode && (
                <div
                    className="flex-shrink-0 pt-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect();
                    }}
                >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
                        }`}>
                        {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                </div>
            )}

            {/* Icon */}
            {!isDeleteMode && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">
                    {getIcon()}
                </div>
            )}

            <div className={`flex-1 min-w-0 flex flex-col ${isDeleteMode ? 'pl-0' : ''}`}>
                <p className={`text-sm leading-snug break-keep ${!isRead ? "text-[#111111] font-medium" : "text-[#767676] font-normal"
                    }`}>
                    {message}
                </p>

                <div className="flex flex-row items-center gap-2 mt-1">
                    <span className="text-[11px] text-[#999999]">
                        {timeAgo}
                    </span>
                    {!isRead && (
                        <span className="px-1.5 py-0.5 rounded-[4px] bg-[#FFF1F2] text-[#E11D48] text-[10px] font-bold border border-[#FECDD3] leading-none">
                            NEW
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
