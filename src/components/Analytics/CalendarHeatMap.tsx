import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarHeatMap: React.FC = () => {
    // Generate dummy heatmap data (last 35 days)
    const days = Array.from({ length: 35 }, (_, i) => {
        const intensity = Math.random(); // 0 to 1
        let colorClass = 'bg-gray-800/50';

        if (intensity > 0.8) colorClass = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
        else if (intensity > 0.6) colorClass = 'bg-green-600/80';
        else if (intensity > 0.4) colorClass = 'bg-green-700/60';
        else if (intensity > 0.2) colorClass = 'bg-green-800/40';

        // Sprinkle some red days
        if (Math.random() > 0.85) {
            if (intensity > 0.5) colorClass = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
            else colorClass = 'bg-red-900/40';
        }

        return { id: i, colorClass };
    });

    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
        <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Consistency</h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors">
                        <ChevronLeft size={14} />
                    </button>
                    <button className="p-1 hover:bg-white/5 rounded text-gray-500 hover:text-white transition-colors">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {weekDays.map(d => (
                    <span key={d} className="text-[10px] text-gray-600 text-center font-medium">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((d) => (
                    <div
                        key={d.id}
                        className={`aspect-square rounded-md ${d.colorClass} border border-transparent hover:border-white/20 transition-all cursor-pointer`}
                        title={`Day ${d.id + 1}`}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] text-gray-500">Less</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded bg-gray-800/50" />
                    <div className="w-2 h-2 rounded bg-green-900/40" />
                    <div className="w-2 h-2 rounded bg-green-600/80" />
                    <div className="w-2 h-2 rounded bg-green-500" />
                </div>
                <span className="text-[10px] text-gray-500">More</span>
            </div>
        </div>
    );
};
