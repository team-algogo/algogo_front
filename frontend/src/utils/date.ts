import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ko");

/**
 * Converts a UTC date string to a relative time string (e.g. "방금 전", "5분 전")
 * @param parsedDate - The date string to format (assumed UTC if no timezone info)
 * @returns Relative time string in Korean
 */
export const formatToRelativeTime = (parsedDate: string): string => {
    // If usage is inconsistent, or if the backend sends KST time string 'YYYY-MM-DDTHH:mm:ss' without offset,
    // treating it as UTC (dayjs.utc) and then .local() will add +9h (if user is in KST), resulting in "9 hours later".
    // If the input string is meant to be "server time" which matches "user time" (or we just want to treat it as absolute),
    // we can parse it directly.
    return dayjs(parsedDate).fromNow();
};

/**
 * Converts a UTC date string to a formatted date string (e.g. "2024-01-01")
 * @param parsedDate - The date string to format
 * @param format - Optional format string (default: "YYYY-MM-DD")
 * @returns Formatted date string
 */
export const formatToDate = (parsedDate: string, format: string = "YYYY-MM-DD"): string => {
    return dayjs.utc(parsedDate).local().format(format);
};
