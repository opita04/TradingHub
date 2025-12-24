import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { useAccountStore } from '../../stores/accountStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay, addMonths, subMonths } from 'date-fns';

export const TradingCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const trades = useTradeStore((state) => state.trades);
    const accounts = useAccountStore((state) => state.accounts);
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);

    const selectedAccount = useMemo(() =>
        accounts.find(a => a.id === selectedAccountId) || null
        , [accounts, selectedAccountId]);

    // Filter trades for selected account
    const accountTrades = useMemo(() =>
        selectedAccount ? trades.filter(t => t.accountId === selectedAccount.id) : trades
        , [trades, selectedAccount]);

    // Group P/L by date
    const pnlByDate = accountTrades.reduce((acc, trade) => {
        if (!acc[trade.date]) acc[trade.date] = 0;
        acc[trade.date] += trade.pnl;
        return acc;
    }, {} as Record<string, number>);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Pad start with empty cells for proper alignment
    const startPadding = getDay(monthStart);

    // Calculate weekly totals
    const weeks: { days: Date[]; total: number }[] = [];
    let currentWeek: Date[] = [];
    let weekTotal = 0;

    days.forEach((day, index) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayPnl = pnlByDate[dateStr] || 0;

        currentWeek.push(day);
        weekTotal += dayPnl;

        if (getDay(day) === 0 || index === days.length - 1) {
            weeks.push({ days: [...currentWeek], total: weekTotal });
            currentWeek = [];
            weekTotal = 0;
        }
    });

    const getDayColor = (pnl: number) => {
        if (pnl > 0) return 'bg-profit/20 text-profit';
        if (pnl < 0) return 'bg-loss/20 text-loss';
        return 'text-tertiary';
    };

    return (
        <div className="glass-card p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-primary">
                    $0.00
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                        className="p-1 text-tertiary hover:text-primary transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm font-medium text-secondary">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                        className="p-1 text-tertiary hover:text-primary transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-8 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ''].map((day) => (
                    <div key={day} className="text-[10px] text-tertiary text-center font-medium">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-8 gap-1">
                        {/* Padding for first week */}
                        {weekIndex === 0 && Array.from({ length: startPadding === 0 ? 6 : startPadding - 1 }).map((_, i) => (
                            <div key={`pad-${i}`} className="aspect-square" />
                        ))}

                        {week.days.map((day) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const pnl = pnlByDate[dateStr] || 0;

                            return (
                                <div
                                    key={dateStr}
                                    className={`aspect-square flex items-center justify-center text-xs rounded transition-colors ${isToday(day) ? 'ring-1 ring-brand' : ''
                                        } ${getDayColor(pnl)} ${isSameMonth(day, currentDate) ? '' : 'opacity-30'
                                        }`}
                                >
                                    {format(day, 'd')}
                                </div>
                            );
                        })}

                        {/* Week total */}
                        <div className={`flex items-center justify-center text-xs font-medium ${week.total > 0 ? 'text-profit' : week.total < 0 ? 'text-loss' : 'text-tertiary'
                            }`}>
                            Week {weekIndex + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
