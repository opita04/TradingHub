import React from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

export const RecentTradesWidget: React.FC = () => {
    // Mock data for UI demo
    const trades = [
        { id: 1, pair: 'XAUUSD', type: 'Long', price: '2,045.50', pl: 1250, date: '10:45 AM' },
        { id: 2, pair: 'NQ100', type: 'Short', price: '16,850.25', pl: -450, date: '09:30 AM' },
        { id: 3, pair: 'EURUSD', type: 'Long', price: '1.0850', pl: 320, date: 'Yesterday' },
        { id: 4, pair: 'BTCUSD', type: 'Long', price: '42,150.00', pl: 2100, date: 'Yesterday' },
        { id: 5, pair: 'US30', type: 'Short', price: '37,500.00', pl: -850, date: 'Oct 22' },
    ];

    return (
        <div className="glass-card p-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-200">Recent Trades</h3>
                <button className="text-gray-500 hover:text-white transition-colors">
                    <MoreHorizontal size={16} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                {trades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trade.pl >= 0
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'}`}>
                                {trade.pl >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-200">{trade.pair}</span>
                                    <span className={`text-[10px] px-1 rounded ${trade.type === 'Long' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {trade.type}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-500">{trade.date} • @{trade.price}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`block text-xs font-bold ${trade.pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.pl >= 0 ? '+' : ''}${Math.abs(trade.pl)}
                            </span>
                            <span className="text-[10px] text-gray-600 group-hover:text-gray-400 transition-colors">
                                Closed
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs font-medium text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition-all">
                View All History
            </button>
        </div>
    );
};
