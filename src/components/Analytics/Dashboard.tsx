import { useMemo } from 'react';
import { useTradeStore } from '../../stores/tradeStore';
import { analyticsService } from '../../services/analytics';
import { HUDCard } from './HUDCard';
import { EquityAlphaChart } from './EquityAlphaChart';
import { BalanceHeader } from './BalanceHeader';
import { CalendarHeatMap } from './CalendarHeatMap';
import { RecentTradesWidget } from './RecentTradesWidget';

export function Dashboard() {
    const trades = useTradeStore((state) => state.trades);

    const stats = useMemo(() => {
        return analyticsService.calculateStats(trades);
    }, [trades]);

    return (
        <div className="w-full mx-auto space-y-6 pb-20">
            {/* Header Section */}
            <div className="space-y-6">
                <BalanceHeader />
            </div>

            {/* Bento Grid Layout - HUD Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HUDCard
                    title="Win Rate"
                    value={`${stats.winRate}%`}
                    change={2.5}
                    status="profit"
                    data={[40, 45, 55, 60, 58, 65, 70]}
                />
                <HUDCard
                    title="Profit Factor"
                    value={`${stats.profitFactor}`}
                    change={-0.1}
                    status={stats.profitFactor > 1.5 ? 'profit' : 'neutral'}
                    data={[20, 25, 22, 30, 28, 35, 32]}
                />
                <HUDCard
                    title="Avg Return"
                    value={`$${stats.avgWin}`}
                    change={12.4}
                    status="profit"
                    data={[50, 60, 55, 70, 65, 80, 75]}
                />
                <HUDCard
                    title="P&L (30d)"
                    value="42%"
                    change={3.2}
                    status="profit"
                    data={[30, 40, 35, 50, 45, 60, 80]}
                />
            </div>

            {/* Main Content Grid - Masonry style with CSS Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column: Charts (2/3 width) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass-panel p-1 rounded-xl">
                        <EquityAlphaChart trades={trades} />
                    </div>
                </div>

                {/* Right Column: Widgets (1/3 width) */}
                <div className="space-y-6">
                    <div className="glass-panel p-4 rounded-xl">
                        <CalendarHeatMap />
                    </div>
                    <div className="glass-panel p-0 rounded-xl overflow-hidden">
                        <RecentTradesWidget />
                    </div>
                </div>
            </div>
        </div>
    );
}
