import React from 'react';
import { LineChart, CheckCircle2, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { useAccountStore } from '../../stores/accountStore';
import type { Trade } from '../../types';

// Helper for formatting currency if utility is not available or to be safe
const formatMoney = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const StatCard = ({ title, value, subtext, icon: Icon, trend }: { title: string, value: string, subtext: string, icon?: React.ElementType, trend?: 'up' | 'down' | 'neutral' }) => (
    <div className="bg-surface border border-white/5 rounded-xl p-5 flex flex-col justify-between h-[140px] relative overflow-hidden group hover:border-white/10 transition-colors">
        <div className="flex justify-between items-start z-10">
            <h3 className="text-tertiary text-xs font-medium uppercase tracking-wider">{title}</h3>
            {Icon && <Icon size={16} className="text-tertiary group-hover:text-primary transition-colors" />}
        </div>

        <div className="z-10">
            <div className={`text-2xl font-bold mb-1 ${trend === 'up' ? 'text-profit' :
                trend === 'down' ? 'text-loss' :
                    'text-primary'
                }`}>
                {value}
            </div>
            <div className="text-xs text-tertiary">{subtext}</div>
        </div>

        {/* Background Gradient */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity group-hover:opacity-20 ${trend === 'up' ? 'bg-profit' :
            trend === 'down' ? 'bg-loss' :
                'bg-brand'
            }`} />
    </div>
);

const AccountCard = ({ count, balance, type }: { count?: number, balance?: number, type: 'active' | 'total' | 'avg' }) => (
    <div className="bg-surface border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center group hover:bg-surface-highlight/5 transition-colors">
        {type === 'active' ? (
            <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary mb-1">{count}</span>
                <span className="text-xs text-tertiary uppercase tracking-wide">Active</span>
            </div>
        ) : (
            <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-primary mb-1">{formatMoney(balance || 0)}</span>
                <span className="text-xs text-tertiary uppercase tracking-wide">{type === 'total' ? 'Total Balance' : 'Avg Balance'}</span>
            </div>
        )}
    </div>
);

const RecentActivityItem = ({ trade }: { trade: Trade }) => {
    const isWin = trade.pnl > 0;
    return (
        <div className="flex items-center justify-between py-3 px-4 bg-surface border border-white/5 rounded-lg mb-2 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${isWin ? 'bg-profit' : 'bg-loss'}`} />
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary">{trade.instrument}</span>
                    <span className="text-xs text-tertiary">{trade.direction}</span>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className={`text-sm font-bold ${isWin ? 'text-profit' : 'text-loss'}`}>
                    {formatMoney(trade.pnl)}
                </span>
                <span className="text-xs text-tertiary">
                    {new Date(trade.date).toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

export const Workstation: React.FC = () => {
    const { trades } = useTradeStore();
    const { accounts } = useAccountStore();

    // Calculate Stats
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const losses = trades.filter(t => t.pnl < 0).length; // Assuming 0 PnL is neither or maybe break-even, logic can vary
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0.0';
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);

    const activeAccounts = accounts.filter(a => a.isActive).length;
    const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const avgBalance = activeAccounts > 0 ? totalBalance / activeAccounts : 0;

    // Get recent 5 trades
    const recentTrades = [...trades].sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()).slice(0, 5);

    return (
        <div className="h-full overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-primary mb-1">Trading Summary</h1>
                    <p className="text-tertiary text-sm">Your comprehensive trading overview</p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Trades"
                        value={totalTrades.toString()}
                        subtext="All time"
                        icon={LineChart}
                    />
                    <StatCard
                        title="Win Rate"
                        value={`${winRate}%`}
                        subtext={`${wins}W / ${losses}L`}
                        icon={CheckCircle2}
                        trend={parseFloat(winRate) > 50 ? 'up' : 'neutral'}
                    />
                    <StatCard
                        title="Total P&L"
                        value={formatMoney(totalPnL)}
                        subtext="Cumulative"
                        icon={TrendingUp}
                        trend={totalPnL >= 0 ? 'up' : 'down'}
                    />
                </div>

                {/* Accounts Section */}
                <div>
                    <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                        <Wallet size={16} className="text-brand" />
                        Accounts
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <AccountCard count={activeAccounts} type="active" />
                        <AccountCard balance={totalBalance} type="total" />
                        <AccountCard balance={avgBalance} type="avg" />
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                        <Calendar size={16} className="text-brand" />
                        Recent Activity
                    </h2>
                    <div className="bg-surface/50 rounded-xl border border-white/5 p-4 min-h-[200px]">
                        {recentTrades.length > 0 ? (
                            recentTrades.map(trade => (
                                <RecentActivityItem key={trade.id} trade={trade} />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 text-tertiary">
                                <p className="text-sm">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
