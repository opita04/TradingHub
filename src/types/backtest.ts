export type SessionMode = 'TIME' | 'SAMPLE';
export type SessionStatus = 'ACTIVE' | 'COMPLETED' | 'ABORTED';
export type TradeOutcome = 'WIN' | 'LOSS' | 'BE';

export interface StrategySnapshot {
    id: string;
    name: string;
    type: string;
    rules?: string;
}

export interface BacktestSession {
    id: string;
    strategyId: string;
    strategyVersionId: string;
    strategySnapshot: StrategySnapshot;
    market: string;
    timeframe: string;
    mode: SessionMode;
    target: number;
    startTime: number; // Timestamp
    endTime?: number;  // Timestamp
    status: SessionStatus;
}

export interface BacktestTradeLog {
    setupPresent: boolean;
    entryValid: boolean;
    outcome: TradeOutcome;
    rMultiple?: number;
    screenshots?: string[]; // Base64 or URL
}
