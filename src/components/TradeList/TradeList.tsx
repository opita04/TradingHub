import { useState } from 'react';
import { useTradeStore } from '../../stores/tradeStore';
import { TradeCard } from './TradeCard';
import { TradeTable } from './TradeTable';
import { Eye, EyeOff, Filter, LayoutList, Table as TableIcon } from 'lucide-react';

export function TradeList() {
    const trades = useTradeStore((state) => state.trades);
    const [globalShowScreenshots, setGlobalShowScreenshots] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'table'>('table'); // Default to Table as per "Table-first" request

    // Sorting: Newest first
    const sortedTrades = [...trades].sort((a, b) => b.createdAt - a.createdAt);

    if (trades.length === 0) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <div className="bg-surface-highlight rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Filter size={32} className="text-tertiary" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 mb-2">No trades logged yet</h3>
                <p className="text-tertiary">Go to the "Log Trade" tab to add your first trade.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-secondary">
                        {trades.length} Trade{trades.length !== 1 ? 's' : ''}
                    </span>
                    <div className="h-4 w-px bg-white/10" />
                    {/* View Toggle */}
                    <div className="flex bg-surface-highlight p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-white/10 text-primary shadow-sm' : 'text-tertiary hover:text-secondary'}`}
                        >
                            <TableIcon size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-primary shadow-sm' : 'text-tertiary hover:text-secondary'}`}
                        >
                            <LayoutList size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Global Screenshot Toggle - Only for List View */}
                    {viewMode === 'list' && (
                        <button
                            onClick={() => setGlobalShowScreenshots(!globalShowScreenshots)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                                ${globalShowScreenshots
                                    ? 'bg-brand/10 text-brand border border-brand/50'
                                    : 'bg-surface text-secondary border border-white/10 hover:text-primary'}
                            `}
                        >
                            {globalShowScreenshots ? <EyeOff size={16} /> : <Eye size={16} />}
                            {globalShowScreenshots ? 'Hide Screens' : 'Show Screens'}
                        </button>
                    )}

                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-white/10 text-sm text-secondary hover:text-primary transition-colors">
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            {/* Trade List / Table */}
            <div className={`animate-fade-in ${viewMode === 'list' ? 'space-y-4' : ''}`}>
                {viewMode === 'table' ? (
                    <div className="glass-panel rounded-xl overflow-hidden">
                        <TradeTable trades={sortedTrades} />
                    </div>
                ) : (
                    sortedTrades.map((trade) => (
                        <TradeCard
                            key={trade.id}
                            trade={trade}
                            globalShowScreenshots={globalShowScreenshots}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
