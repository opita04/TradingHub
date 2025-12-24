import React from 'react';

interface SparkLineProps {
    data: number[];
    color?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
}

export const SparkLine: React.FC<SparkLineProps> = ({
    data,
    color = '#22c55e',
    width = 100,
    height = 40,
    strokeWidth = 2
}) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Calculate points
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const normalizedY = (val - min) / range;
        const y = height - (normalizedY * height); // Invert Y for SVG
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            {/* Gradient definition for fill area (optional) */}
            <defs>
                <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            <path
                d={`M 0 ${height} L ${points} L ${width} ${height} Z`}
                fill={`url(#grad-${color})`}
                stroke="none"
            />

            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
