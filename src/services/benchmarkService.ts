import { format, subDays } from 'date-fns';
import type { BenchmarkIndex, BenchmarkDataPoint } from '../types';

export const benchmarkService = {
    getBenchmarkData: (index: BenchmarkIndex, days: number = 365): BenchmarkDataPoint[] => {
        // Generate mock data for now
        const data: BenchmarkDataPoint[] = [];
        let currentValue = 100; // Base value

        // Volatility and trend based on index
        let volatility = 0.01;
        let trend = 0.0005; // Slightly bullish

        if (index === 'NDX') { volatility = 0.015; trend = 0.0008; }
        if (index === 'DJI') { volatility = 0.008; trend = 0.0003; }

        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = subDays(now, i);

            // Random walk
            const change = (Math.random() - 0.5) * volatility + trend;
            currentValue = currentValue * (1 + change);

            data.push({
                date: format(date, 'yyyy-MM-dd'),
                value: currentValue,
                percentChange: change * 100
            });
        }

        return data;
    }
};
