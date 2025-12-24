import React, { useMemo } from 'react';
import { useAccountStore } from '../../stores/accountStore';
import { useTradeStore } from '../../stores/tradeStore';

export const AccountStatsGrid: React.FC = () => {
    const accounts = useAccountStore((state) => state.accounts);
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
    const getAccountMetrics = useAccountStore((state) => state.getAccountMetrics);
    const trades = useTradeStore((state) => state.trades);

    const selectedAccount = useMemo(() =>
        accounts.find(a => a.id === selectedAccountId) || null
        , [accounts, selectedAccountId]);

    // Calculate metrics for the selected account
    const metrics = useMemo(() => {
        if (!selectedAccountId) return null;
        return getAccountMetrics(selectedAccountId, trades);
    }, [selectedAccountId, trades, getAccountMetrics]);

    const statCards = [
        { label: 'Total Trades', value: (metrics?.totalTrades ?? 0).toString(), color: 'text-primary' },
        { label: 'Win Rate', value: `${(metrics?.winRate ?? 0).toFixed(1)}%`, color: 'text-primary' },
        { label: 'Break Even Rate', value: `${(metrics?.breakEvenRate ?? 0).toFixed(1)}%`, color: 'text-primary' },
        { label: 'Avg R-Multiple', value: `${(metrics?.avgRMultiple ?? 0).toFixed(2)}R`, color: 'text-primary' },
    ];

    // Calculate total P&L from account trades
    const accountTrades = useMemo(() =>
        selectedAccount ? trades.filter(t => t.accountId === selectedAccount.id) : []
        , [trades, selectedAccount]);

    const totalPnL = accountTrades.reduce((sum, t) => sum + t.pnl, 0);

    const secondaryStats = [
        { label: 'Total P/L', value: `$${totalPnL.toFixed(2)}`, color: totalPnL >= 0 ? 'text-profit' : 'text-loss' },
        { label: 'Profit Factor', value: (metrics?.profitFactor ?? 0).toFixed(2), color: 'text-primary' },
        { label: 'Expectancy', value: `$${(metrics?.expectancy ?? 0).toFixed(2)}`, color: (metrics?.expectancy ?? 0) >= 0 ? 'text-profit' : 'text-loss' },
        { label: 'Max Drawdown', value: `$${(metrics?.maxDrawdown ?? 0).toFixed(2)}`, color: 'text-loss' },
    ];

    return (
        <div className="space-y-4">
            {/* Primary Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-xs text-tertiary mb-1">{stat.label}</div>
                        <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5">
                {secondaryStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                        <div className="text-xs text-tertiary mb-1">{stat.label}</div>
                        <div className={`text-lg font-semibold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
