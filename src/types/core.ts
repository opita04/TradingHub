export interface Trade {
    id: string;
    tradeType: 'LIVE' | 'BACKTEST';
    sessionId?: string;
    strategyVersionId?: string;
    date: string;              // ISO date string (YYYY-MM-DD)
    time: string;              // HH:mm format
    instrument: string;        // NQ, ES, MNQ, etc.
    direction: 'long' | 'short';
    session: string;           // NY AM, NY PM, London, Asia
    entryPrice?: number;
    exitPrice?: number;
    positionSize?: number;
    pnl: number;               // Profit/Loss in dollars
    riskReward?: number;
    setup?: string[];          // Array of tags: Breakout, Reversal, etc.
    emotion?: string[];        // Array of tags: Confident, Fearful, etc.
    followedRules: boolean;
    notes?: string;
    screenshots: Screenshot[];

    // New fields for Demon Hunter
    demons?: string[];         // Detected behavioral errors

    // Enhanced trade entry fields
    timeZone?: string;         // e.g., America/New_York
    entryTimeframe?: string;   // e.g., m1, m3, m5, m15, h1
    exitDate?: string;         // ISO date for exit
    exitTime?: string;         // HH:mm for exit
    stopLoss?: number;         // Stop loss price or pips
    takeProfit?: number;       // Take profit price or pips
    usePipsForSL?: boolean;    // If true, stopLoss is in pips
    usePipsForTP?: boolean;    // If true, takeProfit is in pips
    dollarRisk?: number;       // Dollar amount risked
    lotSize?: number;          // Position lot size
    strategyId?: string;       // Linked strategy
    setupQuality?: number;     // 0-100 quality score
    confluences?: string[];    // Setup confluence tags
    chartAnalysis?: ChartAnalysis[]; // Chart screenshots and notes

    accountId?: string;        // Linked account

    createdAt: number;         // Timestamp
    updatedAt: number;         // Timestamp
}

export interface ChartAnalysis {
    id: string;
    screenshotData?: string;   // Base64 or URL
    tradingViewLink?: string;
    notes?: string;
}

export interface Account {
    id: string;
    name: string;
    broker?: string;
    balance: number;
    startingBalance: number;
    currency: string;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface AccountMetrics {
    accountId: string;
    sharpeRatio: number;
    sortinoRatio: number;
    marRatio: number;
    calmarRatio: number;
    totalTrades: number;
    winRate: number;
    breakEvenRate: number;
    avgRMultiple: number;
    profitFactor: number;
    expectancy: number;
    maxDrawdown: number;
    tradesHitTP: number;
    avgRAfterTP: number;
    beTradesCount: number;
    tpAfterBE: number;
}

export interface SetupConfluence {
    id: string;
    name: string;
    description?: string;
    weight: number;  // Contribution to quality score
}

export interface Screenshot {
    id: string;
    data: string;              // Base64 encoded image or URL
    caption?: string;
    order: number;
}

export interface Template {
    id: string;
    name: string;
    type: 'instrument' | 'session' | 'setup' | 'emotion';
    prefill: Partial<Omit<Trade, 'id' | 'createdAt' | 'updatedAt' | 'screenshots'>>;
    color: string;
    icon?: string;
    order?: number;
}

export interface TradeStats {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    totalPnL: number;
    avgWin: number;
    avgLoss: number;
    bestTrade: number;
    worstTrade: number;
    currentStreak: number;
    longestWinStreak: number;
    longestLoseStreak: number;
}

export interface EnhancedTradeStats extends TradeStats {
    netPnL: number;
    avgRiskReward: number;
    dailyAverage: number;
    bestDay: { date: string; pnl: number };
    worstDay: { date: string; pnl: number };
    monthlyPnL: number;
    monthlyPnLPercent: number;
    avgPayout?: number;
    totalInvestment?: number;
    maxDrawdown: number;
    sharpeRatio: number;
    expectancy: number;
}

export interface FilterOptions {
    dateRange: { start: string; end: string } | null;
    instruments: string[];
    sessions: string[];
    setups: string[];
    minPnL?: number;
    maxPnL?: number;
}

export interface PropFirm {
    id: string;
    name: string;
    rating: number; // 1-5
    scaling: string;
    drawdownType: 'Balance' | 'Equity' | 'Relative';
    payout: string;
    status: 'preferred' | 'verified' | 'caution';
    link: string;
    comments?: string; // Additional notes about the firm
}
