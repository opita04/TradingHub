import React from 'react';

interface ProgressBarProps {
    value: number; // 0 to 100
    max?: number; // Default 100
    height?: number | string;
    showValue?: boolean;
    colorClass?: string; // e.g. "bg-brand" or "bg-gradient-to-r from-..."
    railClass?: string; // Background rail color
    className?: string; // Container classes
    animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    height = 'h-2',
    showValue = false,
    colorClass = 'bg-gradient-to-r from-brand to-cyan-400',
    railClass = 'bg-surface-highlight',
    className = '',
    animate = true
}) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={`w-full ${className}`}>
            {showValue && (
                <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-medium text-secondary">{percentage.toFixed(0)}%</span>
                </div>
            )}
            <div className={`w-full ${height} rounded-full overflow-hidden ${railClass}`}>
                <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass} ${animate ? 'relative overflow-hidden' : ''}`}
                    style={{ width: `${percentage}%` }}
                >
                    {animate && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-[shimmer_2s_infinite]" />
                    )}
                </div>
            </div>
        </div>
    );
};
