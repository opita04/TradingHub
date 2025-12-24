// Imports removed
// import type { Trade, EnhancedTradeStats } from './core';
// import type { LifestyleEntry } from './lifestyle';

export interface NormalizedDataPoint {
    date: string;
    equity: number;                   // 0-100 normalized
    rawEquity: number;               // Original $ value
    [habitKey: string]: number | string; // Dynamic habit values
}

export interface LifestyleAlphaMetrics {
    habitId: string;
    habitName: string;
    habitType: 'positive' | 'negative';
    alphaScore: number;           // e.g., -0.62 (impact score)
    rValue: number;               // Correlation coefficient (e.g., 0.8852)
    sampleSize: number;           // Number of days in calculation
    currentValue: number;         // Latest value
    trend: 'up' | 'down' | 'stable';
    color: string;
}

export type BenchmarkIndex = 'SPX' | 'NDX' | 'DJI' | 'DAX' | 'FTSE';

export interface BenchmarkDataPoint {
    date: string;
    value: number;
    percentChange: number;
}

export type TimelineWindow =
    | 'trailing_1m'
    | 'trailing_3m'
    | 'trailing_6m'
    | 'trailing_12m'
    | 'ytd'
    | 'all_time'
    | 'custom';

export interface TimelineFilter {
    window: TimelineWindow;
    startDate?: string;
    endDate?: string;
}
