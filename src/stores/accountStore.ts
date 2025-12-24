import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Account, AccountMetrics, Trade } from '../types';

interface AccountStore {
    accounts: Account[];
    selectedAccountId: string | null;
    balanceHistory: Record<string, { date: string; balance: number }[]>;

    // Actions
    addAccount: (name: string, broker?: string, startingBalance?: number, currency?: string) => void;
    selectAccount: (id: string | null) => void;
    updateAccount: (id: string, updates: Partial<Account>) => void;
    deleteAccount: (id: string) => void;
    updateBalance: (accountId: string, balance: number) => void;

    // Getters
    getSelectedAccount: () => Account | null;
    getAccountMetrics: (accountId: string, trades?: Trade[]) => AccountMetrics;
}

const DEFAULT_METRICS: AccountMetrics = {
    accountId: '',
    sharpeRatio: 0,
    sortinoRatio: 0,
    marRatio: 0,
    calmarRatio: 0,
    totalTrades: 0,
    winRate: 0,
    breakEvenRate: 0,
    avgRMultiple: 0,
    profitFactor: 0,
    expectancy: 0,
    maxDrawdown: 0,
    tradesHitTP: 0,
    avgRAfterTP: 0,
    beTradesCount: 0,
    tpAfterBE: 0
};

// Calculate metrics from an array of trades
function calculateMetricsFromTrades(accountId: string, trades: Trade[]): AccountMetrics {
    if (trades.length === 0) {
        return { ...DEFAULT_METRICS, accountId };
    }

    // Filter trades for this account
    const accountTrades = trades.filter(t => t.accountId === accountId);

    if (accountTrades.length === 0) {
        return { ...DEFAULT_METRICS, accountId };
    }

    const totalTrades = accountTrades.length;
    const wins = accountTrades.filter(t => t.pnl > 0);
    const losses = accountTrades.filter(t => t.pnl < 0);
    const breakEvens = accountTrades.filter(t => t.pnl === 0);

    // Basic metrics
    const winRate = (wins.length / totalTrades) * 100;
    const breakEvenRate = (breakEvens.length / totalTrades) * 100;

    // P&L calculations
    const totalWins = wins.reduce((sum, t) => sum + t.pnl, 0);
    const totalLosses = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins > 0 ? Infinity : 0;

    // Expectancy: (Win% * Avg Win) - (Loss% * Avg Loss)
    const avgWin = wins.length > 0 ? totalWins / wins.length : 0;
    const avgLoss = losses.length > 0 ? totalLosses / losses.length : 0;
    const winPct = wins.length / totalTrades;
    const lossPct = losses.length / totalTrades;
    const expectancy = (winPct * avgWin) - (lossPct * avgLoss);

    // R-Multiple calculations
    const tradesWithR = accountTrades.filter(t => t.riskReward !== undefined);
    const avgRMultiple = tradesWithR.length > 0
        ? tradesWithR.reduce((sum, t) => sum + (t.riskReward || 0), 0) / tradesWithR.length
        : 0;

    // Max Drawdown calculation
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;

    // Sort by date for proper drawdown calculation
    const sortedTrades = [...accountTrades].sort((a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    );

    for (const trade of sortedTrades) {
        cumulative += trade.pnl;
        if (cumulative > peak) {
            peak = cumulative;
        }
        const drawdown = peak - cumulative;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    // Risk-adjusted ratios (simplified calculations)
    const pnlArray = sortedTrades.map(t => t.pnl);
    const avgReturn = pnlArray.reduce((a, b) => a + b, 0) / pnlArray.length;

    // Standard deviation of returns
    const variance = pnlArray.reduce((sum, pnl) => sum + Math.pow(pnl - avgReturn, 2), 0) / pnlArray.length;
    const stdDev = Math.sqrt(variance);

    // Downside deviation (only negative returns)
    const negativeReturns = pnlArray.filter(r => r < 0);
    const downsideVariance = negativeReturns.length > 0
        ? negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length
        : 0;
    const downsideDev = Math.sqrt(downsideVariance);

    // Sharpe Ratio (simplified - assumes 0 risk-free rate, uses absolute returns)
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;

    // Sortino Ratio (uses downside deviation)
    const sortinoRatio = downsideDev > 0 ? avgReturn / downsideDev : avgReturn > 0 ? 2 : 0;

    // MAR Ratio (Return / Max Drawdown)
    const totalReturn = pnlArray.reduce((a, b) => a + b, 0);
    const marRatio = maxDrawdown > 0 ? totalReturn / maxDrawdown : totalReturn > 0 ? 2 : 0;

    // Calmar Ratio (similar to MAR, typically annualized - we'll use raw values)
    const calmarRatio = marRatio;

    // TP/BE tracking
    const tradesHitTP = accountTrades.filter(t => t.takeProfit && t.exitPrice &&
        ((t.direction === 'long' && t.exitPrice >= t.takeProfit) ||
            (t.direction === 'short' && t.exitPrice <= t.takeProfit))
    ).length;

    return {
        accountId,
        sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
        sortinoRatio: parseFloat(sortinoRatio.toFixed(2)),
        marRatio: parseFloat(marRatio.toFixed(2)),
        calmarRatio: parseFloat(calmarRatio.toFixed(2)),
        totalTrades,
        winRate: parseFloat(winRate.toFixed(1)),
        breakEvenRate: parseFloat(breakEvenRate.toFixed(1)),
        avgRMultiple: parseFloat(avgRMultiple.toFixed(2)),
        profitFactor: profitFactor === Infinity ? 999 : parseFloat(profitFactor.toFixed(2)),
        expectancy: parseFloat(expectancy.toFixed(2)),
        maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
        tradesHitTP,
        avgRAfterTP: 0, // Would need more data to calculate
        beTradesCount: breakEvens.length,
        tpAfterBE: 0 // Would need more data to calculate
    };
}

export const useAccountStore = create<AccountStore>()(
    persist(
        (set, get) => ({
            accounts: [],
            selectedAccountId: null,
            balanceHistory: {},

            addAccount: (name, broker, startingBalance = 0, currency = 'USD') => {
                const newAccount: Account = {
                    id: uuidv4(),
                    name,
                    broker,
                    balance: startingBalance,
                    startingBalance,
                    currency,
                    isActive: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };

                set((state) => ({
                    accounts: [...state.accounts, newAccount],
                    selectedAccountId: state.selectedAccountId || newAccount.id
                }));
            },

            selectAccount: (id) => {
                set({ selectedAccountId: id });
            },

            updateAccount: (id, updates) => {
                set((state) => ({
                    accounts: state.accounts.map((acc) =>
                        acc.id === id
                            ? { ...acc, ...updates, updatedAt: Date.now() }
                            : acc
                    )
                }));
            },

            deleteAccount: (id) => {
                set((state) => ({
                    accounts: state.accounts.filter((acc) => acc.id !== id),
                    selectedAccountId:
                        state.selectedAccountId === id
                            ? state.accounts.find((a) => a.id !== id)?.id || null
                            : state.selectedAccountId
                }));
            },

            updateBalance: (accountId, balance) => {
                const today = new Date().toISOString().split('T')[0];

                set((state) => {
                    const history = state.balanceHistory[accountId] || [];
                    const existingIndex = history.findIndex((h) => h.date === today);

                    const newHistory =
                        existingIndex >= 0
                            ? history.map((h, i) =>
                                i === existingIndex ? { ...h, balance } : h
                            )
                            : [...history, { date: today, balance }];

                    return {
                        balanceHistory: {
                            ...state.balanceHistory,
                            [accountId]: newHistory
                        },
                        accounts: state.accounts.map((acc) =>
                            acc.id === accountId
                                ? { ...acc, balance, updatedAt: Date.now() }
                                : acc
                        )
                    };
                });
            },

            getSelectedAccount: () => {
                const { accounts, selectedAccountId } = get();
                return accounts.find((a) => a.id === selectedAccountId) || null;
            },

            getAccountMetrics: (accountId, trades = []) => {
                return calculateMetricsFromTrades(accountId, trades);
            }
        }),
        {
            name: 'account-storage'
        }
    )
);
