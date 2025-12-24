import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { useAppStore } from '../../stores/appStore';
import { analyticsService } from '../../services/analytics';
import { benchmarkService } from '../../services/benchmarkService';
import type { Trade, BenchmarkIndex } from '../../types';

interface EquityAlphaChartProps {
    trades: Trade[];
}

export const EquityAlphaChart: React.FC<EquityAlphaChartProps> = ({ trades }) => {
    const { selectedBenchmark, setSelectedBenchmark, activeTimeline } = useAppStore();

    const chartData = useMemo(() => {
        // 1. Filter Trades by Timeline
        const filteredTrades = analyticsService.filterTradesByTimeline(trades, activeTimeline);

        // 2. Get User Equity
        const equityCurve = analyticsService.getEquityCurve(filteredTrades);
        if (equityCurve.length === 0) return [];

        const startEquity = equityCurve[0].value;

        // 3. Get Benchmark Data
        let days = 365;
        if (activeTimeline === 'trailing_1m') days = 30;
        if (activeTimeline === 'trailing_3m') days = 90;
        if (activeTimeline === 'trailing_6m') days = 180;
        if (activeTimeline === 'all_time') days = 365 * 5;

        const benchmarkData = benchmarkService.getBenchmarkData(selectedBenchmark, days);

        // 4. Merge and Calculate % Return
        const benchMap = new Map(benchmarkData.map(b => [b.date, b.value]));
        const startBenchValue = benchmarkData[benchmarkData.length - 1]?.value || 100;

        return equityCurve.map((point) => {
            const dateStr = point.rawDate.split('T')[0];
            const benchVal = benchMap.get(dateStr) || startBenchValue;

            const userReturn = startEquity === 0 ? 0 : ((point.value - startEquity) / Math.abs(startEquity)) * 100;
            const initialBenchForPeriod = benchMap.get(equityCurve[0].rawDate.split('T')[0]) || benchVal;
            const benchBase = initialBenchForPeriod === 0 ? 1 : initialBenchForPeriod;
            const benchReturn = ((benchVal - benchBase) / benchBase) * 100;

            return {
                date: point.date,
                userReturn: parseFloat(userReturn.toFixed(2)),
                benchReturn: parseFloat(benchReturn.toFixed(2)),
                userValue: point.value,
                benchValue: benchVal
            };
        });

    }, [trades, selectedBenchmark, activeTimeline]);

    const benchmarks: BenchmarkIndex[] = ['SPX', 'NDX', 'DJI', 'DAX', 'FTSE'];

    return (
        <div className="glass-card p-6 h-full flex flex-col relative overflow-hidden">
            {/* Subtle background gradient blob */}
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                    <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                        Equity Performance Alpha
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/20">LIVE</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Cumulative Return vs Benchmark</p>
                </div>

                <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
                    {benchmarks.map((b) => (
                        <button
                            key={b}
                            onClick={() => setSelectedBenchmark(b)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${selectedBenchmark === b
                                ? 'bg-gray-800 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {b}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 w-full min-h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="50%" stopColor="#22c55e" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBench" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glow" height="200%" width="200%" x="-50%" y="-50%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#52525b"
                            tick={{ fontSize: 10, fill: '#71717a' }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={40}
                            dy={10}
                        />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fontSize: 10, fill: '#71717a' }}
                            tickFormatter={(val) => `${val}%`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(20, 20, 20, 0.8)',
                                backdropFilter: 'blur(10px)',
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                            labelStyle={{ fontSize: '10px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}
                            formatter={(value: any, name: any) => [
                                <span className={name === 'My Equity' ? 'text-green-400' : 'text-blue-400'}>
                                    {Number(value).toFixed(2)}%
                                </span>,
                                name
                            ]}
                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => <span className="text-gray-400 text-xs font-medium ml-1">{value}</span>}
                        />

                        <Area
                            type="monotone"
                            dataKey="userReturn"
                            name="My Equity"
                            stroke="#22c55e"
                            fillOpacity={1}
                            fill="url(#colorUser)"
                            strokeWidth={3}
                            filter="url(#glow)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="benchReturn"
                            name={selectedBenchmark}
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorBench)"
                            strokeDasharray="4 4"
                            strokeWidth={2}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
