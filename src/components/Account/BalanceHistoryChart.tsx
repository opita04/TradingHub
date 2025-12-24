import React, { useMemo } from 'react';
import { useAccountStore } from '../../stores/accountStore';
import { format } from 'date-fns';

export const BalanceHistoryChart: React.FC = () => {
    const accounts = useAccountStore((state) => state.accounts);
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
    const balanceHistoryMap = useAccountStore((state) => state.balanceHistory);

    const selectedAccount = useMemo(() =>
        accounts.find(a => a.id === selectedAccountId) || null
        , [accounts, selectedAccountId]);

    const balanceHistory = useMemo(() =>
        selectedAccount ? balanceHistoryMap[selectedAccount.id] || [] : []
        , [balanceHistoryMap, selectedAccount]);

    const hasData = balanceHistory.length > 0;

    if (!hasData) {
        return (
            <div className="glass-card p-6 h-64 flex items-center justify-center">
                <p className="text-sm text-tertiary">
                    Not enough trade data to display balance history
                </p>
            </div>
        );
    }

    // Calculate chart dimensions
    const width = 100;
    const height = 100;
    const padding = 10;

    const values = balanceHistory.map(h => h.balance);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    // Generate SVG path
    const points = balanceHistory.map((point, index) => {
        const x = padding + (index / (balanceHistory.length - 1 || 1)) * (width - padding * 2);
        const y = height - padding - ((point.balance - minValue) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

    const lastBalance = balanceHistory[balanceHistory.length - 1]?.balance || 0;
    const firstBalance = balanceHistory[0]?.balance || 0;
    const change = lastBalance - firstBalance;
    const changePercent = firstBalance ? ((change / firstBalance) * 100).toFixed(2) : '0.00';

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-2xl font-bold text-primary">
                        ${lastBalance.toLocaleString()}
                    </div>
                    <div className={`text-sm ${change >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {change >= 0 ? '+' : ''}{changePercent}%
                    </div>
                </div>
                <div className="text-xs text-tertiary">
                    {format(new Date(balanceHistory[0].date), 'MMM d')} - {format(new Date(balanceHistory[balanceHistory.length - 1].date), 'MMM d, yyyy')}
                </div>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
                {/* Gradient */}
                <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={change >= 0 ? '#10B981' : '#EF4444'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={change >= 0 ? '#10B981' : '#EF4444'} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area fill */}
                <path d={areaD} fill="url(#balanceGradient)" />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={change >= 0 ? '#10B981' : '#EF4444'}
                    strokeWidth="1.5"
                />
            </svg>
        </div>
    );
};
