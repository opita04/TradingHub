import type { Trade, EnhancedTradeStats, TimelineWindow } from '../types/index';
import { format, subDays, startOfYear, isAfter } from 'date-fns';

export const analyticsService = {
    filterTradesByTimeline: (trades: Trade[], timeline: TimelineWindow): Trade[] => {
        const now = new Date();
        let startDate: Date;

        switch (timeline) {
            case 'trailing_1m': startDate = subDays(now, 30); break;
            case 'trailing_3m': startDate = subDays(now, 90); break;
            case 'trailing_6m': startDate = subDays(now, 180); break;
            case 'trailing_12m': startDate = subDays(now, 365); break;
            case 'ytd': startDate = startOfYear(now); break;
            case 'all_time': return trades;
            default: return trades;
        }

        return trades.filter(t => isAfter(new Date(t.date), startDate));
    },

    calculateStats: (trades: Trade[]): EnhancedTradeStats => {
        const emptyStats: EnhancedTradeStats = {
            totalTrades: 0,
            winRate: 0,
            profitFactor: 0,
            totalPnL: 0,
            netPnL: 0,
            avgWin: 0,
            avgLoss: 0,
            bestTrade: 0,
            worstTrade: 0,
            currentStreak: 0,
            longestWinStreak: 0,
            longestLoseStreak: 0,
            avgRiskReward: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            expectancy: 0,
            dailyAverage: 0,
            bestDay: { date: '', pnl: 0 },
            worstDay: { date: '', pnl: 0 },
            monthlyPnL: 0,
            monthlyPnLPercent: 0,
            avgPayout: 0
        };

        if (trades.length === 0) return emptyStats;

        const wins = trades.filter(t => t.pnl > 0);
        const losses = trades.filter(t => t.pnl <= 0);

        const totalWinAmount = wins.reduce((sum, t) => sum + t.pnl, 0);
        const totalLossAmount = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0));
        const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

        // Sorting
        const sortedTrades = [...trades].sort((a, b) => a.createdAt - b.createdAt);

        // Streaks
        let currentStreak = 0;
        let maxWinStreak = 0;
        let maxLoseStreak = 0;
        let tempWinStreak = 0;
        let tempLoseStreak = 0;

        sortedTrades.forEach(t => {
            if (t.pnl > 0) {
                tempWinStreak++;
                tempLoseStreak = 0;
                if (currentStreak < 0) currentStreak = 1; else currentStreak++;
            } else {
                tempLoseStreak++;
                tempWinStreak = 0;
                if (currentStreak > 0) currentStreak = -1; else currentStreak--;
            }
            maxWinStreak = Math.max(maxWinStreak, tempWinStreak);
            maxLoseStreak = Math.max(maxLoseStreak, tempLoseStreak);
        });

        // Daily Stats
        const dailyPnL = new Map<string, number>();
        sortedTrades.forEach(t => {
            const date = t.date; // already YYYY-MM-DD
            dailyPnL.set(date, (dailyPnL.get(date) || 0) + t.pnl);
        });

        const dailyValues = Array.from(dailyPnL.entries()).map(([date, pnl]) => ({ date, pnl }));
        const bestDay = dailyValues.reduce((best, current) => current.pnl > best.pnl ? current : best, { date: '', pnl: -Infinity });
        const worstDay = dailyValues.reduce((worst, current) => current.pnl < worst.pnl ? current : worst, { date: '', pnl: Infinity });
        const dailyAverage = dailyValues.length > 0 ? totalPnL / dailyValues.length : 0;

        // Max Drawdown
        let peak = -Infinity;
        let maxDD = 0;
        let runningPnL = 0;

        // Assume starting capital of 0 for drawdown relative to profit only, or we need balance. 
        // Using cumulative PnL relative drawdown.
        sortedTrades.forEach(t => {
            runningPnL += t.pnl;
            if (runningPnL > peak) peak = runningPnL;
            const dd = peak - runningPnL;
            if (dd > maxDD) maxDD = dd;
        });

        // Risk Reward
        const avgWin = wins.length > 0 ? totalWinAmount / wins.length : 0;
        const avgLoss = losses.length > 0 ? totalLossAmount / losses.length : 0;
        const avgRiskReward = avgLoss !== 0 ? avgWin / avgLoss : 0;

        // Expectancy
        const winRate = wins.length / trades.length;
        const lossRate = losses.length / trades.length;
        const expectancy = (winRate * avgWin) - (lossRate * avgLoss);

        // Sharpe (simplified: Mean Daily Return / StdDev of Daily Returns) * sqrt(252)
        let sharpeRatio = 0;
        if (dailyValues.length > 1) {
            const mean = dailyValues.reduce((sum, d) => sum + d.pnl, 0) / dailyValues.length;
            const variance = dailyValues.reduce((sum, d) => sum + Math.pow(d.pnl - mean, 2), 0) / dailyValues.length;
            const stdDev = Math.sqrt(variance);
            if (stdDev !== 0) sharpeRatio = (mean / stdDev) * Math.sqrt(252);
        }

        return {
            totalTrades: trades.length,
            winRate: winRate * 100,
            profitFactor: totalLossAmount === 0 ? totalWinAmount : totalWinAmount / totalLossAmount,
            totalPnL,
            netPnL: totalPnL,
            avgWin,
            avgLoss,
            bestTrade: Math.max(...trades.map(t => t.pnl)),
            worstTrade: Math.min(...trades.map(t => t.pnl)),
            currentStreak,
            longestWinStreak: maxWinStreak,
            longestLoseStreak: maxLoseStreak,
            avgRiskReward,
            maxDrawdown: maxDD,
            sharpeRatio,
            expectancy,
            dailyAverage,
            bestDay: bestDay.date ? bestDay : { date: '-', pnl: 0 },
            worstDay: worstDay.date ? worstDay : { date: '-', pnl: 0 },
            monthlyPnL: 0, // Placeholder needs more logic
            monthlyPnLPercent: 0,
            avgPayout: avgWin // keeping as avgWin for now
        };
    },

    getEquityCurve: (trades: Trade[]) => {
        const sortedTrades = [...trades].sort((a, b) => a.createdAt - b.createdAt);
        let runningPnL = 0;

        return sortedTrades.map(t => {
            runningPnL += t.pnl;
            return {
                date: format(new Date(t.date), 'MMM d'),
                value: runningPnL,
                rawDate: t.date
            };
        });
    },

    getPerformanceByInstrument: (trades: Trade[]) => {
        const map = new Map<string, number>();
        trades.forEach(t => {
            const current = map.get(t.instrument) || 0;
            map.set(t.instrument, current + t.pnl);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    },

    getPerformanceBySession: (trades: Trade[]) => {
        const map = new Map<string, number>();
        trades.forEach(t => {
            const session = t.session || 'Unknown';
            const current = map.get(session) || 0;
            map.set(session, current + t.pnl);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    },

    // --- Advanced Analytics ---

    normalizeData: (data: number[]): number[] => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        if (max === min) return data.map(() => 50); // Flat line

        return data.map(val => ((val - min) / (max - min)) * 100);
    }
};

