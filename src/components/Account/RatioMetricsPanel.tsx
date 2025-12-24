import React, { useMemo } from 'react';
import { useAccountStore } from '../../stores/accountStore';
import { useTradeStore } from '../../stores/tradeStore';

interface RatioMetricProps {
    label: string;
    value: number;
    color: string;
}

const RatioMetric: React.FC<RatioMetricProps> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <span className="text-sm text-secondary">{label}</span>
            <span className={`text-sm font-bold ${color}`}>{value.toFixed(2)}</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
            <div
                className={`h-full ${color === 'text-loss' ? 'bg-loss' : 'bg-brand'} transition-all`}
                style={{ width: `${Math.min(Math.abs(value) * 20, 100)}%` }}
            />
        </div>
    </div>
);

export const RatioMetricsPanel: React.FC = () => {
    const selectedAccountId = useAccountStore((state) => state.selectedAccountId);
    const getAccountMetrics = useAccountStore((state) => state.getAccountMetrics);
    const trades = useTradeStore((state) => state.trades);

    // Calculate metrics for selected account
    const accountMetrics = useMemo(() => {
        if (!selectedAccountId) return null;
        return getAccountMetrics(selectedAccountId, trades);
    }, [selectedAccountId, trades, getAccountMetrics]);

    const getColor = (value: number) => value > 0 ? 'text-brand' : value < 0 ? 'text-loss' : 'text-tertiary';

    const metrics = [
        { label: 'Sharpe Ratio', value: accountMetrics?.sharpeRatio ?? 0, color: getColor(accountMetrics?.sharpeRatio ?? 0) },
        { label: 'Sortino Ratio', value: accountMetrics?.sortinoRatio ?? 0, color: getColor(accountMetrics?.sortinoRatio ?? 0) },
        { label: 'MAR Ratio', value: accountMetrics?.marRatio ?? 0, color: getColor(accountMetrics?.marRatio ?? 0) },
        { label: 'Calmar Ratio', value: accountMetrics?.calmarRatio ?? 0, color: getColor(accountMetrics?.calmarRatio ?? 0) },
    ];

    return (
        <div className="glass-card p-4 space-y-6">
            {metrics.map((metric) => (
                <RatioMetric
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    color={metric.color}
                />
            ))}
        </div>
    );
};
