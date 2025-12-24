import React from 'react';
import { TrendingUp, Activity, BarChart2, Clock } from 'lucide-react';

export const QuickStatsBar: React.FC = () => {
    const stats = [
        { label: 'Win Rate', value: '68%', icon: TrendingUp, color: 'text-green-400', sub: 'Last 20' },
        { label: 'Profit Factor', value: '2.41', icon: BarChart2, color: 'text-blue-400', sub: 'High' },
        { label: 'Avg R:R', value: '1:2.5', icon: Activity, color: 'text-purple-400', sub: 'Optimal' },
        { label: 'Trade Duration', value: '45m', icon: Clock, color: 'text-orange-400', sub: 'Avg' },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
                <div key={idx} className="glass-card p-4 flex items-center justify-between group cursor-default h-20">
                    <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg bg-gray-900/50 border border-white/5 ${stat.color} group-hover:scale-110 group-hover:bg-white/5 transition-all duration-300`}>
                            <stat.icon size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] leading-none mb-1.5">{stat.label}</p>
                            <p className="text-lg font-bold text-white tracking-tight leading-none">{stat.value}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest border border-white/5">
                            {stat.sub}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
