const getRelativeTime = (dateString) => {
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

    console.log(`Debug: diff=${diff}, hours=${hours}, days=${days}, weeks=${weeks}, months=${months}`);

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

// Test cases
const now = new Date().getTime();
const hour = 1000 * 60 * 60;
const day = hour * 24;
const week = day * 7;
const month = day * 30;
const year = day * 365;

const cases = [
    { label: "30 mins ago", date: new Date(now - hour * 0.5).toISOString(), expected: "방금 전" },
    { label: "1 hour ago", date: new Date(now - hour * 1.1).toISOString(), expected: "1시간 전" },
    { label: "23 hours ago", date: new Date(now - hour * 23.5).toISOString(), expected: "23시간 전" },
    { label: "25 hours ago", date: new Date(now - hour * 25).toISOString(), expected: "1일 전" },
    { label: "6 days ago", date: new Date(now - day * 6.5).toISOString(), expected: "6일 전" },
    { label: "8 days ago", date: new Date(now - day * 8).toISOString(), expected: "1주 전" },
    { label: "25 days ago", date: new Date(now - day * 25).toISOString(), expected: "3주 전" },
    { label: "35 days ago", date: new Date(now - day * 35).toISOString(), expected: "1달 전" },
    { label: "300 days ago", date: new Date(now - day * 300).toISOString(), expected: "10달 전" },
    { label: "400 days ago", date: new Date(now - day * 400).toISOString(), expected: "1년 전" },
];

cases.forEach(c => {
    const result = getRelativeTime(c.date);
    console.log(`[${result === c.expected ? "PASS" : "FAIL"}] ${c.label}: ${result} (Expected: ${c.expected})`);
});
