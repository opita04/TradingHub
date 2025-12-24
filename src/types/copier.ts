// Trade Copier Types
export interface CopierGroup {
    id: string;
    name: string;
    isActive: boolean;
    riskMode: 'multiplier' | 'fixed_lot' | 'balance_percent';
    multiplier: number;
    masterAccountId: string;
    slaveAccountIds: string[];
}

export interface TradingAccount {
    id: string;
    name: string;
    broker: string;
    accountNumber: string;
    balance: number;
    equity: number;
    type: 'master' | 'slave';
    platform: 'mt4' | 'mt5' | 'ctrader' | 'dx';
    status: 'active' | 'disconnected';
    latency?: number;
}

// Strategy Lab Types
export interface Strategy {
    id: string;
    name: string;
    type: 'scalper' | 'swing' | 'mean_reversion' | 'trend';
    status: 'hypothesis' | 'data_integrity' | 'forward_testing' | 'live' | 'paused';
    progress: number; // 0-100 for dev stage

    // Performance metrics
    winRate: number;
    profitFactor: number;
    returnPercent: number;
    maxDrawdown: number;
    totalTrades: number;
    equityCurve: { date: string; value: number }[];

    // Dev metadata
    hypothesis?: string;
    dataRange?: string;
    notes?: string;
}

// Demon Hunter Types
export interface BehavioralDemon {
    id: string;
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    frequency: number; // Percentage or count
    impact: number; // estimated dollar loss
    detectedCount: number;
    timeline: { date: string; detected: boolean }[];
}
