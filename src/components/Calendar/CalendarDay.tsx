import { format } from 'date-fns';

interface CalendarDayProps {
    date: Date;
    pnl: number;
    tradeCount: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    onClick: () => void;
}

export function CalendarDay({ date, pnl, tradeCount, isCurrentMonth, isToday, onClick }: CalendarDayProps) {
    const hasTrades = tradeCount > 0;
    const isProfit = pnl > 0;
    const isLoss = pnl < 0; // Distinct from 0 (breakeven)

    let bgClass = 'bg-[#1a1f2e]'; // Default card bg
    let borderClass = 'border-[#334155]';

    if (hasTrades) {
        if (isProfit) {
            bgClass = 'bg-emerald-900/20 hover:bg-emerald-900/30';
            borderClass = 'border-emerald-500/30';
        } else if (isLoss) {
            bgClass = 'bg-red-900/20 hover:bg-red-900/30';
            borderClass = 'border-red-500/30';
        } else {
            bgClass = 'bg-gray-800/50 hover:bg-gray-700/50'; // Breakeven
        }
    } else if (!isCurrentMonth) {
        bgClass = 'bg-[#0f1419]/50'; // Dimmed for other month
    }

    return (
        <div
            onClick={onClick}
            className={`
        h-24 md:h-32 border p-2 relative transition-all cursor-pointer group
        ${bgClass} ${borderClass}
        ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}
      `}
        >
            <div className={`
        text-sm font-medium mb-1
        ${isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
        ${isToday ? 'text-blue-400' : ''}
      `}>
                {format(date, 'd')}
            </div>

            {hasTrades && (
                <div className="flex flex-col items-center justify-center h-[calc(100%-1.5rem)]">
                    <span className={`text-lg font-bold ${isProfit ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'}`}>
                        {pnl > 0 ? '+' : ''}${Math.round(pnl)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {tradeCount} trade{tradeCount !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            {!hasTrades && isCurrentMonth && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-gray-800/30 transition-opacity">
                    <span className="text-xs text-gray-400">Log Trade</span>
                </div>
            )}
        </div>
    );
}
