import ReservationCalendar from '../components/ReservationCalendar';

export default function CalendarPage() {
    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
                        Rezervasyon Takvimi
                    </h1>
                    <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
                        Masalara göre günlük rezervasyon durumunu görüntüleyin
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <span className="pill">
                        <span className="dot"></span>
                        Canlı
                    </span>
                </div>
            </div>

            {/* Calendar */}
            <ReservationCalendar />
        </div>
    );
}
