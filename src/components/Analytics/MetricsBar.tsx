import React from 'react';
import { DollarSign, Trophy, TrendingUp, Clock, Zap } from 'lucide-react';
import type { EnhancedTradeStats } from '../../types';
import { CircularProgress } from './CircularProgress';
import { ProgressBar } from '../Common/ProgressBar';
import { SparkLine } from '../Common/SparkLine';
import { AnimatedValue } from '../Common/AnimatedValue';

interface MetricsBarProps {
    stats: EnhancedTradeStats;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ stats }) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
    };

    // Mock sparkline data
    const mockSparkLine1 = [10, 15, 12, 50, 25, 60, 30, 28, 80, 40];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* 1. Financial Overview Card */}
            <div className="glass-card p-6 relative group overflow-hidden flex flex-col justify-between h-full">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] transform translate-x-10 -translate-y-10 group-hover:bg-blue-500/15 transition-all duration-700 pointer-events-none" />

                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-shadow duration-500">
                                <DollarSign size={18} />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-tertiary uppercase tracking-[0.2em] leading-none mb-1">Net P&L</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="text-[9px] text-blue-400 font-semibold uppercase tracking-wide">Live</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-profit/10 border border-profit/20 backdrop-blur-md">
                                <TrendingUp size={10} className="text-profit" />
                                <span className="text-[10px] font-bold text-profit tracking-wide">+12.5%</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 mb-8 relative z-10">
                        <span className={`text-4xl md:text-5xl font-bold tracking-tight ${stats.totalPnL >= 0 ? 'text-primary' : 'text-loss'}`}>
                            {stats.totalPnL >= 0 ? '$' : '-$'}
                            <AnimatedValue value={Math.abs(stats.totalPnL)} formatFn={(v) => v.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5 relative z-10">
                    <div>
                        <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider block mb-1">Avg Payout</span>
                        <span className="text-base font-bold text-primary tracking-tight">{formatCurrency(stats.avgPayout || 2450)}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider block mb-1">Profit Factor</span>
                        <span className="text-base font-bold text-blue-400 tracking-tight">{stats.profitFactor.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* 2. Performance Metrics Card */}
            <div className="glass-card p-6 relative group overflow-hidden flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] transform translate-x-10 -translate-y-10 group-hover:bg-purple-500/15 transition-all duration-700 pointer-events-none" />

                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                <Zap size={18} />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-bold text-tertiary uppercase tracking-[0.2em] leading-none mb-1">Efficiency</h3>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={10} className="text-purple-400" />
                                    <span className="text-[9px] text-purple-400 font-semibold uppercase tracking-wide">45m Avg Duration</span>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <SparkLine data={mockSparkLine1} width={80} height={30} color="#a855f7" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="group/metric">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider">Avg R:R</span>
                                <span className="text-xs font-bold text-purple-400">{stats.avgRiskReward?.toFixed(2) || '2.45'}</span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden backdrop-blur-sm">
                                <ProgressBar value={65} height="h-full" colorClass="bg-gradient-to-r from-purple-600 to-purple-400" animate={false} />
                            </div>
                        </div>
                        <div className="group/metric">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider">Expectancy</span>
                                <span className="text-xs font-bold text-profit">+$124.50</span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-highlight rounded-full overflow-hidden backdrop-blur-sm">
                                <ProgressBar value={80} height="h-full" colorClass="bg-gradient-to-r from-emerald-600 to-emerald-400" animate={false} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-5 mt-auto border-t border-white/5 relative z-10">
                    <div>
                        <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider block mb-1">Best Day</span>
                        <span className="text-base font-bold text-primary tracking-tight">{formatCurrency(stats.bestTrade)}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-semibold text-tertiary uppercase tracking-wider block mb-1">Worst Day</span>
                        <span className="text-base font-bold text-loss tracking-tight">{formatCurrency(stats.worstTrade || -450)}</span>
                    </div>
                </div>
            </div>

            {/* 3. Win Rate Card */}
            <div className="glass-card p-6 relative group overflow-hidden flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-[60px] transform translate-x-10 -translate-y-10 group-hover:bg-brand/15 transition-all duration-700 pointer-events-none" />

                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-brand/10 text-brand border border-brand/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                            <Trophy size={18} />
                        </div>
                        <h3 className="text-[11px] font-bold text-tertiary uppercase tracking-[0.2em] leading-none">Win Rate</h3>
                    </div>
                    <span className="text-[9px] font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/20 tracking-wide">TOP 5%</span>
                </div>

                <div className="flex items-center justify-between mt-4 relative z-10">
                    <div className="space-y-6 flex-1 pr-6">
                        <div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-primary tracking-tighter">
                                    <AnimatedValue value={stats.winRate} />
                                </span>
                                <span className="text-2xl text-tertiary font-light">%</span>
                            </div>
                            <span className="text-[10px] font-medium text-tertiary mt-1 block uppercase tracking-wide">{stats.totalTrades} Total Trades</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-semibold text-secondary uppercase tracking-wider">
                                <span className="text-brand">Wins</span>
                                <span className="text-tertiary">Losses</span>
                            </div>
                            <div className="flex h-2 w-full bg-surface-highlight rounded-full overflow-hidden backdrop-blur-sm">
                                <div style={{ width: `${stats.winRate}%` }} className="bg-gradient-to-r from-brand to-cyan-300 h-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                                <div style={{ width: `${100 - stats.winRate}%` }} className="bg-white/5 h-full" />
                            </div>
                        </div>
                    </div>

                    <div className="relative group-hover:scale-105 transition-transform duration-700 ease-out">
                        <div className="relative z-10 filter drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <CircularProgress
                                value={stats.winRate}
                                size={100}
                                strokeWidth={8}
                                color="#06B6D4"
                            />
                        </div>
                        {/* Inner glow for ring */}
                        <div className="absolute inset-0 bg-brand/5 rounded-full blur-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};
