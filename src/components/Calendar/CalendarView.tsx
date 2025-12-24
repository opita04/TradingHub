import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { CalendarDay } from './CalendarDay';

export function CalendarView() {
    const trades = useTradeStore((state) => state.trades);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Grid Generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    // Weekly Stats (Header)
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate Monthly Stats
    const monthTrades = trades.filter(t => isSameMonth(new Date(t.date), currentDate)); // Note: t.date is string YYYY-MM-DD
    // Actually, we need to compare properly. t.date is 'yyyy-MM-dd'.
    // isSameMonth checks if the two dates are in the same month AND year.
    // We need to parse t.date string to Date object correctly.

    const totalMonthPnL = monthTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = monthTrades.length > 0
        ? (monthTrades.filter(t => t.pnl > 0).length / monthTrades.length) * 100
        : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1a1f2e] p-4 rounded-lg border border-[#334155]">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-100 min-w-[200px]">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><ChevronLeft size={20} /></button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-full transition-colors"><ChevronRight size={20} /></button>
                        <button onClick={goToToday} className="text-sm text-blue-400 hover:text-blue-300 ml-2 px-3 py-1 bg-blue-500/10 rounded-full">Today</button>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                        <span className="block text-gray-400 text-xs">Net P&L</span>
                        <span className={`font-bold text-lg ${totalMonthPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {totalMonthPnL >= 0 ? '+' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthPnL)}
                        </span>
                    </div>
                    <div className="text-center border-l border-gray-700 pl-6">
                        <span className="block text-gray-400 text-xs">Win Rate</span>
                        <span className="font-bold text-lg text-blue-400">{winRate.toFixed(1)}%</span>
                    </div>
                    <div className="text-center border-l border-gray-700 pl-6">
                        <span className="block text-gray-400 text-xs">Trades</span>
                        <span className="font-bold text-lg text-gray-200">{monthTrades.length}</span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="border border-[#334155] rounded-lg overflow-hidden bg-[#0f1419]">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 bg-[#1a1f2e] border-b border-[#334155]">
                    {weekDays.map(day => (
                        <div key={day} className="py-3 text-center text-sm font-semibold text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day) => {
                        // Find trades for this day
                        // We use string comparison for safety with timezones
                        const dayStr = format(day, 'yyyy-MM-dd');
                        const dayTrades = trades.filter(t => t.date === dayStr);

                        const dayPnL = dayTrades.reduce((sum, t) => sum + t.pnl, 0);

                        return (
                            <CalendarDay
                                key={day.toISOString()}
                                date={day}
                                pnl={dayPnL}
                                tradeCount={dayTrades.length}
                                isCurrentMonth={isSameMonth(day, currentDate)}
                                isToday={isToday(day)}
                                onClick={() => {
                                    // TODO: Filter trade list to this day?
                                    console.log('Clicked day', dayStr);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
