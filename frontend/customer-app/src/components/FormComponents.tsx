import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
    options: { value: string | number; label: string }[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Seçiniz...',
    icon,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optValue: string | number) => {
        onChange(optValue);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 text-white hover:border-white/40 focus:border-[#cfd4dc]/50 focus:bg-white/8 transition-all duration-200"
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-white/40">{icon}</span>}
                    <span className={selectedOption ? 'text-white' : 'text-white/40'}>
                        {selectedOption?.label || placeholder}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            <div
                className={`absolute z-[9999] w-full mt-2 py-2 rounded-xl bg-[#1a2744] border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-200 origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 pointer-events-auto'
                    : 'opacity-0 scale-y-95 pointer-events-none'
                    }`}
                style={{ maxHeight: '280px', overflowY: 'auto' }}
            >
                {options.map((option, idx) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center justify-between ${option.value === value
                            ? 'bg-[#cfd4dc]/20 text-white'
                            : highlightedIndex === idx
                                ? 'bg-white/10 text-white'
                                : 'text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <span>{option.label}</span>
                        {option.value === value && (
                            <svg className="w-4 h-4 text-[#cfd4dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Custom Date Picker
interface CustomDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    minDate?: Date;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    value,
    onChange,
    minDate = new Date(),
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            return new Date(y, m - 1, d);
        }
        return new Date();
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];

    const weekDays = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pa'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // Get Monday as first day of week
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1;

        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-').map(Number);
        return `${d} ${months[m - 1]} ${y}`;
    };

    const handleSelectDate = (date: Date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        onChange(dateStr);
        setIsOpen(false);
    };

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        const compareDate = new Date(minDate);
        compareDate.setHours(0, 0, 0, 0);
        return date < compareDate;
    };

    const isSelectedDate = (date: Date | null) => {
        if (!date || !value) return false;
        const [y, m, d] = value.split('-').map(Number);
        return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 text-white hover:border-white/40 focus:border-[#cfd4dc]/50 transition-all duration-200"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={value ? 'text-white' : 'text-white/40'}>
                        {value ? formatDisplayDate(value) : 'Tarih seçin'}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Calendar Dropdown */}
            <div
                className={`absolute z-[9999] w-80 mt-2 p-4 rounded-2xl bg-[#1a2744] border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-200 origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 pointer-events-auto'
                    : 'opacity-0 scale-y-95 pointer-events-none'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        type="button"
                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span className="text-white font-medium">
                        {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button
                        type="button"
                        onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Week days */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs text-white/40 py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(viewDate).map((date, idx) => (
                        <button
                            key={idx}
                            type="button"
                            disabled={isDateDisabled(date)}
                            onClick={() => date && handleSelectDate(date)}
                            className={`h-9 rounded-lg text-sm transition-all duration-150 ${!date
                                ? 'invisible'
                                : isDateDisabled(date)
                                    ? 'text-white/20 cursor-not-allowed'
                                    : isSelectedDate(date)
                                        ? 'bg-[#cfd4dc] text-[#0f1a2b] font-medium shadow-lg'
                                        : 'text-white/80 hover:bg-white/10'
                                }`}
                        >
                            {date?.getDate()}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Custom Time Picker
interface CustomTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    minHour?: number;
    maxHour?: number;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
    value,
    onChange,
    minHour = 11,
    maxHour = 21,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
    const minutes = ['00', '15', '30', '45'];

    const handleSelectTime = (hour: number, minute: string) => {
        const timeStr = `${String(hour).padStart(2, '0')}:${minute}`;
        onChange(timeStr);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/5 border border-white/20 text-white hover:border-white/40 focus:border-[#cfd4dc]/50 transition-all duration-200"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={value ? 'text-white' : 'text-white/40'}>
                        {value || 'Saat seçin'}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Time Grid Dropdown */}
            <div
                className={`absolute z-[9999] w-72 mt-2 rounded-2xl bg-[#1a2744] border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-200 origin-top ${isOpen
                    ? 'opacity-100 scale-y-100 pointer-events-auto'
                    : 'opacity-0 scale-y-95 pointer-events-none'
                    }`}
                style={{ bottom: 'auto' }}
            >
                <div className="p-3 border-b border-white/10">
                    <div className="text-xs text-white/40 uppercase tracking-wider">Saat Seçin</div>
                </div>
                <div className="p-3 max-h-64 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-2">
                        {hours.map((hour) => (
                            minutes.map((minute) => {
                                const timeStr = `${String(hour).padStart(2, '0')}:${minute}`;
                                const isSelected = value === timeStr;
                                return (
                                    <button
                                        key={timeStr}
                                        type="button"
                                        onClick={() => handleSelectTime(hour, minute)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 ${isSelected
                                            ? 'bg-[#cfd4dc] text-[#0f1a2b] shadow-lg'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {timeStr}
                                    </button>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default { CustomSelect, CustomDatePicker, CustomTimePicker };
