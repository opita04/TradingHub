import React from 'react';
import { Bell, Plus, Download, Layout, Palette, Filter } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { useBacktestStore } from '../../stores/backtestStore';

export const Header: React.FC = () => {
    const { activeTab, setNewTradeModalOpen } = useAppStore();
    const { currentSession } = useBacktestStore();
    const isSessionActive = currentSession?.status === 'ACTIVE';

    const getTitle = () => {
        switch (activeTab) {
            case 'overview': return 'Dashboard';
            case 'journal': return 'Reflection Journal';
            case 'demon-hunter': return 'Demon Hunter';
            case 'strategies': return 'Strategies';
            case 'accounts': return 'Accounts';
            case 'copier': return 'Trade Copier';
            case 'finance': return 'Personal Finance';
            case 'diary': return 'Diary';
            case 'backtest': return isSessionActive ? 'Backtest Execution' : 'Backtesting';
            case 'optimization-results': return 'Optimization Results';
            default: return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        }
    };

    return (
        <header className="h-16 border-b border-white/5 glass sticky top-0 z-30 transition-all px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold text-primary tracking-tight">{getTitle()}</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Accounts-specific Action Buttons */}
                {activeTab === 'accounts' && (
                    <>
                        {/* New Trade Button */}
                        <button
                            onClick={() => !isSessionActive && setNewTradeModalOpen(true)}
                            disabled={isSessionActive}
                            className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors shadow-lg 
                                ${isSessionActive
                                    ? 'bg-white/5 text-tertiary cursor-not-allowed shadow-none'
                                    : 'bg-profit hover:bg-profit/90 shadow-profit/20'}`}
                        >
                            <Plus size={16} />
                            New Trade
                        </button>

                        {/* Action Buttons */}
                        <button className="flex items-center gap-2 px-3 py-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                            <Download size={14} />
                            <span className="text-xs font-medium">Export</span>
                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                            <Layout size={14} />
                            <span className="text-xs font-medium">Components</span>
                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                            <Palette size={14} />
                            <span className="text-xs font-medium">Theme</span>
                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors">
                            <Filter size={14} />
                            <span className="text-xs font-medium">Filter</span>
                        </button>

                        <div className="h-6 w-px bg-white/10" />
                    </>
                )}

                <button className="p-2 text-tertiary hover:text-primary hover:bg-white/5 rounded-lg transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-loss rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </button>
            </div>
        </header>
    );
};


