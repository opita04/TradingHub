export interface PersonalFinanceEntry {
    id: string;
    date: string;
    type: 'income' | 'expense' | 'asset' | 'liability';
    category: string;
    amount: number;
    description?: string;
    recurring: boolean;
    createdAt: number;
}

export interface AssetAllocation {
    id: string;
    name: string;
    value: number;
    percentage: number;
    type: 'trading' | 'crypto' | 'cash' | 'investment';
    changePercent?: number;
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    color: string;
}

export interface RecurringBill {
    id: string;
    name: string;
    amount: number;
    dueDate: number; // Day of month (1-31)
    category: string;
    isPaid: boolean;
}

export interface NetWorthSnapshot {
    date: string;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
}
