import React, { useMemo, useState } from 'react';
import { Ghost, TrendingUp, Zap } from 'lucide-react';
import { useTradeStore } from '../../stores/tradeStore';
import { DEMONS } from '../TradeEntry/tabs/DemonTab';

type TimeFilter = 'this_month' | 'last_month' | 'all_time';

export const DemonHunter: React.FC = () => {
    const trades = useTradeStore(state => state.trades);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('this_month');

    // Filter trades by time period
    const filteredTrades = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return trades.filter(trade => {
            const tradeDate = new Date(trade.date);

            switch (timeFilter) {
                case 'this_month':
                    return tradeDate.getMonth() === currentMonth && tradeDate.getFullYear() === currentYear;
                case 'last_month': {
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return tradeDate.getMonth() === lastMonth && tradeDate.getFullYear() === lastMonthYear;
                }
                case 'all_time':
                    return true;
                default:
                    return true;
            }
        });
    }, [trades, timeFilter]);

    // Aggregate demon data from trades
    const demonStats = useMemo(() => {
        const demonCounts: Record<string, { count: number; lastOccurrence: string; affectedTrades: Set<string> }> = {};

        filteredTrades.forEach(trade => {
            (trade.demons || []).forEach(demonId => {
                if (!demonCounts[demonId]) {
                    demonCounts[demonId] = { count: 0, lastOccurrence: '', affectedTrades: new Set() };
                }
                demonCounts[demonId].count++;
                demonCounts[demonId].affectedTrades.add(trade.id);

                // Track most recent occurrence
                if (!demonCounts[demonId].lastOccurrence || trade.date > demonCounts[demonId].lastOccurrence) {
                    demonCounts[demonId].lastOccurrence = trade.date;
                }
            });
        });

        return demonCounts;
    }, [filteredTrades]);

    // Calculate summary stats
    const summaryStats = useMemo(() => {
        const totalDemons = Object.values(demonStats).reduce((sum, d) => sum + d.count, 0);
        const uniqueDemons = Object.keys(demonStats).length;
        const tradesWithDemons = filteredTrades.filter(t => (t.demons?.length || 0) > 0).length;
        const improvementScore = filteredTrades.length > 0
            ? Math.round(((filteredTrades.length - tradesWithDemons) / filteredTrades.length) * 100)
            : 100;

        // Find top demon
        let topDemon = { id: '', count: 0 };
        Object.entries(demonStats).forEach(([id, data]) => {
            if (data.count > topDemon.count) {
                topDemon = { id, count: data.count };
            }
        });

        const topDemonInfo = DEMONS.find(d => d.id === topDemon.id);

        return {
            totalDemons,
            uniqueDemons,
            improvementScore,
            topDemon: topDemonInfo?.name || 'None',
            topDemonCount: topDemon.count
        };
    }, [demonStats, filteredTrades]);

    // Get demon list with full data
    const demonList = useMemo(() => {
        return DEMONS
            .filter(demon => demonStats[demon.id])
            .map(demon => {
                const stats = demonStats[demon.id];
                const affectedPercent = filteredTrades.length > 0
                    ? ((stats.affectedTrades.size / filteredTrades.length) * 100).toFixed(1)
                    : '0';

                return {
                    ...demon,
                    count: stats.count,
                    affectedPercent,
                    affectedCount: stats.affectedTrades.size,
                    totalTrades: filteredTrades.length,
                    lastOccurrence: stats.lastOccurrence,
                    percentOfTotal: summaryStats.totalDemons > 0
                        ? ((stats.count / summaryStats.totalDemons) * 100).toFixed(1)
                        : '0'
                };
            })
            .sort((a, b) => b.count - a.count);
    }, [demonStats, filteredTrades, summaryStats.totalDemons]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Ghost size={28} className="text-orange-500" />
                    <div>
                        <h1 className="text-xl font-bold text-white">Demon Hunter</h1>
                        <p className="text-sm text-gray-400">Track and conquer your trading behavioral demons</p>
                    </div>
                </div>

                {/* Time Filter Buttons */}
                <div className="flex gap-2">
                    {[
                        { id: 'this_month' as TimeFilter, label: 'This Month' },
                        { id: 'last_month' as TimeFilter, label: 'Last Month' },
                        { id: 'all_time' as TimeFilter, label: 'All Time' }
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setTimeFilter(filter.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeFilter === filter.id
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Demons */}
                <div className="bg-[#1a1a1c] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Ghost size={16} />
                        <span>Total Demons</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{summaryStats.totalDemons}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {timeFilter === 'this_month' ? 'This month' : timeFilter === 'last_month' ? 'Last month' : 'All time'}
                    </div>
                </div>

                {/* Unique Demons */}
                <div className="bg-[#1a1a1c] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Ghost size={16} />
                        <span>Unique Demons</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{summaryStats.uniqueDemons}</div>
                    <div className="text-xs text-gray-500 mt-1">Out of 8 possible</div>
                </div>

                {/* Improvement Score */}
                <div className="bg-[#1a1a1c] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <TrendingUp size={16} />
                        <span>Improvement Score</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{summaryStats.improvementScore}%</div>
                    <div className="text-xs text-gray-500 mt-1">% of trades without demons</div>
                </div>

                {/* Top Demon */}
                <div className="bg-[#1a1a1c] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Ghost size={16} />
                        <span>{timeFilter === 'this_month' ? 'This Month' : timeFilter === 'last_month' ? 'Last Month' : 'All Time'}</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{summaryStats.topDemonCount}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        Highest demon count<br />
                        <span className="text-orange-400">{summaryStats.topDemon}</span>
                    </div>
                </div>
            </div>

            {/* Demon List */}
            <div className="bg-[#1a1a1c] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Ghost size={20} className="text-white/60" />
                    <h2 className="text-lg font-semibold text-white">Your Trading Demons</h2>
                </div>

                {demonList.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Ghost size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No demons detected in this period.</p>
                        <p className="text-sm mt-1">Keep trading demon-free!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {demonList.map(demon => (
                            <div
                                key={demon.id}
                                className="bg-[#0d0d0e] border border-white/5 rounded-xl p-5 hover:border-orange-500/20 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Demon Name with Icon */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap size={18} className="text-orange-500" />
                                            <h3 className="text-white font-semibold">{demon.name}</h3>
                                            <TrendingUp size={14} className="text-gray-500" />
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-400 mb-3">{demon.description}</p>

                                        {/* Stats */}
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div>
                                                <span className="text-orange-400">Affected {demon.affectedPercent}%</span>
                                                <span> of your trades ({demon.affectedCount}/{demon.totalTrades})</span>
                                            </div>
                                            <div>Last occurrence: {formatDate(demon.lastOccurrence)}</div>
                                        </div>
                                    </div>

                                    {/* Count & Progress */}
                                    <div className="text-right ml-6 min-w-[80px]">
                                        <div className="text-2xl font-bold text-white">{demon.count}</div>
                                        <div className="text-xs text-gray-500">{demon.percentOfTotal}%</div>
                                        <div className="h-1 w-16 bg-gray-800 rounded-full mt-2 overflow-hidden ml-auto">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${demon.percentOfTotal}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
