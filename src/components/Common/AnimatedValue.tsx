import React, { useEffect, useState } from 'react';

interface AnimatedValueProps {
    value: number;
    duration?: number;
    formatFn?: (val: number) => string;
    className?: string;
}

export const AnimatedValue: React.FC<AnimatedValueProps> = ({
    value,
    duration = 1000,
    formatFn = (v) => v.toFixed(0),
    className = ''
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const startValue = 0;
        const endValue = value;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            const current = startValue + (endValue - startValue) * easeProgress;
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span className={className}>{formatFn(displayValue)}</span>;
};
