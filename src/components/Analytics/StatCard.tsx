import { ArrowUpRight, ArrowDownRight, Minus, type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    color?: string; // Tailwind class prefix like 'blue'
}

export function StatCard({ label, value, subValue, icon: Icon, trend, color = 'blue' }: StatCardProps) {
    return (
        <div className="card p-4 border border-[#334155] bg-[#1a1f2e]">
            <div className="flex justify-between items-start mb-2">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                {Icon && <Icon size={18} className={`text-${color}-400`} />}
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-100">{value}</span>
                {subValue && <span className="text-xs text-gray-500">{subValue}</span>}
            </div>

            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium 
          ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`
                }>
                    {trend === 'up' && <ArrowUpRight size={14} />}
                    {trend === 'down' && <ArrowDownRight size={14} />}
                    {trend === 'neutral' && <Minus size={14} />}
                    <span>{trend === 'up' ? 'Trending Up' : trend === 'down' ? 'Trending Down' : 'Neutral'}</span>
                </div>
            )}
        </div>
    );
}
