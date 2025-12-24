import React from 'react';

interface CircularProgressProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    color?: string;
    showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 60,
    strokeWidth = 6,
    color = '#22c55e', // Default green
    showValue = true
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background Circle */}
                <circle
                    className="text-gray-700"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            {showValue && (
                <span className="absolute text-xs font-bold text-gray-200">
                    {Math.round(value)}%
                </span>
            )}
        </div>
    );
};
