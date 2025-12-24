import React from 'react';
import { BalanceHistoryChart } from './BalanceHistoryChart';
import { AccountStatsGrid } from './AccountStatsGrid';
import { RatioMetricsPanel } from './RatioMetricsPanel';
import { TradingCalendar } from './TradingCalendar';
import { AnalysisCards } from './AnalysisCards';
import { useAccountStore } from '../../stores/accountStore';

export const AccountPage: React.FC = () => {
    const { addAccount, accounts } = useAccountStore();

    // Create a demo account if none exist
    React.useEffect(() => {
        if (accounts.length === 0) {
            addAccount('Aoex', 'Demo Broker', 10000);
        }
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left/Center Column - Charts and Stats */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Balance History */}
                    <BalanceHistoryChart />

                    {/* Stats Grid */}
                    <div className="glass-card p-6">
                        <AccountStatsGrid />
                    </div>

                    {/* Analysis Cards */}
                    <AnalysisCards />
                </div>

                {/* Right Column - Metrics and Calendar */}
                <div className="space-y-6">
                    {/* Ratio Metrics */}
                    <RatioMetricsPanel />

                    {/* Trading Calendar */}
                    <TradingCalendar />
                </div>
            </div>
        </div>
    );
};
