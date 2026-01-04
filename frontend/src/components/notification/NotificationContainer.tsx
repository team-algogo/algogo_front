import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationDropdown from "./NotificationDropdown";
import { getAlarmCount } from "@api/notification/getAlarmCount";
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function NotificationContainer() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const [listening, setListening] = useState(false);

    // Fetch notifications for badge state (optional if we only use alarmCount)
    // const { data: notificationData } = useQuery({
    //     queryKey: ["notifications"],
    //     queryFn: getNotificationList,
    //     staleTime: 1000 * 60 * 5, // 5 minutes
    // });

    // Fetch alarm count
    const { data: countData } = useQuery({
        queryKey: ['alarmCount'],
        queryFn: getAlarmCount,
        refetchInterval: 1000 * 60, // Refresh every minute
    });

    const alarmCount = countData?.data?.alarmCount || 0;

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // SSE Connection
    useEffect(() => {
        let eventSource: EventSource | null = null;
        if (!listening) {
            const token = localStorage.getItem("access_token");

            if (token) {
                eventSource = new EventSourcePolyfill(
                    `${import.meta.env.VITE_API_URL}/api/v1/alarm/subscribe`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        heartbeatTimeout: 86400000,
                    } as any
                );

                eventSource.onopen = () => {
                    console.log("SSE connected");
                };

                eventSource.addEventListener("alarm", (e: any) => {
                    const { data: receivedData } = e;
                    console.log("SSE Received:", receivedData);
                    // Invalidate alarm count and list on new notification
                    queryClient.invalidateQueries({ queryKey: ['alarmCount'] });
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                });

                eventSource.onerror = (e: any) => {
                    // console.error("SSE Error:", e);
                    eventSource?.close();
                };

                setListening(true);
            }
        }

        return () => {
            if (eventSource) {
                eventSource.close();
                console.log("SSE closed");
            }
        };
    }, [listening, queryClient]);

    return (
        <div ref={containerRef} className="relative z-50">
            <button
                onClick={() => {
                    const newIsOpen = !isOpen;
                    setIsOpen(newIsOpen);
                    if (newIsOpen) {
                        // Optimistically clear the count for instant feedback
                        queryClient.setQueryData(['alarmCount'], (oldData: any) => {
                            if (!oldData) return oldData;
                            return {
                                ...oldData,
                                data: {
                                    ...oldData.data,
                                    alarmCount: 0
                                }
                            };
                        });
                    }
                }}
                className="w-10 h-10 rounded-full bg-white border border-[#F4F4F5] flex items-center justify-center hover:bg-gray-50 transition-colors relative"
            >
                <img
                    src="/icons/alarmIcon.svg"
                    alt="notification"
                    className="w-6 h-6 opacity-60"
                />
                {alarmCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white z-10">
                        {alarmCount > 99 ? '99+' : alarmCount}
                    </span>
                )}
            </button>

            {isOpen && <NotificationDropdown />}
        </div>
    );
}
