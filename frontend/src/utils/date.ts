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
    // If the string doesn't explicitly have Z or offset, dayjs might parse as local.
    // However, backend usually sends ISO string (e.g. 2024-01-01T12:00:00).
    // If we know it's UTC, we should treat it as such.
    // .utc(parsedDate) parses it as UTC. .local() converts to browser local time.
    return dayjs.utc(parsedDate).local().fromNow();
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
