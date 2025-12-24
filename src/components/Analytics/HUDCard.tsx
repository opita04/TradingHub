import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface HUDCardProps {
    title: string;
    value: string;
    change?: number; // percentage
    isCurrency?: boolean;
    data?: number[]; // For sparkline
    status?: 'profit' | 'loss' | 'neutral';
    className?: string; // For Bento grid spanning
}

export const HUDCard: React.FC<HUDCardProps> = ({
    title,
    value,
    change,
    data = [],
    status = 'neutral',
    className = ''
}) => {
    // Determine status color if not explicitly provided
    const computedStatus = status !== 'neutral' ? status : (change && change > 0 ? 'profit' : change && change < 0 ? 'loss' : 'neutral');

    const statusColors = {
        profit: 'text-profit',
        loss: 'text-loss',
        neutral: 'text-tertiary'
    };

    const bgColors = {
        profit: 'bg-profit/10 border-profit/20',
        loss: 'bg-loss/10 border-loss/20',
        neutral: 'bg-surface border-white/5'
    };

    return (
        <div className={`relative p-5 rounded-xl border transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 ${bgColors[computedStatus]} ${className}`}>
            <div className="flex justify-between items-start h-full">
                {/* Left: Metric */}
                <div className="flex flex-col justify-between h-full z-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary mb-1">{title}</span>
                    <div className="flex flex-col">
                        <span className="text-2xl font-mono font-bold text-primary tracking-tight">{value}</span>
                        {change !== undefined && (
                            <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${statusColors[computedStatus]}`}>
                                {computedStatus === 'profit' && <ArrowUpRight size={12} />}
                                {computedStatus === 'loss' && <ArrowDownRight size={12} />}
                                {computedStatus === 'neutral' && <Minus size={12} />}
                                <span>{change > 0 ? '+' : ''}{change}%</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Sparkline (Placeholder visualization for now) */}
                <div className="w-24 h-12 flex items-end gap-0.5 opacity-50 group-hover:opacity-80 transition-opacity">
                    {data.length > 0 ? (
                        data.map((point, i) => (
                            <div
                                key={i}
                                className={`w-full rounded-t-sm transition-all duration-500 ${computedStatus === 'profit' ? 'bg-profit' : computedStatus === 'loss' ? 'bg-loss' : 'bg-brand'}`}
                                style={{ height: `${Math.max(10, Math.min(100, point))}%` }}
                            />
                        ))
                    ) : (
                        // Fallback visual if no data
                        [40, 60, 45, 70, 65, 85, 80].map((h, i) => (
                            <div
                                key={i}
                                className={`w-full rounded-t-sm ${computedStatus === 'profit' ? 'bg-profit' : computedStatus === 'loss' ? 'bg-loss' : 'bg-brand'}`}
                                style={{ height: `${h}%` }}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]`} />
            {computedStatus === 'profit' && <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-profit blur-xl transition-all duration-500" />}
        </div>
    );
};
