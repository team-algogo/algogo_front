import { useState, useRef, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isValid } from "date-fns";
import { ko } from "date-fns/locale";

interface DateTimePickerProps {
    label?: string;
    value: string; // ISO string
    onChange: (value: string) => void;
    minDate?: Date;
    maxDate?: Date;
    placeholder?: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const DateTimePicker = ({ label, value, onChange, minDate, maxDate, placeholder = "날짜 선택" }: DateTimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse initial value or default to now
    const initialDate = value ? new Date(value) : new Date();
    const validDate = isValid(initialDate) ? initialDate : new Date();

    const [currentMonth, setCurrentMonth] = useState(validDate);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? validDate : null);

    // Time state
    const [selectedHour, setSelectedHour] = useState(value ? getHoursString(validDate) : "00");
    const [selectedMinute, setSelectedMinute] = useState(value ? getMinutesString(validDate) : "00");

    useEffect(() => {
        if (value) {
            const d = new Date(value);
            if (isValid(d)) {
                setSelectedDate(d);
                setSelectedHour(getHoursString(d));
                setSelectedMinute(getMinutesString(d));
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getHoursString(date: Date) {
        return date.getHours().toString().padStart(2, "0");
    }

    function getMinutesString(date: Date) {
        return date.getMinutes().toString().padStart(2, "0");
    }

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const handleDateClick = (day: Date) => {
        const newDate = new Date(day);
        newDate.setHours(parseInt(selectedHour), parseInt(selectedMinute));

        setSelectedDate(newDate);
        onChange(newDate.toISOString());
    };

    const updateTime = (type: "hour" | "minute", val: number) => {
        let newDate = selectedDate ? new Date(selectedDate) : new Date();
        if (!selectedDate) newDate = new Date();

        let newVal = val;
        if (type === "hour") {
            // Wrap around 0-23
            if (newVal < 0) newVal = 23;
            if (newVal > 23) newVal = 0;

            const strVal = newVal.toString().padStart(2, '0');
            setSelectedHour(strVal);
            newDate.setHours(newVal);
        } else {
            // Wrap around 0-59
            if (newVal < 0) newVal = 59;
            if (newVal > 59) newVal = 0;

            const strVal = newVal.toString().padStart(2, '0');
            setSelectedMinute(strVal);
            newDate.setMinutes(newVal);
        }

        setSelectedDate(newDate);
        onChange(newDate.toISOString());
    };

    const handleInputChange = (type: "hour" | "minute", e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(val)) return;

        // Limit length
        if (val.length > 2) return;

        if (type === "hour") setSelectedHour(val);
        else setSelectedMinute(val);
    };

    const handleInputBlur = (type: "hour" | "minute") => {
        let val = parseInt(type === "hour" ? selectedHour : selectedMinute);
        if (isNaN(val)) val = 0;
        updateTime(type, val);
    };

    const handleIncrement = (type: "hour" | "minute") => {
        const current = parseInt(type === "hour" ? selectedHour : selectedMinute) || 0;
        updateTime(type, current + 1);
    };

    const handleDecrement = (type: "hour" | "minute") => {
        const current = parseInt(type === "hour" ? selectedHour : selectedMinute) || 0;
        updateTime(type, current - 1);
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const startDay = startOfMonth(currentMonth).getDay();
    const paddingDays = Array.from({ length: startDay });

    const displayValue = selectedDate
        ? format(selectedDate, "yyyy. MM. dd. (eee) HH:mm", { locale: ko })
        : "";

    return (
        <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
            {label && <label className="text-xs font-bold text-gray-500">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between
                    w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none 
                    cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all
                    ${isOpen ? "border-primary-main ring-2 ring-primary-main/20" : ""}
                    ${!selectedDate ? "text-gray-400" : "text-gray-900"}
                `}
            >
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{displayValue || placeholder}</span>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 w-72 p-4"
                    style={{ top: '100%', left: 0 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="text-sm font-bold text-gray-800">
                            {format(currentMonth, "yyyy년 M월")}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS.map(day => (
                            <div key={day} className="text-center text-[10px] text-gray-400 font-medium py-1">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
                        {daysInMonth.map(day => {
                            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                            const isTodayDate = isToday(day);
                            const isCurrentMonth = isSameMonth(day, currentMonth);

                            let isDisabled = false;
                            if (minDate && day < new Date(minDate.setHours(0, 0, 0, 0))) isDisabled = true;
                            if (maxDate && day > new Date(maxDate.setHours(23, 59, 59, 999))) isDisabled = true;

                            return (
                                <button
                                    key={day.toISOString()}
                                    onClick={() => !isDisabled && handleDateClick(day)}
                                    disabled={isDisabled}
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all relative
                                        ${isSelected
                                            ? "bg-primary-main text-white font-bold shadow-md shadow-primary-main/30"
                                            : isTodayDate
                                                ? "text-primary-main font-bold bg-primary-50"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }
                                        ${isDisabled ? "opacity-20 cursor-not-allowed hover:bg-transparent" : ""}
                                        ${!isCurrentMonth && !isDisabled ? "text-gray-300" : ""}
                                    `}
                                >
                                    {format(day, "d")}
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-px bg-gray-100 my-3"></div>

                    {/* Time Selection (Numeric & Spinner) */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                            {/* Hour Group */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden hover:border-primary-main transition-colors group w-[60px]">
                                    <input
                                        type="text"
                                        value={selectedHour}
                                        onChange={(e) => handleInputChange("hour", e)}
                                        onBlur={() => handleInputBlur("hour")}
                                        className="w-full h-8 text-center text-sm font-bold text-gray-800 bg-transparent outline-none p-0 group-focus-within:text-primary-main"
                                    />
                                    <div className="flex flex-col border-l border-gray-200 h-8 w-5 flex-shrink-0">
                                        <button
                                            onClick={() => handleIncrement("hour")}
                                            className="flex-1 flex items-center justify-center bg-gray-50 hover:bg-primary-50 text-gray-400 hover:text-primary-main transition-colors border-b border-gray-200"
                                        >
                                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDecrement("hour")}
                                            className="flex-1 flex items-center justify-center bg-gray-50 hover:bg-primary-50 text-gray-400 hover:text-primary-main transition-colors"
                                        >
                                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500">시</span>
                            </div>

                            {/* Minute Group */}
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden hover:border-primary-main transition-colors group w-[60px]">
                                    <input
                                        type="text"
                                        value={selectedMinute}
                                        onChange={(e) => handleInputChange("minute", e)}
                                        onBlur={() => handleInputBlur("minute")}
                                        className="w-full h-8 text-center text-sm font-bold text-gray-800 bg-transparent outline-none p-0 group-focus-within:text-primary-main"
                                    />
                                    <div className="flex flex-col border-l border-gray-200 h-8 w-5 flex-shrink-0">
                                        <button
                                            onClick={() => handleIncrement("minute")}
                                            className="flex-1 flex items-center justify-center bg-gray-50 hover:bg-primary-50 text-gray-400 hover:text-primary-main transition-colors border-b border-gray-200"
                                        >
                                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDecrement("minute")}
                                            className="flex-1 flex items-center justify-center bg-gray-50 hover:bg-primary-50 text-gray-400 hover:text-primary-main transition-colors"
                                        >
                                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500">분</span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                            }}
                            className="px-3 py-1.5 bg-primary-main text-white text-xs font-bold rounded-md hover:bg-primary-dark transition-colors shadow-sm"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateTimePicker;
