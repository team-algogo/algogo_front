

// Helper Component for Timer
export const getRelativeTime = (dateString?: string) => {
    if (!dateString) return "";
    const created = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - created.getTime();

    // Convert to units
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (hours < 24) {
        if (hours < 1) return `방금 전`;
        return `${hours}시간 전`;
    }
    if (days < 7) {
        return `${days}일 전`;
    }
    if (weeks < 4) {
        return `${weeks}주 전`;
    }
    if (months < 12) {
        return `${months}달 전`;
    }
    return `${years}년 전`;
};

const TimeDisplay = ({ createAt }: { createAt?: string }) => {
    const relativeTime = getRelativeTime(createAt);

    return (
        <div className="flex items-center gap-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
            >
                <circle cx="8" cy="8" r="6" stroke="#ff8e8eff" strokeWidth="1.5" />
                <path
                    d="M8 4V8L10.5 10.5"
                    stroke="#FF6B6B"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span
                className="text-sm leading-[130%] font-normal text-[#FF6B6B]"
                style={{ fontFamily: "IBM Plex Sans KR" }}
            >
                {relativeTime}
            </span>
        </div>
    );
};

export default TimeDisplay;
