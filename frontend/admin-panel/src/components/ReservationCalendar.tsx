import { useState, useEffect } from 'react';
import api from '../services/api';

interface CalendarReservation {
    id: string;
    tableId: string | null;
    tableNumber: string | null;
    time: string;
    endTime: string;
    guestCount: number;
    status: string;
    confirmationNumber: string;
    specialRequests: string | null;
    customer: {
        firstName: string;
        lastName: string;
        phone: string | null;
    } | null;
}

interface CalendarTable {
    id: string;
    tableNumber: string;
    capacity: number;
    area: string | null;
    status: string | null;
}

interface HoveredReservation {
    reservation: CalendarReservation;
    position: { x: number; y: number };
}

export default function ReservationCalendar() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [reservations, setReservations] = useState<CalendarReservation[]>([]);
    const [tables, setTables] = useState<CalendarTable[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredReservation, setHoveredReservation] = useState<HoveredReservation | null>(null);

    // Hours to display (10:00 - 24:00 for restaurant hours)
    const hours = Array.from({ length: 15 }, (_, i) => i + 10); // 10:00 to 24:00

    useEffect(() => {
        fetchCalendarData();
    }, [selectedDate]);

    const fetchCalendarData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/reservations/calendar/by-date', {
                params: { date: selectedDate }
            });

            if (response.data.success) {
                setReservations(response.data.data.reservations);
                setTables(response.data.data.tables);
            }
        } catch (error) {
            console.error('Error loading calendar data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get unassigned reservations for a specific hour
    const getUnassignedReservationsForHour = (hour: number): CalendarReservation[] => {
        return reservations.filter(r => {
            if (r.tableId !== null) return false;
            const resHour = parseInt(r.time.split(':')[0]);
            const endHour = parseInt(r.endTime.split(':')[0]);
            return hour >= resHour && hour < endHour;
        });
    };

    // Check if it's the start hour for an unassigned reservation
    const isUnassignedReservationStart = (reservation: CalendarReservation, hour: number): boolean => {
        const resHour = parseInt(reservation.time.split(':')[0]);
        return hour === resHour;
    };

    const getReservationDuration = (reservation: CalendarReservation): number => {
        const [startHour, startMin] = reservation.time.split(':').map(Number);
        const [endHour, endMin] = reservation.endTime.split(':').map(Number);
        const startInMinutes = startHour * 60 + startMin;
        const endInMinutes = endHour * 60 + endMin;
        return (endInMinutes - startInMinutes) / 60; // Return hours as decimal
    };

    const handleMouseEnter = (reservation: CalendarReservation, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        // Calculate popup position - constrain within viewport
        const popupWidth = 260;
        const viewportWidth = window.innerWidth;
        let x = rect.left + rect.width / 2;
        // Keep popup within viewport bounds
        if (x - popupWidth / 2 < 10) x = popupWidth / 2 + 10;
        if (x + popupWidth / 2 > viewportWidth - 10) x = viewportWidth - popupWidth / 2 - 10;

        setHoveredReservation({
            reservation,
            position: {
                x: x,
                y: rect.top - 10
            }
        });
    };

    const handleMouseLeave = () => {
        setHoveredReservation(null);
    };

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/80';
            case 'completed': return 'bg-blue-500/80';
            case 'cancelled': return 'bg-red-500/80';
            case 'no_show': return 'bg-orange-500/80';
            default: return 'bg-gray-500/80';
        }
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const changeDate = (days: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-white/60 text-sm">Takvim yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-2xl p-4">
            {/* Header with date navigation */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => changeDate(-1)}
                        className="btn-secondary px-3 py-2 rounded-xl text-sm"
                    >
                        ← Önceki
                    </button>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-premium text-sm px-4 py-2"
                    />
                    <button
                        onClick={() => changeDate(1)}
                        className="btn-secondary px-3 py-2 rounded-xl text-sm"
                    >
                        Sonraki →
                    </button>
                </div>
                <div className="text-white/80 text-sm font-medium">
                    {formatDate(selectedDate)}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Time header */}
                    <div className="flex border-b border-white/10 pb-2 mb-2">
                        <div className="w-24 flex-shrink-0 text-xs text-white/50 uppercase tracking-wider">
                            Masa
                        </div>
                        {hours.map(hour => (
                            <div
                                key={hour}
                                className="flex-1 text-left text-xs text-white/50 pl-1"
                            >
                                {hour.toString().padStart(2, '0')}:00
                            </div>
                        ))}
                    </div>

                    {/* Tables rows */}
                    {tables.length === 0 ? (
                        <div className="text-center py-10 text-white/50">
                            <p>Henüz masa tanımlanmamış.</p>
                        </div>
                    ) : (
                        tables.map(table => (
                            <div key={table.id} className="flex border-b border-white/5 py-1">
                                {/* Table info */}
                                <div className="w-24 flex-shrink-0 flex items-center gap-2 pr-2">
                                    <span className="text-white font-medium text-sm">
                                        #{table.tableNumber}
                                    </span>
                                    <span className="text-white/40 text-xs">
                                        ({table.capacity}K)
                                    </span>
                                </div>

                                {/* Hour slots with CSS Grid */}
                                <div
                                    className="flex-1 relative h-8"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: `repeat(${hours.length}, 1fr)`,
                                    }}
                                >
                                    {/* Grid background cells */}
                                    {hours.map(hour => (
                                        <div
                                            key={`cell-${hour}`}
                                            className="border-r border-white/5 hover:bg-white/5 transition-colors"
                                        />
                                    ))}

                                    {/* Reservation bars - positioned using gridColumn */}
                                    {reservations
                                        .filter((r: CalendarReservation) => r.tableId === table.id)
                                        .map((reservation: CalendarReservation) => {
                                            const startHour = parseInt(reservation.time.split(':')[0]);
                                            const endHour = parseInt(reservation.endTime.split(':')[0]);
                                            // Grid columns are 1-indexed: column 1 = 10:00, column 2 = 11:00, etc.
                                            const startCol = startHour - 10 + 1;
                                            const endCol = endHour - 10 + 1;

                                            return (
                                                <div
                                                    key={reservation.id}
                                                    className={`
                                                        h-8 rounded-lg ${getStatusColor(reservation.status)}
                                                        flex items-center px-2 cursor-pointer transition-all
                                                        hover:scale-[1.02] hover:shadow-lg z-10
                                                    `}
                                                    style={{
                                                        gridColumn: `${startCol} / ${endCol}`,
                                                        gridRow: 1,
                                                    }}
                                                    onMouseEnter={(e) => handleMouseEnter(reservation, e)}
                                                    onMouseLeave={handleMouseLeave}
                                                >
                                                    <span className="text-white text-xs font-medium truncate">
                                                        {reservation.customer ?
                                                            `${reservation.customer.firstName} ${reservation.customer.lastName[0]}.` :
                                                            `${reservation.guestCount}K`
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        ))
                    )}

                    {/* Unassigned reservations row */}
                    {reservations.filter(r => r.tableId === null).length > 0 && (
                        <div className="flex border-t-2 border-yellow-500/30 pt-2 mt-2">
                            {/* Unassigned label */}
                            <div className="w-24 flex-shrink-0 flex items-center gap-2 pr-2">
                                <span className="text-yellow-400 font-medium text-sm">
                                    ⚠️ Atanmamış
                                </span>
                            </div>

                            {/* Hour slots for unassigned */}
                            <div className="flex flex-1 relative">
                                {hours.map(hour => {
                                    const unassigned = getUnassignedReservationsForHour(hour);
                                    const startsThisHour = unassigned.filter(r => isUnassignedReservationStart(r, hour));

                                    if (startsThisHour.length > 0) {
                                        const reservation = startsThisHour[0];
                                        const duration = getReservationDuration(reservation);
                                        return (
                                            <div
                                                key={hour}
                                                className="absolute h-8 rounded-lg bg-yellow-500/80 flex items-center px-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
                                                style={{
                                                    left: `${((hour - 10) / 15) * 100}%`,
                                                    width: `${(duration / 15) * 100}%`,
                                                }}
                                                onMouseEnter={(e) => handleMouseEnter(reservation, e)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <span className="text-white text-xs font-medium truncate">
                                                    {reservation.customer ?
                                                        `${reservation.customer.firstName} ${reservation.customer.lastName[0]}.` :
                                                        `${reservation.guestCount}K`
                                                    }
                                                </span>
                                            </div>
                                        );
                                    }

                                    // Empty or part of reservation
                                    return (
                                        <div
                                            key={hour}
                                            className="flex-1 h-8 border-r border-white/5"
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                <span className="text-xs text-white/50">Durum:</span>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-500/80"></div>
                    <span className="text-xs text-white/60">Onaylı</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-500/80"></div>
                    <span className="text-xs text-white/60">Tamamlandı</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500/80"></div>
                    <span className="text-xs text-white/60">İptal</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-orange-500/80"></div>
                    <span className="text-xs text-white/60">Gelmedi</span>
                </div>
            </div>

            {/* Hover Popup */}
            {hoveredReservation && (
                <div
                    className="fixed z-50 pointer-events-none animate-fade-in"
                    style={{
                        left: hoveredReservation.position.x,
                        top: hoveredReservation.position.y,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="glass-card rounded-xl p-4 shadow-2xl border border-white/20 min-w-[240px]">
                        <div className="space-y-2">
                            {/* Customer Name */}
                            <div className="flex items-center gap-2">
                                <span className="text-lg">👤</span>
                                <span className="text-white font-medium">
                                    {hoveredReservation.reservation.customer ?
                                        `${hoveredReservation.reservation.customer.firstName} ${hoveredReservation.reservation.customer.lastName}` :
                                        'Misafir'
                                    }
                                </span>
                            </div>

                            {/* Time */}
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <span>🕐</span>
                                <span>
                                    {hoveredReservation.reservation.time} - {hoveredReservation.reservation.endTime}
                                </span>
                            </div>

                            {/* Guest count */}
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <span>👥</span>
                                <span>{hoveredReservation.reservation.guestCount} Kişi</span>
                            </div>

                            {/* Confirmation number */}
                            <div className="flex items-center gap-2 text-white/70 text-sm">
                                <span>🎫</span>
                                <span className="font-mono text-xs">{hoveredReservation.reservation.confirmationNumber}</span>
                            </div>

                            {/* Special requests */}
                            {hoveredReservation.reservation.specialRequests && (
                                <div className="mt-2 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                    <p className="text-xs text-white/80">
                                        <span className="font-medium">Özel İstek:</span> {hoveredReservation.reservation.specialRequests}
                                    </p>
                                </div>
                            )}

                            {/* Phone */}
                            {hoveredReservation.reservation.customer?.phone && (
                                <div className="flex items-center gap-2 text-white/70 text-sm">
                                    <span>📞</span>
                                    <span>{hoveredReservation.reservation.customer.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/20"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
