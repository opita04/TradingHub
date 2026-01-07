export interface NormalizedDataPoint {
    date: string;
    equity: number;                   // 0-100 normalized
    rawEquity: number;               // Original $ value
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
